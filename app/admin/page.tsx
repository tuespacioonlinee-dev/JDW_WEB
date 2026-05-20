import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/services/authService';
import Sidebar from '@/components/admin/Sidebar';

export default async function AdminDashboard() {
  const session = await verifyAdminSession();
  if (!session) redirect('/admin/login');

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-medium text-primary mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Leads totales', value: '—' },
            { label: 'Leads nuevos', value: '—' },
            { label: 'Tasa de conversión', value: '—' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-bg-surface border border-border rounded-xl p-6 flex flex-col gap-2"
            >
              <span className="text-3xl font-medium text-primary">{value}</span>
              <span className="text-sm text-muted">{label}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-dim mt-8">
          Bienvenido, <strong className="text-muted">{session.email}</strong>
        </p>
      </main>
    </div>
  );
}
