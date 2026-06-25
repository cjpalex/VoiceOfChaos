export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const version = url.searchParams.get('version');
  const file = url.searchParams.get('file');

  if (!version || !file || !/^v[\d.]+$/.test(version) || !/\.mp3$/i.test(file)) {
    return new Response('Not found', { status: 404 });
  }

  const githubUrl = `https://github.com/cjpalex/VoiceOfChaos/releases/download/${version}/${file}`;

  const range = req.headers.get('range');
  const upstream = await fetch(githubUrl, {
    headers: range ? { range } : {},
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
