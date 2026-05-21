'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Mail, KeyRound, ArrowLeft, Lock } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'idle' | 'code';

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('idle');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRequestCode() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/request-otp', { method: 'POST' });

      if (res.status === 429) {
        toast.error('Demasiados intentos. Esperá unos minutos.');
        return;
      }

      const json = (await res.json()) as { ok: boolean };
      if (!json.ok) {
        toast.error('No pudimos enviar el código. Probá de nuevo en un rato.');
        return;
      }

      toast.success('Código enviado al mail del admin.');
      setStep('code');
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
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode }),
      });

      if (res.status === 429) {
        toast.error('Demasiados intentos. Esperá unos minutos.');
        return;
      }

      const json = (await res.json()) as { ok: boolean };
      if (!json.ok) {
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
          {step === 'idle' ? (
            <>
              <div className="flex flex-col items-center text-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[rgba(127,119,221,0.1)] border border-[rgba(127,119,221,0.2)] flex items-center justify-center">
                  <Lock size={18} className="text-accent-purple" aria-hidden="true" />
                </div>
                <h1 className="text-lg font-medium text-primary">Acceso restringido</h1>
                <p className="text-sm text-muted leading-relaxed">
                  Hacé click para recibir un código de 6 dígitos en el mail del administrador.
                </p>
              </div>
              <Button
                onClick={handleRequestCode}
                loading={loading}
                className="w-full gap-2"
              >
                <Mail size={16} aria-hidden="true" />
                Solicitar código
              </Button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep('idle');
                  setCode('');
                }}
                className="flex items-center gap-1.5 text-xs text-dim hover:text-primary transition-colors mb-4"
              >
                <ArrowLeft size={12} aria-hidden="true" />
                Volver
              </button>
              <h1 className="text-lg font-medium text-primary mb-2">Ingresá el código</h1>
              <p className="text-sm text-muted mb-6">
                Te enviamos un código de 6 dígitos al mail del administrador.
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
