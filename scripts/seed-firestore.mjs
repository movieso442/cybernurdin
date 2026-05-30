import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp } from 'firebase/app';
import {
  doc,
  getFirestore,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import {
  YOUTUBE_CHANNEL_ID,
  YOUTUBE_CHANNEL_URL,
  defaultCoupons,
  mentorshipPaths,
} from '../src/lib/cybernurdin-data.ts';
import {
  expectedFirestoreCollections,
  firestoreSchemaVersion,
} from '../src/lib/firestore-schema.ts';

const envPath = path.resolve(process.cwd(), '.env.local');
const dryRun = process.argv.includes('--dry-run');

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

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function requireConfig() {
  const missing = Object.entries(firebaseConfig)
    .filter(([key, value]) => key !== 'measurementId' && !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`Missing Firebase config values: ${missing.join(', ')}`);
  }
}

function compact(value) {
  return JSON.parse(JSON.stringify(value));
}

function allLessons(pathRecord) {
  return pathRecord.modules.flatMap((moduleRecord) => moduleRecord.lessons);
}

export function buildSeedDocuments({ timestampFactory = serverTimestamp } = {}) {
  const documents = [];
  const now = timestampFactory();

  documents.push({
    collectionName: 'systemConfig',
    id: 'cybernurdin',
    data: {
      appName: 'CyberNurdin',
      productType: 'cybersecurity-mentorship-platform',
      schemaVersion: firestoreSchemaVersion,
      youtube: {
        provider: 'youtube',
        channelId: YOUTUBE_CHANNEL_ID,
        channelUrl: YOUTUBE_CHANNEL_URL,
        pathPlaylistStrategy: 'one-youtube-playlist-per-mentorship-path',
        lessonVideoStrategy: 'store-youtube-video-id-and-manual-episode-index',
        playbackRule: 'embed-youtube-video-only',
      },
      learningRules: {
        oneActivePathPerMentee: true,
        couponRequiredForLogin: true,
        adminApprovesApplications: true,
        studentsCannotSelfUnlockPaths: true,
      },
      updatedAt: now,
    },
  });

  documents.push({
    collectionName: 'systemConfig',
    id: 'firestoreSchema',
    data: {
      schemaVersion: firestoreSchemaVersion,
      collections: expectedFirestoreCollections,
      updatedAt: now,
    },
  });

  for (const collectionInfo of expectedFirestoreCollections) {
    documents.push({
      collectionName: collectionInfo.name,
      id: '_schema',
      data: {
        documentKind: 'schema-marker',
        schemaVersion: firestoreSchemaVersion,
        collection: collectionInfo.name,
        purpose: collectionInfo.purpose,
        ownerFlow: collectionInfo.ownerFlow,
        updatedAt: now,
      },
    });
  }

  for (const pathRecord of mentorshipPaths) {
    const { modules, ...pathBase } = pathRecord;
    const pathLessons = allLessons(pathRecord);
    const pathYoutubePlaylistUrl = pathBase.youtubePlaylistId
      ? `https://www.youtube.com/playlist?list=${pathBase.youtubePlaylistId}`
      : null;

    documents.push({
      collectionName: 'mentorshipPaths',
      id: pathRecord.id,
      data: compact({
        ...pathBase,
        youtubePlaylistUrl: pathBase.youtubePlaylistUrl || pathYoutubePlaylistUrl,
        moduleIds: modules.map((moduleRecord) => moduleRecord.id),
        lessonIds: pathLessons.map((lessonRecord) => lessonRecord.id),
        moduleCount: modules.length,
        lessonCount: pathLessons.length,
        accessModel: 'assigned-path-only',
        contentStatus: 'seeded',
        createdAt: now,
        updatedAt: now,
      }),
    });

    modules.forEach((moduleRecord, moduleIndex) => {
      documents.push({
        collectionName: 'modules',
        id: moduleRecord.id,
        data: compact({
          id: moduleRecord.id,
          pathId: pathRecord.id,
          pathSlug: pathRecord.slug,
          order: moduleIndex + 1,
          title: moduleRecord.title,
          summary: moduleRecord.summary,
          lessonIds: moduleRecord.lessons.map((lessonRecord) => lessonRecord.id),
          lessonCount: moduleRecord.lessons.length,
          createdAt: now,
          updatedAt: now,
        }),
      });

      moduleRecord.lessons.forEach((lessonRecord, lessonIndex) => {
        const lessonVideoDocId = `${lessonRecord.id}-video`;
        const { slides, quiz, ...lessonBase } = lessonRecord;
        const lessonYoutube = {
          ...lessonRecord.youtube,
          playlistId: pathRecord.youtubePlaylistId,
          playlistUrl: pathRecord.youtubePlaylistUrl || pathYoutubePlaylistUrl,
        };

        documents.push({
          collectionName: 'lessons',
          id: lessonRecord.id,
          data: compact({
            ...lessonBase,
            youtube: lessonYoutube,
            pathId: pathRecord.id,
            pathSlug: pathRecord.slug,
            moduleId: moduleRecord.id,
            moduleOrder: moduleIndex + 1,
            lessonOrder: lessonIndex + 1,
            episodeIndex: lessonRecord.youtube.episodeIndex,
            videoId: lessonVideoDocId,
            slideIds: slides.map((slideRecord) => slideRecord.id),
            quizId: quiz.id,
            releaseStatus: 'indexed',
            accessModel: 'assigned-path-only',
            createdAt: now,
            updatedAt: now,
          }),
        });

        documents.push({
          collectionName: 'videos',
          id: lessonVideoDocId,
          data: compact({
            id: lessonVideoDocId,
            pathId: pathRecord.id,
            pathSlug: pathRecord.slug,
            moduleId: moduleRecord.id,
            lessonId: lessonRecord.id,
            provider: 'youtube',
            channelId: YOUTUBE_CHANNEL_ID,
            channelUrl: YOUTUBE_CHANNEL_URL,
            playlistId: pathRecord.youtubePlaylistId,
            playlistUrl: pathRecord.youtubePlaylistUrl || pathYoutubePlaylistUrl,
            playlistEpisodeIndex: lessonRecord.youtube.episodeIndex,
            youtubeVideoId: lessonRecord.youtubeVideoId,
            youtubeWatchUrl: lessonRecord.videoUrl,
            youtubeEmbedUrl: lessonRecord.youtube.embedUrl,
            status: lessonRecord.youtubeVideoId ? 'indexed' : 'needs-video',
            indexingRule: 'video-is-added-to-youtube-playlist-first-then-indexed-here',
            createdAt: now,
            updatedAt: now,
          }),
        });

        slides.forEach((slideRecord, slideIndex) => {
          documents.push({
            collectionName: 'slides',
            id: slideRecord.id,
            data: compact({
              ...slideRecord,
              pathId: pathRecord.id,
              moduleId: moduleRecord.id,
              lessonId: lessonRecord.id,
              order: slideIndex + 1,
              createdAt: now,
              updatedAt: now,
            }),
          });
        });

        documents.push({
          collectionName: 'quizzes',
          id: quiz.id,
          data: compact({
            id: quiz.id,
            pathId: pathRecord.id,
            moduleId: moduleRecord.id,
            lessonId: lessonRecord.id,
            passingScore: quiz.passingScore,
            questionIds: quiz.questions.map((questionRecord) => questionRecord.id),
            attemptsCollection: 'quizAttempts',
            createdAt: now,
            updatedAt: now,
          }),
        });

        quiz.questions.forEach((questionRecord, questionIndex) => {
          documents.push({
            collectionName: 'questions',
            id: questionRecord.id,
            data: compact({
              ...questionRecord,
              pathId: pathRecord.id,
              moduleId: moduleRecord.id,
              lessonId: lessonRecord.id,
              quizId: quiz.id,
              order: questionIndex + 1,
              answerVisibility: 'client-demo-now-admin-grading-later',
              createdAt: now,
              updatedAt: now,
            }),
          });
        });
      });
    });
  }

  defaultCoupons.forEach((coupon) => {
    const pathRecord = mentorshipPaths.find((item) => item.id === coupon.pathId);
    documents.push({
      collectionName: 'coupons',
      id: coupon.code,
      data: compact({
        ...coupon,
        assignedPathId: coupon.pathId,
        assignedPathSlug: pathRecord?.slug || null,
        assignedPathTitle: pathRecord?.title || null,
        couponType: 'mentorship-access',
        redeemedBy: null,
        createdAt: now,
        updatedAt: now,
      }),
    });
  });

  documents.push({
    collectionName: 'notifications',
    id: '_welcome-template',
    data: {
      documentKind: 'template',
      type: 'welcome',
      title: 'Welcome to CyberNurdin',
      body: 'Your assigned cybersecurity mentorship path is ready.',
      createdAt: now,
      updatedAt: now,
    },
  });

  return documents;
}

export async function main() {
  requireConfig();

  const seedDocuments = buildSeedDocuments();
  console.log(`Prepared ${seedDocuments.length} Firestore documents for ${firebaseConfig.projectId}.`);

  if (dryRun) {
    const byCollection = seedDocuments.reduce((acc, item) => {
      acc[item.collectionName] = (acc[item.collectionName] || 0) + 1;
      return acc;
    }, {});
    console.table(byCollection);
    return;
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  let batch = writeBatch(db);
  let batchCount = 0;
  let written = 0;

  async function commitBatchIfNeeded(force = false) {
    if (!batchCount) return;
    if (!force && batchCount < 450) return;
    await batch.commit();
    written += batchCount;
    batch = writeBatch(db);
    batchCount = 0;
  }

  for (const seedDoc of seedDocuments) {
    batch.set(doc(db, seedDoc.collectionName, seedDoc.id), seedDoc.data, { merge: true });
    batchCount += 1;
    await commitBatchIfNeeded();
  }

  await commitBatchIfNeeded(true);
  console.log(`Seeded ${written} documents into Firestore project ${firebaseConfig.projectId}.`);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().catch((error) => {
    console.error('Firestore seed failed.');
    console.error(error?.message || error);
    process.exit(1);
  });
}
