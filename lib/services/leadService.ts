import { createAdminClient } from '@/lib/supabase/admin';
import { resend, buildLeadEmailHtml } from '@/lib/resend';
import { hashIp } from '@/lib/security/hashIp';
import type { Lead, CreateLeadInput } from '@/types/lead';

export async function createLead(
  input: CreateLeadInput,
  rawIp: string,
): Promise<{ id: string }> {
  const supabase = createAdminClient();
  const hashedIp = hashIp(rawIp);

  const { data, error } = await supabase
    .from('leads')
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      company: input.company ?? null,
      project_type: input.project_type,
      budget: input.budget,
      message: input.message,
      locale: input.locale,
      ip_hash: hashedIp,
      user_agent: input.user_agent,
      status: 'new',
    })
    .select('id')
    .single();

  if (error) {
    console.error('[leadService] Insert failed:', error.code);
    throw new Error('Failed to create lead');
  }

  // Fire notification email (non-blocking — don't fail the request if email fails)
  const recipients = (process.env.SOCIOS_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  if (recipients.length > 0) {
    const emailPromise = resend.emails.send({
      from: 'JDC Developers <noreply@jdcdevelopers.com>',
      to: recipients,
      subject: `Nuevo lead: ${input.name} (${input.project_type})`,
      html: buildLeadEmailHtml({
        name: input.name,
        email: input.email,
        phone: input.phone,
        company: input.company,
        project_type: input.project_type,
        budget: input.budget,
        message: input.message,
        locale: input.locale,
        created_at: new Date().toISOString(),
      }),
    });

    emailPromise.catch((err: unknown) => {
      console.error('[leadService] Email notification failed:', err instanceof Error ? err.message : 'unknown');
    });
  }

  return { id: data.id as string };
}

export async function getLeads(filters?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Lead[]> {
  const supabase = createAdminClient();

  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters?.search) {
    query = query.ilike('email', `%${filters.search}%`);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit ?? 50) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[leadService] getLeads failed:', error.code);
    throw new Error('Failed to fetch leads');
  }

  return (data ?? []) as Lead[];
}

export async function updateLeadStatus(
  id: string,
  status: Lead['status'],
): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('[leadService] updateStatus failed:', error.code);
    throw new Error('Failed to update lead status');
  }
}
