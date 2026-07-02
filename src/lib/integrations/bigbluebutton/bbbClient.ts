import { createHash } from 'node:crypto';

export function getBbbConfig() {
  const serverUrl = process.env.BBB_SERVER_URL;
  const secret = process.env.BBB_SECRET;

  if (!serverUrl || !secret) {
    throw new Error('BigBlueButton is not configured. Set BBB_SERVER_URL and BBB_SECRET.');
  }

  return {
    serverUrl: serverUrl.endsWith('/') ? serverUrl : `${serverUrl}/`,
    secret,
  };
}

function checksum(callName: string, queryString: string, secret: string) {
  return createHash('sha1').update(`${callName}${queryString}${secret}`).digest('hex');
}

export function buildBbbApiUrl(callName: string, params: Record<string, string | number | boolean | undefined>) {
  const { serverUrl, secret } = getBbbConfig();
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  searchParams.set('checksum', checksum(callName, queryString, secret));

  return `${new URL(`api/${callName}`, serverUrl).toString()}?${searchParams.toString()}`;
}

export async function callBbbApi(callName: string, params: Record<string, string | number | boolean | undefined>) {
  const response = await fetch(buildBbbApiUrl(callName, params), {
    method: 'GET',
    cache: 'no-store',
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`BigBlueButton ${callName} failed with HTTP ${response.status}.`);
  }

  return text;
}

export function xmlValue(xml: string, tagName: string) {
  const match = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, 'i'));
  return match?.[1]?.replace(/<!\\[CDATA\\[(.*?)\\]\\]>/s, '$1') || undefined;
}
