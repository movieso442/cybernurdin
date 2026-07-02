import { NextRequest, NextResponse } from 'next/server';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { buildBbbJoinUrl, createBbbMeeting } from '@/lib/integrations/bigbluebutton/bbbService';

export const runtime = 'nodejs';

function cleanRecord<T extends Record<string, unknown>>(record: T) {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const meetingId = body.bbbMeetingId || body.meetingId || `cybernurdin-${Date.now()}`;
    const title = body.title || 'CyberNurdin mentorship session';
    const attendeePassword = body.attendeePassword;
    const moderatorPassword = body.moderatorPassword;

    const result = await createBbbMeeting({
      meetingId,
      title,
      description: body.description,
      attendeePassword,
      moderatorPassword,
      duration: Number(body.duration || 60),
      record: body.record ?? true,
      welcomeMessage: body.welcomeMessage,
    });

    const attendeeJoinUrl = buildBbbJoinUrl({
      meetingId,
      fullName: 'CyberNurdin Mentee',
      role: 'attendee',
      attendeePassword,
    });
    const moderatorJoinUrl = buildBbbJoinUrl({
      meetingId,
      fullName: 'CyberNurdin Mentor',
      role: 'moderator',
      moderatorPassword,
    });

    const sessionId = body.id || `session-${Date.now()}`;
    const session = cleanRecord({
      id: sessionId,
      title,
      description: body.description || '',
      menteeId: body.menteeId || '',
      mentorId: body.mentorId || '',
      pathId: body.pathId || '',
      scheduledAt: body.scheduledAt || '',
      duration: Number(body.duration || 60),
      status: body.status || 'scheduled',
      bbbMeetingId: meetingId,
      attendeeJoinUrl,
      moderatorJoinUrl,
      recordingUrl: body.recordingUrl || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    if (db) {
      await setDoc(doc(db, 'sessions', sessionId), session, { merge: true });
    }

    return NextResponse.json({
      ok: true,
      meeting: result,
      sessionId,
      bbbMeetingId: meetingId,
      attendeeJoinUrl,
      moderatorJoinUrl,
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Could not create BigBlueButton meeting.',
    }, { status: 500 });
  }
}
