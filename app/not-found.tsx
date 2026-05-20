import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="es">
      <body className="bg-bg-base min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-6 px-6">
          <h1 className="text-6xl font-medium text-primary">404</h1>
          <p className="text-muted">Página no encontrada</p>
          <Link
            href="/"
            className="text-sm text-accent-purple hover:text-primary transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </body>
    </html>
  );
}
