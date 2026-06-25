export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const version = url.searchParams.get('version');
  const file = url.searchParams.get('file');

  if (!version || !file || !/^v[\d.]+$/.test(version) || !/\.mp3$/i.test(file)) {
    return new Response('Not found', { status: 404 });
  }

  const githubUrl = `https://github.com/cjpalex/VoiceOfChaos/releases/download/${version}/${file}`;

  // Cap each response to 2 MB so the Edge Function finishes within its 30 s
  // execution limit. The audio element follows up with Range requests as it
  // plays, so this is transparent to the user.
  const incomingRange = req.headers.get('range');
  const range = incomingRange || 'bytes=0-2097151';
  const upstream = await fetch(githubUrl, {
    headers: { range },
  });

  const headers = new Headers();
  for (const key of ['content-length', 'content-range', 'accept-ranges', 'last-modified', 'etag']) {
    const val = upstream.headers.get(key);
    if (val) headers.set(key, val);
  }
  // GitHub CDN returns application/octet-stream for release assets — iOS audio
  // elements reject that content-type and report MEDIA_ERR_SRC_NOT_SUPPORTED (4).
  headers.set('content-type', 'audio/mpeg');
  headers.set('access-control-allow-origin', '*');
  headers.set('cache-control', 'public, max-age=86400');

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
