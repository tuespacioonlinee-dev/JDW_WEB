# Security Policy — JDC Developers Web

## Reporting a Vulnerability

If you discover a security vulnerability, **do not open a public issue**.

Contact us privately at **seguridad@jdcdevelopers.com** with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Optional: suggested fix

We will acknowledge receipt within **48 hours** and aim to resolve critical issues within **7 days**.

---

## Secret Rotation Procedures

### Supabase Anon Key
1. Go to Supabase Dashboard → Settings → API
2. Rotate the `anon` key
3. Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel
4. Redeploy (no code change needed)

### Supabase Service Role Key
1. Go to Supabase Dashboard → Settings → API
2. Rotate the `service_role` key
3. Update `SUPABASE_SERVICE_ROLE_KEY` in Vercel
4. Redeploy immediately

### Resend API Key
1. Go to Resend Dashboard → API Keys
2. Create new key, revoke old one
3. Update `RESEND_API_KEY` in Vercel
4. Test email delivery

### Upstash Redis Token
1. Go to Upstash Console → Database → Reset token
2. Update `UPSTASH_REDIS_REST_TOKEN` in Vercel
3. Redeploy

### Turnstile Keys
1. Go to Cloudflare Dashboard → Turnstile
2. Rotate site key and secret key
3. Update both in Vercel env vars
4. Redeploy

### IP_HASH_SALT
> **Warning:** Rotating this key invalidates all existing hashed IPs in logs.
1. Generate new 32+ char random string: `openssl rand -hex 32`
2. Update `IP_HASH_SALT` in Vercel
3. Redeploy
4. Note: historical IP hashes in Supabase leads table will no longer match

---

## Incident Response Playbook

### Suspected Breach

1. **Immediately revoke** all service role keys and API tokens
2. **Enable Supabase database pause** if data exfiltration is suspected
3. **Review Vercel logs** for abnormal traffic patterns
4. **Review Supabase Auth logs** for unauthorized admin access
5. **Notify affected parties** if personal data was compromised (GDPR/PDPL)
6. **Document the incident** in a private incident report

### Compromised Admin Account

1. Go to Supabase Auth Dashboard
2. Disable the compromised user account
3. Rotate JWT secret in Supabase Settings
4. Review all recent admin actions in audit logs
5. Re-enable account only after verifying no further compromise

### Rate Limit Bypass / DoS Attempt

1. Review Upstash Redis logs for patterns
2. Block offending IPs at Vercel/Cloudflare level
3. Consider reducing rate limits temporarily
4. Escalate to Cloudflare DDoS protection if volumetric

---

## Quarterly Security Audit Checklist

### Dependencies
- [ ] Run `npm audit` — resolve any high/critical findings
- [ ] Review Dependabot PRs — merge security patches within 7 days
- [ ] Check for outdated major versions: `npx npm-check-updates`

### Access Control
- [ ] Verify `ADMIN_EMAILS` list is current (remove departed team members)
- [ ] Review Supabase RLS policies — no policies = blocked, confirm intentional
- [ ] Verify no `SUPABASE_SERVICE_ROLE_KEY` in NEXT_PUBLIC_ vars
- [ ] Check Vercel team members and access levels

### Infrastructure
- [ ] Verify security headers at https://securityheaders.com → target A+
- [ ] Verify SSL at https://www.ssllabs.com/ssltest → target A+
- [ ] Test Turnstile widget is loading and blocking bots
- [ ] Verify Upstash rate limits are active (test with curl)

### Monitoring
- [ ] Review Sentry error trends — no new recurring errors
- [ ] Review Vercel Analytics for anomalous traffic
- [ ] Check Supabase disk usage — no unexpected growth

### Secrets
- [ ] Rotate `IP_HASH_SALT` (optional, document if done)
- [ ] Review age of all API keys — rotate any older than 90 days
- [ ] Verify `.env.example` is up to date with all required vars

---

## Defense in Depth Layers

| Layer | Implementation | Where |
|-------|---------------|-------|
| HTTP Headers | HSTS, X-Frame-Options, CSP, etc. | `next.config.mjs` + `middleware.ts` |
| Rate Limiting | Upstash Redis, per-IP | `/lib/security/rateLimit.ts` |
| Input Validation | Zod strict schemas | `/lib/validation/*.ts` |
| HTML Sanitization | DOMPurify (server-side) | `/lib/security/sanitize.ts` |
| Row Level Security | Supabase RLS on all tables | Supabase migrations |
| Admin Auth | Magic link + email whitelist | `/lib/services/authService.ts` |
| Bot Protection | Cloudflare Turnstile + honeypot | `/app/api/lead/route.ts` |
| Secrets Management | Vercel env vars only | Never in code |
| Dependency Security | Dependabot + npm audit | `.github/dependabot.yml` |
| Error Monitoring | Sentry | `sentry.*.config.ts` |
