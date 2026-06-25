export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { pathname } = new URL(req.url);
  const filePath = pathname.replace('/api/audio/', '');

  if (!filePath || !/^v[\d.]+\/.+\.mp3$/i.test(filePath)) {
    return new Response('Not found', { status: 404 });
  }

  const githubUrl = `https://github.com/cjpalex/VoiceOfChaos/releases/download/${filePath}`;

  const range = req.headers.get('range');
  const upstream = await fetch(githubUrl, {
    headers: range ? { range } : {},
  });

  const headers = new Headers();
  for (const key of ['content-type', 'content-length', 'content-range', 'accept-ranges', 'last-modified', 'etag']) {
    const val = upstream.headers.get(key);
    if (val) headers.set(key, val);
  }
  headers.set('access-control-allow-origin', '*');
  headers.set('cache-control', 'public, max-age=86400');

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
