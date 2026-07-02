import { NextRequest, NextResponse } from 'next/server';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { endBbbMeeting } from '@/lib/integrations/bigbluebutton/bbbService';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.meetingId) {
      return NextResponse.json({ ok: false, error: 'meetingId is required.' }, { status: 400 });
    }

    const result = await endBbbMeeting({
      meetingId: body.meetingId,
      moderatorPassword: body.moderatorPassword,
    });

    if (db && body.sessionId) {
      await updateDoc(doc(db, 'sessions', body.sessionId), {
        status: 'completed',
        updatedAt: serverTimestamp(),
      });
    }

    return NextResponse.json({ ok: result.ok, result });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Could not end BigBlueButton meeting.',
    }, { status: 500 });
  }
}
