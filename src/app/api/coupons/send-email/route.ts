import { NextResponse } from 'next/server';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';

export const runtime = 'nodejs';

type CouponEmailBody = {
  email?: string;
  firstName?: string;
  couponCode?: string;
  pathTitle?: string;
};

function clean(value?: string) {
  return value?.trim() || '';
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function couponEmailContent(body: Required<CouponEmailBody>) {
  const name = body.firstName || 'there';
  const pathTitle = body.pathTitle || 'your CyberNurdin mentorship path';
  const text = [
    `Hi ${name},`,
    '',
    'Your CyberNurdin learner account has been created.',
    `Mentorship path: ${pathTitle}`,
    `Coupon code: ${body.couponCode}`,
    '',
    'Use this coupon code with your email or username and password to sign in.',
    '',
    'CyberNurdin',
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;background:#faf7f0;padding:28px;color:#061c36">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid rgba(6,28,54,.1);border-radius:12px;overflow:hidden">
        <div style="background:#061c36;color:#ffffff;padding:22px 24px">
          <h1 style="margin:0;font-size:22px;line-height:1.3">Your CyberNurdin coupon code</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,.72)">Use it to unlock your learner dashboard.</p>
        </div>
        <div style="padding:24px">
          <p style="margin:0 0 14px">Hi ${escapeHtml(name)},</p>
          <p style="margin:0 0 14px">Your CyberNurdin learner account has been created for <strong>${escapeHtml(pathTitle)}</strong>.</p>
          <div style="margin:20px 0;padding:18px;border-radius:10px;background:#fff2ed;border:1px dashed rgba(249,87,56,.5)">
            <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:#f95738;letter-spacing:.08em">Coupon code</div>
            <div style="margin-top:8px;font-size:26px;font-weight:900;letter-spacing:.04em;color:#061c36">${escapeHtml(body.couponCode)}</div>
          </div>
          <p style="margin:0;color:rgba(6,28,54,.68)">Sign in with your email or username, password, and this coupon code.</p>
        </div>
      </div>
    </div>
  `;

  return { text, html };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as CouponEmailBody;
  const email = clean(body.email);
  const couponCode = clean(body.couponCode);
  const firstName = clean(body.firstName);
  const pathTitle = clean(body.pathTitle);

  if (!email || !email.includes('@') || !couponCode) {
    return NextResponse.json(
      { sent: false, status: 'failed', message: 'A valid email and coupon code are required.' },
      { status: 400 },
    );
  }

  if (!isFirebaseConfigured || !db) {
    return NextResponse.json({
      sent: false,
      status: 'not-configured',
      message: 'Firebase is not configured, so the coupon email could not be queued.',
    });
  }

  const payload = {
    email,
    firstName,
    couponCode,
    pathTitle,
  };
  const content = couponEmailContent(payload);
  const mailCollection = clean(process.env.FIREBASE_MAIL_COLLECTION) ||
    clean(process.env.NEXT_PUBLIC_FIREBASE_MAIL_COLLECTION) ||
    'mail';

  try {
    await addDoc(collection(db, mailCollection), {
      to: email,
      message: {
        subject: 'Your CyberNurdin coupon code',
        text: content.text,
        html: content.html,
      },
      metadata: {
        type: 'coupon_email',
        couponCode,
        pathTitle,
      },
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      sent: true,
      status: 'sent',
      message: `Coupon email queued in Firebase collection "${mailCollection}".`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        sent: false,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Could not queue coupon email in Firebase.',
      },
      { status: 502 },
    );
  }
}
