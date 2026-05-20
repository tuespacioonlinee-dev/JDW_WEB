import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/services/authService';
import { getLeads } from '@/lib/services/leadService';
import Sidebar from '@/components/admin/Sidebar';
import LeadsTable from '@/components/admin/LeadsTable';

type Props = {
  searchParams: Promise<{ status?: string; search?: string }>;
};

const STATUS_LABELS: Record<string, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  won: 'Ganado',
  lost: 'Perdido',
};

export default async function AdminLeadsPage({ searchParams }: Props) {
  const session = await verifyAdminSession();
  if (!session) redirect('/admin/login');

  const { status, search } = await searchParams;

  const leads = await getLeads({
    status: status ?? 'all',
    search: search ?? '',
    limit: 100,
  }).catch(() => []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-primary">Leads</h1>
          <a
            href="/api/leads/export"
            className="text-sm text-accent-teal hover:text-primary transition-colors"
          >
            Exportar CSV →
          </a>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'new', 'contacted', 'won', 'lost'].map((s) => (
            <a
              key={s}
              href={`/admin/leads${s !== 'all' ? `?status=${s}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                (status ?? 'all') === s
                  ? 'bg-accent-purple text-white'
                  : 'bg-bg-elevated text-muted hover:text-primary'
              }`}
            >
              {s === 'all' ? 'Todos' : STATUS_LABELS[s]}
            </a>
          ))}
        </div>

        <LeadsTable leads={leads} />
      </main>
    </div>
  );
}
