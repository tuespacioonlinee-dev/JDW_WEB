import { createClient } from '@/lib/supabase/server';

export type AdminSession = {
  userId: string;
  email: string;
};

export async function verifyAdminSession(): Promise<AdminSession | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    return null;
  }

  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!adminEmails.includes(user.email.toLowerCase())) {
    console.warn('[authService] Unauthorized access attempt:', user.email);
    return null;
  }

  return { userId: user.id, email: user.email };
}

export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
