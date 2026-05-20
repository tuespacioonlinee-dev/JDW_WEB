import { createHash } from 'crypto';

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? 'default-salt-change-in-production';
  return createHash('sha256').update(ip + salt).digest('hex');
}

export function extractIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0];
    return first ? first.trim() : 'unknown';
  }
  return 'unknown';
}
