'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Settings, LogOut, FileText } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/content', label: 'Contenido', icon: FileText },
  { href: '/admin/config', label: 'Config', icon: Settings },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  return (
    <aside className="w-56 shrink-0 bg-bg-surface border-r border-border flex flex-col min-h-screen">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-border">
        <Link href="/admin" className="text-base font-semibold text-primary tracking-tight">
          JDC<span className="text-accent-purple">.</span>
          <span className="text-sm font-normal text-dim ml-1">admin</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-col flex-1 gap-1 p-3" aria-label="Admin navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === href
                ? 'bg-bg-elevated text-primary'
                : 'text-muted hover:text-primary hover:bg-bg-elevated',
            )}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-muted hover:text-primary hover:bg-bg-elevated transition-colors"
        >
          <LogOut size={16} aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
