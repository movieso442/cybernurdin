import { buildBbbApiUrl, callBbbApi, xmlValue } from './bbbClient';
import {
  BbbApiResult,
  BbbCreateMeetingInput,
  BbbEndMeetingInput,
  BbbJoinInput,
  BbbRecording,
} from './bbbTypes';

const defaultAttendeePassword = 'cybernurdin-attendee';
const defaultModeratorPassword = 'cybernurdin-mentor';

function baseResult(raw: string): BbbApiResult {
  return {
    ok: xmlValue(raw, 'returncode')?.toUpperCase() === 'SUCCESS',
    returnCode: xmlValue(raw, 'returncode'),
    messageKey: xmlValue(raw, 'messageKey'),
    message: xmlValue(raw, 'message'),
    meetingId: xmlValue(raw, 'meetingID'),
    raw,
  };
}

export function attendeePassword(input?: string) {
  return input || defaultAttendeePassword;
}

export function moderatorPassword(input?: string) {
  return input || defaultModeratorPassword;
}

export async function createBbbMeeting(input: BbbCreateMeetingInput) {
  const raw = await callBbbApi('create', {
    name: input.title,
    meetingID: input.meetingId,
    attendeePW: attendeePassword(input.attendeePassword),
    moderatorPW: moderatorPassword(input.moderatorPassword),
    duration: input.duration || 60,
    record: input.record ?? true,
    autoStartRecording: false,
    allowStartStopRecording: true,
    welcome: input.welcomeMessage || `Welcome to ${input.title}. This CyberNurdin session is guided, focused, and mentorship-first.`,
    logoutURL: process.env.NEXT_PUBLIC_APP_URL,
    meta_brand: 'CyberNurdin',
    meta_description: input.description,
  });

  const result = baseResult(raw);
  if (!result.ok) {
    throw new Error(result.message || 'BigBlueButton meeting creation failed.');
  }

  return result;
}

export function buildBbbJoinUrl(input: BbbJoinInput) {
  return buildBbbApiUrl('join', {
    meetingID: input.meetingId,
    fullName: input.fullName,
    password: input.role === 'moderator'
      ? moderatorPassword(input.moderatorPassword)
      : attendeePassword(input.attendeePassword),
    userID: input.userId,
    redirect: true,
  });
}

export async function endBbbMeeting(input: BbbEndMeetingInput) {
  const raw = await callBbbApi('end', {
    meetingID: input.meetingId,
    password: moderatorPassword(input.moderatorPassword),
  });

  return baseResult(raw);
}

export async function getBbbRecordings(meetingId?: string): Promise<BbbRecording[]> {
  const raw = await callBbbApi('getRecordings', {
    meetingID: meetingId,
  });

  if (xmlValue(raw, 'returncode')?.toUpperCase() !== 'SUCCESS') {
    throw new Error(xmlValue(raw, 'message') || 'BigBlueButton recordings request failed.');
  }

  const blocks = raw.match(/<recording>[\s\S]*?<\/recording>/gi) || [];
  return blocks.map((block) => ({
    recordId: xmlValue(block, 'recordID') || '',
    meetingId: xmlValue(block, 'meetingID') || '',
    name: xmlValue(block, 'name') || 'CyberNurdin recording',
    playbackUrl: xmlValue(block, 'url'),
    published: xmlValue(block, 'published') === 'true',
  }));
}
