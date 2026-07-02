export type BbbRole = 'attendee' | 'moderator';

export type BbbCreateMeetingInput = {
  meetingId: string;
  title: string;
  description?: string;
  attendeePassword?: string;
  moderatorPassword?: string;
  duration?: number;
  record?: boolean;
  welcomeMessage?: string;
};

export type BbbJoinInput = {
  meetingId: string;
  fullName: string;
  role: BbbRole;
  userId?: string;
  attendeePassword?: string;
  moderatorPassword?: string;
};

export type BbbEndMeetingInput = {
  meetingId: string;
  moderatorPassword?: string;
};

export type BbbRecording = {
  recordId: string;
  meetingId: string;
  name: string;
  playbackUrl?: string;
  published?: boolean;
};

export type BbbApiResult = {
  ok: boolean;
  returnCode?: string;
  messageKey?: string;
  message?: string;
  meetingId?: string;
  raw?: string;
};
