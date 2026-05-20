type TurnstileVerifyResult = {
  success: boolean;
  errorCodes: string[];
};

export async function verifyTurnstile(token: string, ip?: string): Promise<TurnstileVerifyResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // In development without key, skip verification
  if (!secretKey || secretKey === 'your-turnstile-secret-key') {
    console.warn('[turnstile] Skipping verification — TURNSTILE_SECRET_KEY not set');
    return { success: true, errorCodes: [] };
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
    ...(ip ? { remoteip: ip } : {}),
  });

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    return { success: false, errorCodes: ['network-error'] };
  }

  const data = (await response.json()) as {
    success: boolean;
    'error-codes'?: string[];
  };

  return {
    success: data.success,
    errorCodes: data['error-codes'] ?? [],
  };
}
