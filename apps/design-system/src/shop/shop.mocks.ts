import type { ImageData } from '../content/image/image';
import { PLACEHOLDER_LANDSCAPE, PLACEHOLDER_PORTRAIT } from '../docs/placeholders';

// Story-only mock content of the shop group: generic products and categories, no real products.

const productImage = (from: string, to: string, alt: string): ImageData => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><rect width="800" height="800" fill="#ffffff"/><circle cx="400" cy="420" r="220" fill="${from}"/><rect x="390" y="0" width="20" height="200" fill="${to}"/></svg>`;

  return { src: `data:image/svg+xml,${encodeURIComponent(svg)}`, width: 800, height: 800, aspectRatio: 1, alt };
};

export const MOCK_PRODUCT_IMAGES: ImageData[] = [
  productImage('#749ad7', '#142847', 'Pendelleuchte von vorne'),
  productImage('#9ca3af', '#142847', 'Pendelleuchte von der Seite'),
  productImage('#f1f0ec', '#142847', 'Pendelleuchte im Detail'),
];

/** A plain URL, as the cart stores it (no srcset). */
const MOCK_CART_IMAGE_URL = MOCK_PRODUCT_IMAGES[0].src;

export const MOCK_PRODUCTS = [
  { id: '1', name: 'Pendelleuchte', href: '#', price: 'Ab CHF 290.00', image: MOCK_PRODUCT_IMAGES[0] },
  { id: '2', name: 'Stehleuchte', href: '#', price: 'CHF 540.00', image: MOCK_PRODUCT_IMAGES[1] },
  {
    id: '3',
    name: 'Wandleuchte mit einem sehr langen Namen, der über mehrere Zeilen umbricht',
    href: '#',
    price: 'CHF 1’180.00',
    image: MOCK_PRODUCT_IMAGES[2],
  },
  { id: '4', name: 'Tischleuchte ohne Bild', href: '#', price: 'CHF 120.00' },
];

export const MOCK_CATEGORIES = [
  {
    id: 'c1',
    name: 'Pendelleuchten',
    href: '#',
    description: 'Leuchten über dem Esstisch und in der Küche.',
    image: PLACEHOLDER_LANDSCAPE,
  },
  {
    id: 'c2',
    name: 'Stehleuchten',
    href: '#',
    description: 'Licht zum Lesen und für gemütliche Ecken. Auch dimmbar.',
    image: PLACEHOLDER_PORTRAIT,
  },
  { id: 'c3', name: 'Wandleuchten', href: '#', image: PLACEHOLDER_LANDSCAPE },
  {
    id: 'c4',
    name: 'Tischleuchten mit einem langen Kategorienamen',
    href: '#',
    description:
      'Eine längere Beschreibung, die zeigt, wie der Text nach einigen Zeilen abgeschnitten wird, wenn er nicht mehr in die Karte passt.',
  },
];

export const MOCK_CART_LINES = [
  {
    id: 'l1',
    name: 'Pendelleuchte',
    href: '#',
    imageUrl: MOCK_CART_IMAGE_URL,
    selectionsLabel: 'Farbe: Weiss, Grösse: M',
    price: 'CHF 290.00',
    quantity: 1,
  },
  {
    id: 'l2',
    name: 'Stehleuchte mit einem sehr langen Namen, der umbricht',
    href: '#',
    imageUrl: MOCK_PRODUCT_IMAGES[1].src,
    price: 'CHF 540.00',
    quantity: 2,
  },
];

export const MOCK_SHIPPING_OPTIONS = [
  { value: 'pickup', title: 'Abholung im Geschäft', description: 'Gratis während den Öffnungszeiten' },
  { value: 'post', title: 'Versand per Post', description: 'In die Schweiz · CHF 15.00' },
];

export const MOCK_PAYMENT_OPTIONS = [
  { value: 'prepayment', title: 'Vorauskasse', description: 'Überweisung vor Lieferung oder Abholung' },
  { value: 'online', title: 'Online bezahlen', description: 'Karte, TWINT und weitere Methoden' },
];

export const MOCK_CHECKOUT_STEPS = [
  { id: 'shipping', title: 'Versand' },
  { id: 'details', title: 'Angaben' },
  { id: 'payment', title: 'Zahlung' },
  { id: 'review', title: 'Übersicht' },
];
