import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CHATBASE_SECRET = Deno.env.get('CHATBASE_SECRET')!;

// Build a HS256 JWT using Web Crypto (no external deps needed)
async function signJwt(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header  = { alg: 'HS256', typ: 'JWT' };
  const encode  = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const data = `${encode(header)}.${encode(payload)}`;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${data}.${b64}`;
}

Deno.serve(async (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Verify the caller is an authenticated Supabase user
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = await signJwt(
    {
      user_id: user.id,
      email:   user.email,
      exp:     Math.floor(Date.now() / 1000) + 3600, // 1 hour
    },
    CHATBASE_SECRET,
  );

  return new Response(JSON.stringify({ token }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
});
