/**
 * Sends the coupon code by email if an email provider is configured.
 * Otherwise this is a safe no-op — the admin UI shows the plaintext coupon
 * once so it can be copied manually, per the "no email provider yet" case.
 */
export async function sendCouponEmail(email: string, couponCode: string) {
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.log(`[email] No email provider configured — coupon for ${email} was not emailed. Copy it from the admin UI.`);
    return { sent: false as const };
  }

  try {
    // Assumes Resend (https://resend.com) as the email provider, since none
    // was specified. Swap this fetch call for your actual provider's API if
    // you use something else (SendGrid, Postmark, etc.) — the no-op path
    // above already covers "no provider configured yet" safely either way.
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: 'Your CyberNurdin mentorship access code',
        html: `<p>Your application has been approved.</p><p>Activate your access at <strong>/activate-access</strong> using this code:</p><p style="font-size:20px;font-weight:bold;letter-spacing:1px;">${couponCode}</p>`,
      }),
    });

    if (!response.ok) {
      console.error('[email] Provider returned an error', await response.text());
      return { sent: false as const };
    }

    return { sent: true as const };
  } catch (error) {
    console.error('[email] Failed to send coupon email', error);
    return { sent: false as const };
  }
}
