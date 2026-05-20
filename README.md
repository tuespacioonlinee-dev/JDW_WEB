# JDC Developers — Web Corporativa

Sitio web corporativo de **JDC Developers**, software factory con base en Tucumán, Argentina.

**Objetivo:** Generar leads cualificados → todos los CTAs empujan a agendar reunión.

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router, React 19, TypeScript estricto) |
| Estilos | Tailwind CSS v3 |
| Animaciones | Framer Motion |
| i18n | next-intl (ES + EN) |
| DB + Auth | Supabase (Postgres + RLS + Magic Link) |
| Emails | Resend |
| Rate limiting | Upstash Redis |
| Hosting | Vercel |

## Desarrollo local

```bash
git clone https://github.com/tuespacioonlinee-dev/JDW_WEB.git
cd JDW_WEB
npm install
cp .env.example .env.local
npm run dev
```

Abre http://localhost:3000

## Scripts

- `npm run dev` — dev server
- `npm run build` — build de producción
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript sin emit

## Documentación

- [ARCHITECTURE.md](./ARCHITECTURE.md) — arquitectura en capas
- [SECURITY.md](./SECURITY.md) — playbook de seguridad
- [.env.example](./.env.example) — variables requeridas

Fundado por Tomi, Carlos y Juan B. — Tucumán, Argentina
