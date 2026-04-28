const BRAND_RED = '#dc2626';
const BRAND_DARK = '#0f172a';
const BRAND_DARK2 = '#1e293b';

function base(bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>AM Collision &amp; Towing</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

      <!-- HEADER -->
      <tr>
        <td style="background-color:${BRAND_DARK};border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center">
              <div style="display:inline-block;background-color:${BRAND_RED};padding:7px 18px;border-radius:6px;margin-bottom:14px;">
                <span style="color:#ffffff;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">AM COLLISION &amp; TOWING</span>
              </div>
            </td></tr>
            <tr><td align="center">
              <p style="color:#94a3b8;font-size:13px;margin:0;font-family:Arial,sans-serif;">500 Johnson Ave, Bohemia, NY 11716</p>
            </td></tr>
          </table>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="background-color:#ffffff;">
          ${bodyContent}
        </td>
      </tr>

      <!-- DIVIDER -->
      <tr>
        <td style="background-color:#ffffff;padding:0 40px;">
          <div style="height:3px;background:linear-gradient(90deg,${BRAND_RED},${BRAND_DARK2});border-radius:2px;"></div>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background-color:${BRAND_DARK};border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" style="padding-bottom:10px;">
              <a href="tel:+16316764440" style="color:${BRAND_RED};text-decoration:none;font-size:13px;font-weight:600;font-family:Arial,sans-serif;">+1 631-676-4440</a>
              <span style="color:#475569;font-size:13px;margin:0 8px;">·</span>
              <a href="mailto:amcollisionandtowing@gmail.com" style="color:${BRAND_RED};text-decoration:none;font-size:13px;font-family:Arial,sans-serif;">amcollisionandtowing@gmail.com</a>
            </td></tr>
            <tr><td align="center">
              <p style="color:#475569;font-size:12px;margin:0;font-family:Arial,sans-serif;">© ${new Date().getFullYear()} AM Collision &amp; Towing. All rights reserved.</p>
            </td></tr>
          </table>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="140" style="color:#64748b;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;vertical-align:top;padding-right:16px;font-family:Arial,sans-serif;">${label}</td>
          <td style="color:#1e293b;font-size:14px;font-weight:500;font-family:Arial,sans-serif;">${value}</td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function adminBadge(label: string, color: string): string {
  return `<span style="display:inline-block;background-color:${color}22;color:${color};border:1px solid ${color}44;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:Arial,sans-serif;">${label}</span>`;
}

// ─────────────────────────────────────────────────────────────
// LEAD emails
// ─────────────────────────────────────────────────────────────

export function leadUserEmail(r: Record<string, any>): string {
  return base(`
    <div style="padding:40px 40px 32px;">
      <h1 style="color:#0f172a;font-size:24px;font-weight:700;margin:0 0 8px;font-family:Arial,sans-serif;">Request Received ✓</h1>
      <p style="color:#64748b;font-size:15px;margin:0 0 28px;line-height:1.6;font-family:Arial,sans-serif;">
        Hi <strong style="color:#1e293b;">${r.name}</strong>, thank you for reaching out to AM Collision &amp; Towing.
        We've received your request and our team will contact you shortly.
      </p>

      <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:28px;">
        <p style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;font-family:Arial,sans-serif;">Your Request Summary</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${infoRow('Service', r.service_type)}
          ${r.phone ? infoRow('Phone', r.phone) : ''}
          ${r.email ? infoRow('Email', r.email) : ''}
          ${r.message ? infoRow('Message', r.message) : ''}
        </table>
      </div>

      <div style="background-color:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px;margin-bottom:28px;">
        <p style="color:#b91c1c;font-size:13px;font-weight:700;margin:0 0 4px;font-family:Arial,sans-serif;">24/7 Emergency Towing Available</p>
        <p style="color:#7f1d1d;font-size:13px;margin:0;font-family:Arial,sans-serif;">For urgent help, call us directly at <strong>+1 631-676-4440</strong></p>
      </div>

      <p style="color:#94a3b8;font-size:13px;margin:0;text-align:center;font-family:Arial,sans-serif;">
        We typically respond within <strong style="color:#64748b;">a few hours</strong> during business hours.
      </p>
    </div>`);
}

export function leadAdminEmail(r: Record<string, any>): string {
  return base(`
    <div style="padding:32px 40px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
        <div style="display:inline-block;">${adminBadge('New Lead', BRAND_RED)}</div>
        <span style="color:#94a3b8;font-size:13px;font-family:Arial,sans-serif;">${new Date(r.created_at || Date.now()).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
      </div>

      <h2 style="color:#0f172a;font-size:22px;font-weight:700;margin:0 0 20px;font-family:Arial,sans-serif;">${r.name}</h2>

      <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${infoRow('Service', r.service_type)}
          ${infoRow('Phone', `<a href="tel:${r.phone}" style="color:${BRAND_RED};text-decoration:none;">${r.phone}</a>`)}
          ${r.email ? infoRow('Email', `<a href="mailto:${r.email}" style="color:${BRAND_RED};text-decoration:none;">${r.email}</a>`) : ''}
          ${r.message ? infoRow('Message', r.message) : ''}
        </table>
      </div>

      <p style="color:#64748b;font-size:13px;text-align:center;font-family:Arial,sans-serif;">
        Log in to your <a href="https://amcollisionandtowing.com/admin" style="color:${BRAND_RED};font-weight:600;text-decoration:none;">admin dashboard</a> to manage this lead.
      </p>
    </div>`);
}

// ─────────────────────────────────────────────────────────────
// CONTACT emails
// ─────────────────────────────────────────────────────────────

export function contactUserEmail(r: Record<string, any>): string {
  return base(`
    <div style="padding:40px 40px 32px;">
      <h1 style="color:#0f172a;font-size:24px;font-weight:700;margin:0 0 8px;font-family:Arial,sans-serif;">Message Received ✓</h1>
      <p style="color:#64748b;font-size:15px;margin:0 0 28px;line-height:1.6;font-family:Arial,sans-serif;">
        Hi <strong style="color:#1e293b;">${r.name}</strong>, thank you for contacting us.
        We'll review your message and get back to you within <strong>24 hours</strong>.
      </p>

      <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:28px;">
        <p style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;font-family:Arial,sans-serif;">Your Message</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${r.subject ? infoRow('Subject', r.subject) : ''}
          ${infoRow('Email', r.email)}
          ${r.phone ? infoRow('Phone', r.phone) : ''}
          ${infoRow('Message', `<span style="line-height:1.6;">${r.message}</span>`)}
        </table>
      </div>

      <div style="background-color:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px;margin-bottom:28px;">
        <p style="color:#b91c1c;font-size:13px;font-weight:700;margin:0 0 4px;font-family:Arial,sans-serif;">Need urgent assistance?</p>
        <p style="color:#7f1d1d;font-size:13px;margin:0;font-family:Arial,sans-serif;">Call us 24/7 at <strong>+1 631-676-4440</strong></p>
      </div>
    </div>`);
}

export function contactAdminEmail(r: Record<string, any>): string {
  return base(`
    <div style="padding:32px 40px;">
      <div style="display:inline-block;margin-bottom:20px;">${adminBadge('New Message', '#2563eb')}</div>

      <h2 style="color:#0f172a;font-size:22px;font-weight:700;margin:0 0 6px;font-family:Arial,sans-serif;">${r.name}</h2>
      ${r.subject ? `<p style="color:#64748b;font-size:15px;margin:0 0 20px;font-family:Arial,sans-serif;">Subject: <strong style="color:#1e293b;">${r.subject}</strong></p>` : '<div style="margin-bottom:20px;"></div>'}

      <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${infoRow('Email', `<a href="mailto:${r.email}" style="color:${BRAND_RED};text-decoration:none;">${r.email}</a>`)}
          ${r.phone ? infoRow('Phone', `<a href="tel:${r.phone}" style="color:${BRAND_RED};text-decoration:none;">${r.phone}</a>`) : ''}
          ${infoRow('Message', `<span style="line-height:1.7;white-space:pre-wrap;">${r.message}</span>`)}
        </table>
      </div>

      <p style="color:#64748b;font-size:13px;text-align:center;font-family:Arial,sans-serif;">
        <a href="mailto:${r.email}?subject=Re: ${encodeURIComponent(r.subject || 'Your inquiry')}" style="display:inline-block;background-color:${BRAND_RED};color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:700;font-size:13px;font-family:Arial,sans-serif;">Reply to ${r.name}</a>
      </p>
    </div>`);
}

// ─────────────────────────────────────────────────────────────
// QUOTE emails
// ─────────────────────────────────────────────────────────────

export function quoteUserEmail(r: Record<string, any>): string {
  const vehicle = [r.vehicle_year, r.vehicle_make, r.vehicle_model].filter(Boolean).join(' ');
  return base(`
    <div style="padding:40px 40px 32px;">
      <h1 style="color:#0f172a;font-size:24px;font-weight:700;margin:0 0 8px;font-family:Arial,sans-serif;">Quote Request Received ✓</h1>
      <p style="color:#64748b;font-size:15px;margin:0 0 28px;line-height:1.6;font-family:Arial,sans-serif;">
        Hi <strong style="color:#1e293b;">${r.name}</strong>, we've received your quote request.
        Our estimators will review the details and reach out to you soon.
      </p>

      ${vehicle ? `
      <div style="background-color:#0f172a;border-radius:12px;padding:20px 24px;margin-bottom:20px;">
        <p style="color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;font-family:Arial,sans-serif;">Vehicle</p>
        <p style="color:#ffffff;font-size:20px;font-weight:700;margin:0;font-family:Arial,sans-serif;">${vehicle}${r.vehicle_color ? ` <span style="color:#94a3b8;font-size:14px;font-weight:400;">(${r.vehicle_color})</span>` : ''}</p>
      </div>` : ''}

      <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:24px;">
        <p style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;font-family:Arial,sans-serif;">Request Details</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${r.service_needed ? infoRow('Service', r.service_needed) : ''}
          ${infoRow('Phone', r.phone)}
          ${infoRow('Email', r.email)}
          ${r.estimated_budget ? infoRow('Est. Budget', r.estimated_budget) : ''}
          ${r.damage_description ? infoRow('Damage', r.damage_description) : ''}
        </table>
      </div>

      <div style="border-left:4px solid ${BRAND_RED};padding-left:16px;margin-bottom:28px;">
        <p style="color:#1e293b;font-size:14px;font-weight:600;margin:0 0 4px;font-family:Arial,sans-serif;">What happens next?</p>
        <p style="color:#64748b;font-size:13px;margin:0;line-height:1.6;font-family:Arial,sans-serif;">
          Our team will review your request and call you to schedule an in-person assessment. Most estimates are completed within 1–2 business days.
        </p>
      </div>

      <div style="background-color:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px;">
        <p style="color:#b91c1c;font-size:13px;font-weight:700;margin:0 0 4px;font-family:Arial,sans-serif;">Have questions?</p>
        <p style="color:#7f1d1d;font-size:13px;margin:0;font-family:Arial,sans-serif;">Call us directly at <strong>+1 631-676-4440</strong></p>
      </div>
    </div>`);
}

export function quoteAdminEmail(r: Record<string, any>): string {
  const vehicle = [r.vehicle_year, r.vehicle_make, r.vehicle_model].filter(Boolean).join(' ') || '—';
  return base(`
    <div style="padding:32px 40px;">
      <div style="display:inline-block;margin-bottom:20px;">${adminBadge('New Quote Request', '#d97706')}</div>

      <h2 style="color:#0f172a;font-size:22px;font-weight:700;margin:0 0 4px;font-family:Arial,sans-serif;">${r.name}</h2>
      <p style="color:#64748b;font-size:14px;margin:0 0 24px;font-family:Arial,sans-serif;">${vehicle}</p>

      <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:20px;">
        <p style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;font-family:Arial,sans-serif;">Customer</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${infoRow('Phone', `<a href="tel:${r.phone}" style="color:${BRAND_RED};text-decoration:none;font-weight:600;">${r.phone}</a>`)}
          ${infoRow('Email', `<a href="mailto:${r.email}" style="color:${BRAND_RED};text-decoration:none;">${r.email}</a>`)}
        </table>
      </div>

      <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:20px;">
        <p style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;font-family:Arial,sans-serif;">Vehicle &amp; Damage</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${infoRow('Vehicle', vehicle)}
          ${r.vehicle_color ? infoRow('Color', r.vehicle_color) : ''}
          ${r.service_needed ? infoRow('Service', r.service_needed) : ''}
          ${r.estimated_budget ? infoRow('Est. Budget', r.estimated_budget) : ''}
          ${r.damage_description ? infoRow('Damage', `<span style="line-height:1.6;white-space:pre-wrap;">${r.damage_description}</span>`) : ''}
        </table>
      </div>

      <p style="color:#64748b;font-size:13px;text-align:center;font-family:Arial,sans-serif;">
        <a href="https://amcollisionandtowing.com/admin" style="display:inline-block;background-color:${BRAND_RED};color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:700;font-size:13px;font-family:Arial,sans-serif;">Open Dashboard</a>
      </p>
    </div>`);
}
