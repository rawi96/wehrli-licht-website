import { EMAIL_BRAND, getEmailLogoUrl, getEmailSiteUrl } from './brand';
import { escapeHtml } from '@/lib/text';
import type { EmailSender } from './sender';

const { primary: brandColor } = EMAIL_BRAND;

const renderEmailHeader = (companyName: string): string => {
  const logoUrl = getEmailLogoUrl();
  const siteUrl = getEmailSiteUrl();

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-collapse:collapse;">
      <tr>
        <td style="padding:0 0 20px;border-bottom:3px solid ${brandColor};">
          <a href="${escapeHtml(siteUrl)}" style="text-decoration:none;">
            <img
              src="${escapeHtml(logoUrl)}"
              alt="${escapeHtml(companyName)}"
              width="200"
              height="50"
              style="display:block;border:0;height:auto;max-width:200px;width:200px;"
            />
          </a>
        </td>
      </tr>
    </table>`;
};

export const emailLayout = (title: string, body: string, sender: EmailSender): string => {
  const siteUrl = getEmailSiteUrl();

  return `<!DOCTYPE html>
<html lang="de">
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;line-height:1.5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;padding:32px;border-radius:4px;">
            <tr>
              <td>
                ${renderEmailHeader(sender.companyName)}
                <h1 style="margin:0 0 24px;font-size:22px;line-height:1.3;color:${brandColor};">${escapeHtml(title)}</h1>
                ${body}
                <p style="margin:32px 0 0;padding-top:20px;border-top:1px solid #eee;font-size:13px;color:#666;">
                  <a href="${escapeHtml(siteUrl)}" style="color:${brandColor};text-decoration:none;font-weight:bold;">${escapeHtml(sender.companyName)}</a>${
                    sender.address
                      ? `<br />
                  ${escapeHtml(sender.address)}`
                      : ''
                  }
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
