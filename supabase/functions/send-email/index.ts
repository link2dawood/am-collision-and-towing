import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  leadUserEmail, leadAdminEmail,
  contactUserEmail, contactAdminEmail,
  quoteUserEmail, quoteAdminEmail,
} from './templates.ts';

const MJ_API_KEY     = Deno.env.get('MAILJET_API_KEY')!;
const MJ_SECRET_KEY  = Deno.env.get('MAILJET_SECRET_KEY')!;
const FROM_EMAIL     = Deno.env.get('FROM_EMAIL') ?? 'noreply@amcollisionandtowing.com';
const FROM_NAME      = 'AM Collision & Towing';
const FALLBACK_ADMIN = Deno.env.get('ADMIN_EMAIL') ?? 'amcollisionandtowing@gmail.com';
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET');

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: Record<string, unknown>;
}

interface NotificationSettings {
  admin_email: string;
  send_user_emails: boolean;
  send_admin_emails: boolean;
}

async function getAdminSettings(): Promise<NotificationSettings> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'notifications')
    .single();

  return (data?.value as NotificationSettings) ?? {
    admin_email: FALLBACK_ADMIN,
    send_user_emails: true,
    send_admin_emails: true,
  };
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const credentials = btoa(`${MJ_API_KEY}:${MJ_SECRET_KEY}`);

  const res = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      Messages: [
        {
          From:     { Email: FROM_EMAIL, Name: FROM_NAME },
          To:       [{ Email: to }],
          Subject:  subject,
          HTMLPart: html,
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mailjet ${res.status}: ${body}`);
  }
}

Deno.serve(async (req: Request) => {
  // Verify webhook secret when configured
  if (WEBHOOK_SECRET) {
    const sig = req.headers.get('x-webhook-secret');
    if (sig !== WEBHOOK_SECRET) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  // Only act on new rows
  if (payload.type !== 'INSERT') {
    return new Response(JSON.stringify({ skipped: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const r = payload.record;
  const table = payload.table;

  let settings: NotificationSettings;
  try {
    settings = await getAdminSettings();
  } catch {
    settings = { admin_email: FALLBACK_ADMIN, send_user_emails: true, send_admin_emails: true };
  }

  const jobs: Promise<void>[] = [];

  if (table === 'leads') {
    if (settings.send_user_emails && r.email) {
      jobs.push(sendEmail(
        r.email as string,
        'We received your request — AM Collision & Towing',
        leadUserEmail(r as Record<string, any>),
      ));
    }
    if (settings.send_admin_emails) {
      jobs.push(sendEmail(
        settings.admin_email,
        `🔔 New Lead: ${r.name} — ${r.service_type}`,
        leadAdminEmail(r as Record<string, any>),
      ));
    }
  } else if (table === 'contact_submissions') {
    if (settings.send_user_emails) {
      jobs.push(sendEmail(
        r.email as string,
        'We received your message — AM Collision & Towing',
        contactUserEmail(r as Record<string, any>),
      ));
    }
    if (settings.send_admin_emails) {
      jobs.push(sendEmail(
        settings.admin_email,
        `📩 New Contact: ${r.name}`,
        contactAdminEmail(r as Record<string, any>),
      ));
    }
  } else if (table === 'quote_requests') {
    if (settings.send_user_emails) {
      jobs.push(sendEmail(
        r.email as string,
        'Quote request received — AM Collision & Towing',
        quoteUserEmail(r as Record<string, any>),
      ));
    }
    if (settings.send_admin_emails) {
      const vehicle = [r.vehicle_year, r.vehicle_make, r.vehicle_model].filter(Boolean).join(' ');
      jobs.push(sendEmail(
        settings.admin_email,
        `🚗 New Quote: ${r.name}${vehicle ? ` — ${vehicle}` : ''}`,
        quoteAdminEmail(r as Record<string, any>),
      ));
    }
  }

  const results = await Promise.allSettled(jobs);
  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(r => r.reason?.message ?? String(r.reason));

  if (errors.length) {
    console.error('Email errors:', errors);
  }

  return new Response(
    JSON.stringify({ ok: true, sent: jobs.length - errors.length, errors }),
    { headers: { 'Content-Type': 'application/json' } },
  );
});
