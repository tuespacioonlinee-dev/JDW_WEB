import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/services/authService';
import { getAllContent } from '@/lib/services/contentService';
import Sidebar from '@/components/admin/Sidebar';
import FieldEditor from '@/components/admin/FieldEditor';
import type { SiteContent } from '@/types/content';

export default async function AdminContentPage() {
  const session = await verifyAdminSession();
  if (!session) redirect('/admin/login');

  const content = await getAllContent().catch(() => [] as SiteContent[]);

  // Group by section
  const sections = content.reduce<Record<string, SiteContent[]>>((acc, item) => {
    const key = item.section;
    if (!acc[key]) acc[key] = [];
    acc[key]?.push(item);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-medium text-primary mb-2">Contenido del sitio</h1>
        <p className="text-sm text-muted mb-8">
          Editá los textos en ES y EN. Los cambios se reflejan en el sitio en tiempo real.
        </p>

        {Object.entries(sections).map(([section, items]) => (
          <section key={section} className="mb-10">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide border-b border-border pb-2 mb-4">
              {section}
            </h2>

            {/* Group by field, show ES+EN side by side */}
            <FieldGroup items={items} />
          </section>
        ))}
      </main>
    </div>
  );
}

function FieldGroup({ items }: { items: SiteContent[] }) {
  const fields = [...new Set(items.map((i) => i.field))];

  return (
    <div className="flex flex-col gap-6">
      {fields.map((field) => {
        const es = items.find((i) => i.field === field && i.locale === 'es');
        const en = items.find((i) => i.field === field && i.locale === 'en');

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
  );
}
