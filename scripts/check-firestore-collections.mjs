import fs from 'node:fs';
import path from 'node:path';
import { expectedFirestoreCollections } from '../src/lib/firestore-schema.ts';

const envPath = path.resolve(process.cwd(), '.env.local');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(envPath);

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!projectId || !apiKey) {
  console.error('Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_API_KEY in .env.local.');
  process.exit(1);
}

const expected = expectedFirestoreCollections.map((item) => item.name).sort();
const uri = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:listCollectionIds?key=${apiKey}`;

try {
  const response = await fetch(uri, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ pageSize: 1000 }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HTTP ${response.status}: ${body}`);
  }

  const payload = await response.json();
  const actual = (payload.collectionIds || []).sort();
  const missing = expected.filter((item) => !actual.includes(item));
  const extra = actual.filter((item) => !expected.includes(item));

  console.log(`Firestore project: ${projectId}`);
  console.log(`Expected collections: ${expected.join(', ')}`);
  console.log(`Actual collections: ${actual.length ? actual.join(', ') : '(none found)'}`);
  console.log(`Missing: ${missing.length ? missing.join(', ') : 'none'}`);
  console.log(`Extra: ${extra.length ? extra.join(', ') : 'none'}`);

  if (missing.length || extra.length) process.exitCode = 2;
} catch (error) {
  console.error('Could not inspect Firestore collections.');
  console.error(error?.message || error);
  process.exit(1);
}
