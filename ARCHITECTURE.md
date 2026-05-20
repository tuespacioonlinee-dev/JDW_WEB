# Architecture — JDC Developers Web

## Overview

Clean Architecture (lightweight), 4 layers. **Import arrows flow downward only — never upward.**

```
PRESENTATION → APPLICATION → DOMAIN/SERVICES → INFRASTRUCTURE
```

---

## Layer Definitions

### PRESENTATION
**Location:** `/app/[locale]/*`, `/components/sections/*`, `/components/ui/*`, `/components/admin/*`

**Responsibility:** Render UI. Nothing else.

**Allowed imports:** UI components, Framer Motion, types, i18n messages  
**Forbidden imports:** `/lib/supabase/*`, `/lib/resend.ts`, anything from INFRASTRUCTURE  
**Forbidden logic:** SQL queries, Zod validation, business rules

---

### APPLICATION
**Location:** `/app/api/*/route.ts`, `/app/_actions/*.ts`

**Responsibility:** Orchestrate a use case.

**Typical flow:**
1. Verify auth (if applicable)
2. Apply rate limit
3. Validate input with Zod
4. Call exactly ONE service
5. Return response or error

**Allowed imports:** `/lib/services/*`, `/lib/validation/*`, `/lib/security/*`  
**Forbidden:** Direct DB queries, business logic

---

### DOMAIN / SERVICES
**Location:** `/lib/services/*.ts`

**Responsibility:** Pure business rules.

Examples:
- `leadService.ts` — "if honeypot != '' → bot, return fake ok"
- `leadService.ts` — "new lead creates record AND fires notification email"
- `contentService.ts` — fetch content for locale, fallback to 'es'
- `authService.ts` — verify session + email whitelist

**Allowed imports:** `/lib/supabase/*`, `/lib/resend.ts`, `/lib/upstash.ts`, `/types/*`, `/lib/security/*`  
**Forbidden:** Reading cookies directly, accessing request headers, importing from `/app/*`

---

### INFRASTRUCTURE
**Location:** `/lib/supabase/{client,server,admin}.ts`, `/lib/resend.ts`, `/lib/upstash.ts`, `/lib/turnstile.ts`

**Responsibility:** Talk to external services.

Each file exposes typed functions. If you swap Supabase for Neon tomorrow, only this layer changes.

**Rules:**
- `supabase/admin.ts` uses `service_role` key — SERVER ONLY, never imported in components
- `supabase/client.ts` uses `anon` key — browser, relies on RLS
- `supabase/server.ts` uses `anon` key — server with cookie-based session

---

## The Golden Rule

```
/components/* and /app/[locale]/* NEVER import from /lib/supabase/*
```

If you feel the urge to import Supabase in a component:
1. STOP
2. Create or use a server action in `/app/_actions/*.ts`
3. The server action calls the appropriate service
4. The service uses infrastructure

---

## Directory Structure

```
/app
  /[locale]/(public)/*     ← pages: home, servicios, trabajo, nosotros, contacto, gracias
  /[locale]/layout.tsx     ← locale layout
  /admin/*                 ← admin panel (no [locale], always Spanish)
  /api/lead/route.ts       ← POST: create lead
  /api/content/route.ts    ← PATCH: update content (admin only)
  /_actions/               ← server actions
/components
  /sections/               ← page sections (Navbar, Hero, Services, etc.)
  /ui/                     ← atomic UI components (Button, Card, Input, etc.)
  /admin/                  ← admin-specific components
  /motion/                 ← Framer Motion variants
/lib
  /supabase/               ← INFRASTRUCTURE: DB clients
  /services/               ← DOMAIN: business logic
  /validation/             ← Zod schemas
  /security/               ← rate limit, turnstile, sanitize, hashIp
  resend.ts                ← INFRASTRUCTURE: email client
/types/                    ← shared TypeScript types
/messages/                 ← i18n strings (es.json, en.json)
/supabase/migrations/      ← SQL migrations
```

---

## Security Architecture

See [SECURITY.md](./SECURITY.md) for full details.

Key principles:
- `service_role` key → only in `/lib/supabase/admin.ts` and server-side actions
- RLS enabled on ALL tables — no exceptions
- Every public endpoint: rate limit → validate → sanitize → process
- Admin routes: session check + email whitelist in middleware

---

## i18n Architecture

- Default locale: `es` (no prefix) → `jdcdevelopers.com`, `/servicios`
- Secondary locale: `en` (prefixed) → `jdcdevelopers.com/en`, `/en/services`
- UI strings: `/messages/{locale}.json` via `next-intl`
- Dynamic content: Supabase `site_content` table with `locale` column
- Admin panel: always Spanish, no locale routing
