import type { ImageData } from '../content/image/image';
import { placeholderImage } from '../docs/placeholders';

// Story-only mock images (inline SVG) for the blocks and their content parts: no external images, no CMS content.

const mockImage = (alt: string, width = 1200, height = 800, from = '#749ad7', to = '#142847'): ImageData =>
  placeholderImage(alt, { width, height, from, to });

export const MOCK_AVATAR = mockImage('Porträt', 400, 400, '#f1f0ec', '#9ca3af');

/** Images in different formats, e.g. for a gallery. */
export const MOCK_IMAGES = [
  mockImage('Pendelleuchte über einem Esstisch', 1200, 800),
  mockImage('Stehleuchte im Wohnzimmer', 600, 900, '#f1f0ec', '#9ca3af'),
  mockImage('Lichtband im Flur', 1600, 700, '#4577ca', '#080f1c'),
  mockImage('Wandleuchte im Treppenhaus', 900, 900, '#658ed3', '#214073'),
  mockImage('Deckenleuchte in der Küche', 1200, 800, '#d1d5db', '#374151'),
  mockImage('Tischleuchte im Büro', 800, 1000, '#749ad7', '#2a5293'),
];

/** A logo as an SVG data URL (logos are SVG files in the CMS). */
export const mockLogo = (label: string): ImageData => ({
  src: `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80"><rect width="200" height="80" rx="8" fill="#f1f0ec"/><text x="100" y="48" font-family="sans-serif" font-size="22" text-anchor="middle" fill="#214073">${label}</text></svg>`,
  )}`,
  width: 200,
  height: 80,
  alt: label,
});

/** Running text for rich text in block stories. */
export const MOCK_TEXT =
  'Gutes Licht macht Räume wohnlich und Arbeitsplätze angenehm. Wir planen Licht für Wohnungen, Büros und Läden, liefern die passenden Leuchten und montieren sie.';
