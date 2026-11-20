import type { ImageData } from '../content/image/image';

// Story-only placeholder images (inline SVG), so stories never depend on external images or CMS content.

const svg = (width: number, height: number, from: string, to: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient><radialGradient id="l" cx=".5" cy=".25" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="${width}" height="${height}" fill="url(#g)"/><rect width="${width}" height="${height}" fill="url(#l)"/></svg>`,
  )}`;

const placeholderImage = (
  alt = 'Placeholder',
  { width = 1200, height = 800, from = '#749ad7', to = '#142847' } = {},
): ImageData => ({ src: svg(width, height, from, to), width, height, aspectRatio: width / height, alt });

export const PLACEHOLDER_LANDSCAPE = placeholderImage('Living room with a pendant light');
export const PLACEHOLDER_PORTRAIT = placeholderImage('Floor lamp', {
  width: 800,
  height: 1000,
  from: '#f1f0ec',
  to: '#9ca3af',
});
