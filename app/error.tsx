'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="bg-bg-base min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-6 px-6">
          <h1 className="text-4xl font-medium text-primary">Algo salió mal</h1>
          <p className="text-muted text-sm">
            {process.env.NODE_ENV === 'development' ? error.message : 'Estamos trabajando para resolverlo.'}
          </p>
          <button
            onClick={reset}
            className="text-sm text-accent-purple hover:text-primary transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
