import { db } from '../src/lib/db';
import { coupons } from '../drizzle/schema';
import { generateCouponCode, hashCoupon } from '../src/lib/coupon';

/**
 * Manual coupon issuance, independent of the admin UI. Useful for ops when
 * you need to grant access without an application on file.
 *
 * Usage:
 *   npm run generate-coupon -- someone@example.com introduction-to-cybersecurity
 */
async function main() {
  const [email, allowedPath = 'path-intro'] = process.argv.slice(2);

  if (!email) {
    console.error('Usage: npm run generate-coupon -- <email> [allowed-path-slug]');
    process.exit(1);
  }

  const plainCoupon = generateCouponCode();

  await db.insert(coupons).values({
    codeHash: hashCoupon(plainCoupon),
    email,
    status: 'active',
    role: 'mentee',
    allowedPath,
  });

  console.log('=================================================');
  console.log(' Coupon generated');
  console.log('=================================================');
  console.log(` email:        ${email}`);
  console.log(` allowed path: ${allowedPath}`);
  console.log(` coupon code:  ${plainCoupon}`);
  console.log('=================================================');
  console.log(' This code is shown once and was not saved in plain form.');

  process.exit(0);
}

main().catch((error) => {
  console.error('Coupon generation failed:', error);
  process.exit(1);
});
