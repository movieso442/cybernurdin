import { NextRequest, NextResponse } from 'next/server';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getBbbRecordings } from '@/lib/integrations/bigbluebutton/bbbService';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const meetingId = request.nextUrl.searchParams.get('meetingId') || undefined;
    const recordings = await getBbbRecordings(meetingId);

    if (db) {
      await Promise.all(recordings.map((recording) =>
        setDoc(doc(db, 'recordings', recording.recordId || `${recording.meetingId}-${Date.now()}`), {
          ...recording,
          recordingUrl: recording.playbackUrl || '',
          updatedAt: serverTimestamp(),
        }, { merge: true }),
      ));
    }

    return NextResponse.json({ ok: true, recordings });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Could not load BigBlueButton recordings.',
    }, { status: 500 });
  }
}
