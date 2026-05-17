import { CHECKOUT_EMAIL_BRAND, getCheckoutEmailLogoUrl, getCheckoutEmailSiteUrl } from '@/constants/checkout-email-brand';
import { escapeHtml } from '@/utils/text';

const { primary: brandColor } = CHECKOUT_EMAIL_BRAND;

const renderEmailHeader = (): string => {
  const logoUrl = getCheckoutEmailLogoUrl();
  const siteUrl = getCheckoutEmailSiteUrl();

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-collapse:collapse;">
      <tr>
        <td style="padding:0 0 20px;border-bottom:3px solid ${brandColor};">
          <a href="${escapeHtml(siteUrl)}" style="text-decoration:none;">
            <img
              src="${escapeHtml(logoUrl)}"
              alt="Wehrli Licht GmbH"
              width="200"
              height="50"
              style="display:block;border:0;height:auto;max-width:200px;width:200px;"
            />
          </a>
        </td>
      </tr>
    </table>`;
};

export const emailLayout = (title: string, body: string): string => {
  const siteUrl = getCheckoutEmailSiteUrl();

  return `<!DOCTYPE html>
<html lang="de">
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;line-height:1.5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;padding:32px;border-radius:4px;">
            <tr>
              <td>
                ${renderEmailHeader()}
                <h1 style="margin:0 0 24px;font-size:22px;line-height:1.3;color:${brandColor};">${escapeHtml(title)}</h1>
                ${body}
                <p style="margin:32px 0 0;padding-top:20px;border-top:1px solid #eee;font-size:13px;color:#666;">
                  <a href="${escapeHtml(siteUrl)}" style="color:${brandColor};text-decoration:none;font-weight:bold;">Wehrli Licht GmbH</a><br />
                  Blumenstrasse 66 · 9403 Goldach
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
