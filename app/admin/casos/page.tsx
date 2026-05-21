import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/services/authService';
import { getAllCases } from '@/lib/services/caseService';
import Sidebar from '@/components/admin/Sidebar';
import CasesManager from '@/components/admin/CasesManager';
import type { CaseStudy } from '@/types/case';

export default async function AdminCasesPage() {
  const session = await verifyAdminSession();
  if (!session) redirect('/admin/login');

  const cases = await getAllCases().catch(() => [] as CaseStudy[]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <CasesManager initialCases={cases} />
      </main>
    </div>
  );
}
