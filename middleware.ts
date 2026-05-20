import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString('base64');
}

function buildCSP(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const sentryHost = '*.ingest.sentry.io';

  const directives = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com${isDev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: ${supabaseUrl ? `https://*.supabase.co` : ''}`,
    `font-src 'self'`,
    `connect-src 'self' ${supabaseUrl ? `${supabaseUrl} https://*.supabase.co` : ''} https://api.resend.com https://${sentryHost}`,
    `frame-src https://challenges.cloudflare.com`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ];

  return directives.join('; ');
}

function withSecurityHeaders(response: NextResponse, nonce: string): NextResponse {
  const csp = buildCSP(nonce);
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Nonce', nonce);
  return response;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nonce = generateNonce();

  // Admin routes: skip intl, apply auth guard
  if (pathname.startsWith('/admin')) {
    // Auth check happens in admin layout via server component
    // Middleware only applies security headers here
    const response = NextResponse.next();
    return withSecurityHeaders(response, nonce);
  }

  // API routes: skip intl
  if (pathname.startsWith('/api')) {
    const response = NextResponse.next();
    return withSecurityHeaders(response, nonce);
  }

  // Public routes: apply i18n middleware
  const response = intlMiddleware(request);
  return withSecurityHeaders(response, nonce);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
