import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/services/authService';
import { getLeads } from '@/lib/services/leadService';

export async function GET() {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const leads = await getLeads({ limit: 10000 });

    const headers = [
      'id', 'fecha', 'nombre', 'email', 'telefono', 'empresa',
      'tipo', 'presupuesto', 'idioma', 'estado', 'mensaje',
    ];

    function escapeCsv(value: string | null | undefined): string {
      if (value == null) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }

    const rows = leads.map((l) =>
      [
        l.id,
        l.created_at,
        l.name,
        l.email,
        l.phone ?? '',
        l.company ?? '',
        l.project_type,
        l.budget,
        l.locale,
        l.status,
        l.message,
      ]
        .map(escapeCsv)
        .join(','),
    );

    const csv = [headers.join(','), ...rows].join('\n');
    const date = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="leads-${date}.csv"`,
      },
    });
  } catch (err) {
    console.error('[api/leads/export]', err instanceof Error ? err.message : 'unknown');
    return NextResponse.json({ error: 'generic' }, { status: 500 });
  }
}
