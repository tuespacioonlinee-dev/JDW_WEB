'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'email' | 'otp';

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: { shouldCreateUser: true },
      });

      if (error) {
        toast.error('Error al enviar el código. Verificá el email.');
        return;
      }

      toast.success('Código enviado. Revisá tu mail.');
      setStep('otp');
    } catch {
      toast.error('Error inesperado. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    const cleanCode = code.trim();
    if (cleanCode.length !== 6) {
      toast.error('El código tiene 6 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: cleanCode,
        type: 'email',
      });

      if (error) {
        toast.error('Código incorrecto o expirado.');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      toast.error('Error inesperado. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-2xl font-semibold text-primary tracking-tight">
            JDC<span className="text-accent-purple">.</span>
          </span>
          <p className="text-sm text-dim mt-1">Panel de administración</p>
        </div>

        <div className="bg-bg-surface border border-border rounded-2xl p-8">
          {step === 'email' ? (
            <>
              <h1 className="text-lg font-medium text-primary mb-6">Acceder al panel</h1>
              <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
                <Input
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="vos@jdcdevelopers.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
                <Button type="submit" loading={loading} className="w-full gap-2">
                  <Mail size={16} aria-hidden="true" />
                  Enviarme un código
                </Button>
              </form>
              <p className="text-xs text-dim text-center mt-4">
                Solo emails autorizados pueden acceder.
              </p>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setCode('');
                }}
                className="flex items-center gap-1.5 text-xs text-dim hover:text-primary transition-colors mb-4"
              >
                <ArrowLeft size={12} aria-hidden="true" />
                Cambiar email
              </button>
              <h1 className="text-lg font-medium text-primary mb-2">Ingresá el código</h1>
              <p className="text-sm text-muted mb-6">
                Te mandamos un código de 6 dígitos a <strong className="text-primary">{email}</strong>.
              </p>
              <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  label="Código de 6 dígitos"
                  placeholder="000000"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  autoComplete="one-time-code"
                  autoFocus
                  className="text-center text-lg tracking-[0.5em] font-mono"
                />
                <Button type="submit" loading={loading} disabled={code.length !== 6} className="w-full gap-2">
                  <KeyRound size={16} aria-hidden="true" />
                  Verificar y entrar
                </Button>
              </form>
              <p className="text-xs text-dim text-center mt-4">
                ¿No te llegó? Revisá la carpeta de spam.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
