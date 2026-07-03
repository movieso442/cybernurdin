import { randomBytes, createHash } from 'crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid transcription errors

function randomSegment(length: number) {
  const bytes = randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

/** Generates a coupon like CYBER-7F3K-Q9WZ-2MXR. High-entropy, never persisted in plain form. */
export function generateCouponCode() {
  return `CYBER-${randomSegment(4)}-${randomSegment(4)}-${randomSegment(4)}`;
}

/**
 * Coupons are high-entropy random tokens (not user-chosen passwords), so a
 * fast cryptographic hash is the appropriate control here — the standard
 * approach for API-key-shaped secrets, unlike slow password hashing
 * (bcrypt/scrypt), which exists to slow down guessing low-entropy secrets.
 */
export function hashCoupon(code: string) {
  return createHash('sha256').update(code.trim().toUpperCase()).digest('hex');
}
