'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
        },
      });

      if (error) {
        toast.error('Error al enviar el link. Verificá el email.');
        return;
      }

      setSent(true);
    } catch {
      toast.error('Error inesperado. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-2xl font-semibold text-primary tracking-tight">
            JDC<span className="text-accent-purple">.</span>
          </span>
          <p className="text-sm text-dim mt-1">Panel de administración</p>
        </div>

        {sent ? (
          <div className="bg-bg-surface border border-border rounded-2xl p-8 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[rgba(93,202,165,0.1)] border border-[rgba(93,202,165,0.2)] flex items-center justify-center">
              <CheckCircle size={24} className="text-accent-teal" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium text-primary">Link enviado</p>
              <p className="text-sm text-muted mt-1">
                Revisá tu casilla <strong>{email}</strong> y hacé click en el link.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-bg-surface border border-border rounded-2xl p-8">
            <h1 className="text-lg font-medium text-primary mb-6">Acceder al panel</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="vos@jdcdevelopers.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <Button type="submit" loading={loading} className="w-full gap-2">
                <Mail size={16} aria-hidden="true" />
                Enviarme link de acceso
              </Button>
            </form>
            <p className="text-xs text-dim text-center mt-4">
              Solo emails autorizados pueden acceder.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
