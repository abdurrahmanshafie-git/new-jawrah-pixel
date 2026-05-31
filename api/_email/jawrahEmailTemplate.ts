export const SITE_URL = 'https://jawrahpixel.com';
export const DASHBOARD_URL = `${SITE_URL}/dashboard`;
export const LOGO_URL = `${SITE_URL}/assets/logo.png`;
export const FALLBACK_ADMIN_EMAIL = 'jawrahpixel@gmail.com';
export const FALLBACK_FROM_EMAIL = 'projects@jawrahpixel.com';

export function escapeHtml(value: string | undefined): string {
  return (value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function display(value: string | undefined, fallback = 'To be confirmed'): string {
  return escapeHtml(value?.trim() || fallback);
}

export function paragraph(value: string | undefined): string {
  return display(value, 'No additional details provided.').replace(/\n/g, '<br />');
}

export function formatFromAddress(email = FALLBACK_FROM_EMAIL): string {
  if (email.includes('<') && email.includes('>')) return email;
  return `Jawrah Pixel <${email}>`;
}

export interface JawrahEmailTemplateOptions {
  preview: string;
  kicker: string;
  body: string;
  footerNote?: string;
}

export function emailFooter(note?: string): string {
  return `<tr>
  <td align="center" style="padding:24px 12px 0;color:#94a3b8;font-size:12px;line-height:20px;">
    <strong style="color:#ffffff;">Jawrah Pixel</strong><br />
    Premium Digital Experiences<br />
    <a href="${SITE_URL}" style="color:#67e8f9;text-decoration:none;">jawrahpixel.com</a> &nbsp;|&nbsp;
    <a href="mailto:${FALLBACK_ADMIN_EMAIL}" style="color:#67e8f9;text-decoration:none;">${FALLBACK_ADMIN_EMAIL}</a>
    ${note ? `<br /><span style="color:#64748b;">${escapeHtml(note)}</span>` : ''}
  </td>
</tr>`;
}

export function JawrahEmailTemplate({ preview, kicker, body, footerNote }: JawrahEmailTemplateOptions): string {
  const content = `${logoHeader(kicker)}${body}${emailFooter(footerNote)}`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark" />
    <meta name="supported-color-schemes" content="dark" />
    <title>Jawrah Pixel</title>
    <style>
      @media only screen and (max-width: 620px) {
        .container { width: 100% !important; }
        .px { padding-left: 20px !important; padding-right: 20px !important; }
        .stack { display: block !important; width: 100% !important; }
        .card { padding: 20px !important; }
        .hero-title { font-size: 30px !important; line-height: 36px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#050505;color:#f8fafc;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preview)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050505;background-image:radial-gradient(circle at 20% 0%,rgba(6,182,212,.18),transparent 30%),radial-gradient(circle at 86% 12%,rgba(59,130,246,.16),transparent 28%);">
      <tr>
        <td align="center" style="padding:34px 14px;">
          <table role="presentation" width="600" class="container" cellspacing="0" cellpadding="0" style="width:600px;max-width:600px;">
            ${content}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function logoHeader(kicker: string): string {
  return `<tr>
  <td class="px" style="padding:0 4px 22px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="left">
          <img src="${LOGO_URL}" width="132" alt="Jawrah Pixel" style="display:block;border:0;max-width:132px;height:auto;" />
        </td>
        <td align="right" style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#67e8f9;font-weight:700;">
          ${escapeHtml(kicker)}
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

export function summaryCard(label: string, value?: string, accent = false): string {
  return `<td class="stack" width="33.33%" style="padding:0 6px 12px;vertical-align:top;">
    <div style="border:1px solid ${accent ? 'rgba(6,182,212,.45)' : 'rgba(255,255,255,.10)'};background:rgba(255,255,255,.045);border-radius:14px;padding:16px;min-height:74px;box-shadow:0 18px 50px rgba(0,0,0,.24);">
      <div style="font-size:10px;letter-spacing:1.7px;text-transform:uppercase;color:#94a3b8;font-weight:700;margin-bottom:8px;">${escapeHtml(label)}</div>
      <div style="font-size:15px;line-height:20px;color:#ffffff;font-weight:700;">${display(value)}</div>
    </div>
  </td>`;
}

export function detailRow(label: string, value?: string): string {
  return `<tr>
    <td style="padding:13px 0;border-bottom:1px solid rgba(255,255,255,.08);font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#94a3b8;font-weight:700;width:34%;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:13px 0;border-bottom:1px solid rgba(255,255,255,.08);font-size:14px;line-height:21px;color:#f8fafc;font-weight:500;vertical-align:top;">${display(value, '-')}</td>
  </tr>`;
}

export function actionButton(label: string, href: string, primary = true): string {
  const bg = primary ? '#06b6d4' : 'transparent';
  const color = primary ? '#020617' : '#ffffff';
  const border = primary ? 'none' : '1px solid rgba(255,255,255,.18)';

  return `<td style="padding-right:${primary ? '10px' : '0'};">
    <a href="${href}" style="display:inline-block;padding:14px 22px;background:${bg};border:${border};border-radius:12px;color:${color};text-decoration:none;font-size:13px;font-weight:900;letter-spacing:.7px;text-transform:uppercase;box-shadow:${primary ? '0 16px 40px rgba(6,182,212,.25)' : 'none'};">${escapeHtml(label)}</a>
  </td>`;
}
