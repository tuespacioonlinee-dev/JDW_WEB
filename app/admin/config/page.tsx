import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/services/authService';
import { getAllSettings } from '@/lib/services/settingsService';
import { getAllContent } from '@/lib/services/contentService';
import Sidebar from '@/components/admin/Sidebar';
import ConfigForm from '@/components/admin/ConfigForm';
import FieldEditor from '@/components/admin/FieldEditor';
import type { SettingsMap } from '@/lib/services/settingsService';
import type { SiteContent } from '@/types/content';

export default async function AdminConfigPage() {
  const session = await verifyAdminSession();
  if (!session) redirect('/admin/login');

  const settings = await getAllSettings().catch(() => ({}) as SettingsMap);
  const content = await getAllContent().catch(() => [] as SiteContent[]);
  const metrics = content.filter((c) => c.section === 'metrics');
  const metricFields = [...new Set(metrics.map((m) => m.field))];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-medium text-primary mb-2">Configuración</h1>
        <p className="text-sm text-muted mb-8">
          Datos de contacto, redes y agenda. Se reflejan en el sitio al instante.
        </p>

        <section className="mb-12 max-w-3xl">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wide border-b border-border pb-2 mb-4">
            Contacto, redes y Calendly
          </h2>
          <ConfigForm initial={settings} />
        </section>

        <section className="max-w-3xl">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wide border-b border-border pb-2 mb-4">
            Métricas del home
          </h2>
          {metricFields.length === 0 ? (
            <p className="text-sm text-dim">No hay métricas cargadas.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {metricFields.map((field) => {
                const es = metrics.find((m) => m.field === field && m.locale === 'es');
                const en = metrics.find((m) => m.field === field && m.locale === 'en');
                return (
                  <div key={field} className="bg-bg-surface border border-border rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {es && <FieldEditor item={es} />}
                      {en && <FieldEditor item={en} />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
