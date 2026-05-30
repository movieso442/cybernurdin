import fs from 'node:fs';
import path from 'node:path';
import admin from 'firebase-admin';
import { buildSeedDocuments, firebaseConfig } from './seed-firestore.mjs';

const defaultServiceAccountPath = path.resolve(process.cwd(), '.secrets/firebase-service-account.json');
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  defaultServiceAccountPath;

function printSetupHelp() {
  console.error('Missing Firebase service account JSON.');
  console.error('');
  console.error('Create/download it from:');
  console.error('Firebase Console > Project settings > Service accounts > Generate new private key');
  console.error('');
  console.error(`Save it here: ${defaultServiceAccountPath}`);
  console.error('');
  console.error('Or set one of these environment variables:');
  console.error('FIREBASE_SERVICE_ACCOUNT_PATH=C:\\path\\to\\service-account.json');
  console.error('GOOGLE_APPLICATION_CREDENTIALS=C:\\path\\to\\service-account.json');
}

function loadServiceAccount() {
  if (!fs.existsSync(serviceAccountPath)) {
    printSetupHelp();
    process.exit(1);
  }

  try {
    return JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  } catch (error) {
    throw new Error(`Could not read service account JSON at ${serviceAccountPath}: ${error.message}`);
  }
}

function summarize(seedDocuments) {
  return seedDocuments.reduce((acc, item) => {
    acc[item.collectionName] = (acc[item.collectionName] || 0) + 1;
    return acc;
  }, {});
}

async function main() {
  const serviceAccount = loadServiceAccount();
  const projectId = serviceAccount.project_id || firebaseConfig.projectId;

  if (!projectId) {
    throw new Error('Could not determine Firebase project ID from service account or .env.local.');
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });
  }

  const db = admin.firestore();
  const seedDocuments = buildSeedDocuments({
    timestampFactory: () => admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`Prepared ${seedDocuments.length} admin Firestore documents for ${projectId}.`);
  console.table(summarize(seedDocuments));

  let batch = db.batch();
  let batchCount = 0;
  let written = 0;

  async function commitBatchIfNeeded(force = false) {
    if (!batchCount) return;
    if (!force && batchCount < 450) return;
    await batch.commit();
    written += batchCount;
    batch = db.batch();
    batchCount = 0;
  }

  for (const seedDoc of seedDocuments) {
    batch.set(db.collection(seedDoc.collectionName).doc(seedDoc.id), seedDoc.data, { merge: true });
    batchCount += 1;
    await commitBatchIfNeeded();
  }

  await commitBatchIfNeeded(true);
  console.log(`Seeded ${written} documents into Firestore project ${projectId}.`);
}

main().catch((error) => {
  console.error('Admin Firestore seed failed.');
  console.error(error?.message || error);
  process.exit(1);
});
