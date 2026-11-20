export const runtime = 'nodejs';

export const GET = () => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" role="img" aria-label="Wehrli Licht">
  <rect width="64" height="64" rx="14" fill="#214073"/>
  <path d="M18 18h6l8 20 8-20h6L36 46h-8L18 18z" fill="#ffffff"/>
</svg>`;

  return new Response(svg, {
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};
