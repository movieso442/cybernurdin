import { NextRequest, NextResponse } from 'next/server';
import { buildBbbJoinUrl } from '@/lib/integrations/bigbluebutton/bbbService';
import { BbbRole } from '@/lib/integrations/bigbluebutton/bbbTypes';

export const runtime = 'nodejs';

function roleFrom(value: string | null): BbbRole {
  return value === 'moderator' ? 'moderator' : 'attendee';
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const meetingId = searchParams.get('meetingId');
    const fullName = searchParams.get('fullName') || 'CyberNurdin Mentee';

    if (!meetingId) {
      return NextResponse.json({ ok: false, error: 'meetingId is required.' }, { status: 400 });
    }

    const joinUrl = buildBbbJoinUrl({
      meetingId,
      fullName,
      role: roleFrom(searchParams.get('role')),
      userId: searchParams.get('userId') || undefined,
    });

    return NextResponse.redirect(joinUrl);
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Could not join BigBlueButton meeting.',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.meetingId) {
      return NextResponse.json({ ok: false, error: 'meetingId is required.' }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      joinUrl: buildBbbJoinUrl({
        meetingId: body.meetingId,
        fullName: body.fullName || 'CyberNurdin Mentee',
        role: body.role === 'moderator' ? 'moderator' : 'attendee',
        userId: body.userId,
      }),
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Could not create join URL.',
    }, { status: 500 });
  }
}
