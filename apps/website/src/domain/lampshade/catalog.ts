// What the lampshade configurator offers: the forms and materials of the Wehrli atelier
// (pages «Formen» and «Materialien»), colours, linings, trims, lamps and rooms.

export type ProfileId = 'straight' | 'pagoda' | 'doublePagoda' | 'tiers';

export type ShapeId =
  | 'zylinder'
  | 'trommel'
  | 'konisch'
  | 'konisch-flach'
  | 'quadratisch-zylindrisch'
  | 'rechteckig-zylindrisch'
  | 'quadratisch'
  | 'rechteckig'
  | 'oval'
  | 'elliptisch'
  | 'elliptisch-flach'
  | 'spitzoval'
  | 'halbschild-zylindrisch'
  | 'halbschild'
  | 'halbschild-eckig'
  | 'halbschild-oval'
  | 'mehrfach'
  | 'pagode'
  | 'doppelpagode'
  | 'wellenpagode'
  | 'doppelwellenpagode';

export type Shape = {
  id: ShapeId;
  /** Number on the page «Lampenschirmformen». */
  form: string;
  label: string;
  profile: ProfileId;
  /** Exponent of the cross-section: 2 is round or oval, higher values get square with rounded corners. */
  corners: number;
  /** Waved bottom rim. */
  wave: boolean;
  /** Flat back for wall lamps. */
  half: boolean;
  /** Pointed ends of the cross-section (Spitzoval). */
  pointed?: boolean;
  /** A second, finer wave on the bottom rim. */
  doubleWave?: boolean;
  /** Default size in cm, depth in % of the width. */
  size: { height: number; bottom: number; top: number; depth: number };
};

export const SHAPES: Shape[] = [
  {
    id: 'zylinder',
    form: '01',
    label: 'Zylinder',
    profile: 'straight',
    corners: 2,
    wave: false,
    half: false,
    size: { height: 30, bottom: 35, top: 35, depth: 100 },
  },
  {
    id: 'trommel',
    form: '02',
    label: 'Trommel',
    profile: 'straight',
    corners: 2,
    wave: false,
    half: false,
    size: { height: 22, bottom: 50, top: 50, depth: 100 },
  },
  {
    id: 'konisch',
    form: '03',
    label: 'Konisch',
    profile: 'straight',
    corners: 2,
    wave: false,
    half: false,
    size: { height: 28, bottom: 40, top: 25, depth: 100 },
  },
  {
    id: 'konisch-flach',
    form: '04',
    label: 'Konisch flach',
    profile: 'straight',
    corners: 2,
    wave: false,
    half: false,
    size: { height: 20, bottom: 50, top: 22, depth: 100 },
  },
  {
    id: 'quadratisch-zylindrisch',
    form: '05',
    label: 'Quadratisch zylindrisch',
    profile: 'straight',
    corners: 9,
    wave: false,
    half: false,
    size: { height: 28, bottom: 30, top: 30, depth: 100 },
  },
  {
    id: 'rechteckig-zylindrisch',
    form: '06',
    label: 'Rechteckig zylindrisch',
    profile: 'straight',
    corners: 9,
    wave: false,
    half: false,
    size: { height: 24, bottom: 46, top: 46, depth: 52 },
  },
  {
    id: 'quadratisch',
    form: '07',
    label: 'Quadratisch konisch',
    profile: 'straight',
    corners: 9,
    wave: false,
    half: false,
    size: { height: 28, bottom: 36, top: 26, depth: 100 },
  },
  {
    id: 'rechteckig',
    form: '08',
    label: 'Rechteckig konisch',
    profile: 'straight',
    corners: 9,
    wave: false,
    half: false,
    size: { height: 26, bottom: 48, top: 38, depth: 55 },
  },
  {
    id: 'oval',
    form: '09',
    label: 'Oval',
    profile: 'straight',
    corners: 2,
    wave: false,
    half: false,
    size: { height: 26, bottom: 44, top: 44, depth: 64 },
  },
  {
    id: 'elliptisch',
    form: '10',
    label: 'Elliptisch',
    profile: 'straight',
    corners: 2,
    wave: false,
    half: false,
    size: { height: 24, bottom: 52, top: 52, depth: 42 },
  },
  {
    id: 'elliptisch-flach',
    form: '11',
    label: 'Elliptisch flach',
    profile: 'straight',
    corners: 3.4,
    wave: false,
    half: false,
    size: { height: 24, bottom: 50, top: 50, depth: 50 },
  },
  {
    id: 'spitzoval',
    form: '12',
    label: 'Spitzoval',
    profile: 'straight',
    corners: 2,
    wave: false,
    half: false,
    pointed: true,
    size: { height: 24, bottom: 50, top: 50, depth: 50 },
  },
  {
    id: 'halbschild-zylindrisch',
    form: '13',
    label: 'Halbschild zylindrisch',
    profile: 'straight',
    corners: 2,
    wave: false,
    half: true,
    size: { height: 20, bottom: 26, top: 26, depth: 100 },
  },
  {
    id: 'halbschild',
    form: '14',
    label: 'Halbschild konisch',
    profile: 'straight',
    corners: 2,
    wave: false,
    half: true,
    size: { height: 20, bottom: 30, top: 20, depth: 100 },
  },
  {
    id: 'halbschild-eckig',
    form: '15',
    label: 'Halbschild eckig',
    profile: 'straight',
    corners: 9,
    wave: false,
    half: true,
    size: { height: 20, bottom: 28, top: 22, depth: 100 },
  },
  {
    id: 'halbschild-oval',
    form: '16',
    label: 'Halbschild oval',
    profile: 'straight',
    corners: 2,
    wave: false,
    half: true,
    size: { height: 20, bottom: 32, top: 26, depth: 60 },
  },
  {
    id: 'mehrfach',
    form: '17',
    label: 'Mehrfach\u00adzylinder',
    profile: 'tiers',
    corners: 2,
    wave: false,
    half: false,
    size: { height: 32, bottom: 44, top: 24, depth: 100 },
  },
  {
    id: 'pagode',
    form: '18',
    label: 'Pagode',
    profile: 'pagoda',
    corners: 2,
    wave: false,
    half: false,
    size: { height: 30, bottom: 46, top: 16, depth: 100 },
  },
  {
    id: 'doppelpagode',
    form: '19',
    label: 'Doppel\u00adpagode',
    profile: 'doublePagoda',
    corners: 2,
    wave: false,
    half: false,
    size: { height: 34, bottom: 46, top: 14, depth: 100 },
  },
  {
    id: 'wellenpagode',
    form: '20',
    label: 'Wellen\u00adpagode',
    profile: 'pagoda',
    corners: 2,
    wave: true,
    half: false,
    size: { height: 30, bottom: 46, top: 16, depth: 100 },
  },
  {
    id: 'doppelwellenpagode',
    form: '21',
    label: 'Doppelwellen\u00adpagode',
    profile: 'pagoda',
    corners: 2,
    wave: true,
    half: false,
    doubleWave: true,
    size: { height: 30, bottom: 46, top: 16, depth: 100 },
  },
];

export type SurfaceKind = 'fabric' | 'stiff' | 'metal';

export type MaterialId = 'leinen' | 'seide' | 'polyester' | 'smocking' | 'pergament' | 'leder' | 'blattmetall';

/** Procedural surface of a material (see the textures of the configurator). */
export type GrainId = 'linen' | 'silk' | 'fine' | 'smock' | 'parchment' | 'leather' | 'leaf';

export type Material = {
  id: MaterialId;
  label: string;
  kind: SurfaceKind;
  grain: GrainId;
  /** Share of the light that shines through, 0 to 1. */
  translucency: number;
  roughness: number;
  /** Fabric sheen (silk). */
  sheen: number;
  bump: number;
  /** How the material shines, shown with the choice. */
  effect: string;
  /** Materials with their own colours offer only these. */
  colors?: Color[];
  patterns: boolean;
};

export type Color = { id: string; label: string; hex: string };

const LEAF_COLORS: Color[] = [
  { id: 'gold', label: 'Gold', hex: '#c9a14a' },
  { id: 'silber', label: 'Silber', hex: '#c4c7cc' },
  { id: 'kupfer', label: 'Kupfer', hex: '#b86f45' },
];

const PARCHMENT_COLORS: Color[] = [
  { id: 'natur', label: 'Natur', hex: '#ead9b5' },
  { id: 'elfenbein', label: 'Elfenbein', hex: '#f3ead6' },
  { id: 'honig', label: 'Honig', hex: '#d9a960' },
];

export const MATERIALS: Material[] = [
  {
    id: 'leinen',
    label: 'Leinen',
    kind: 'fabric',
    grain: 'linen',
    translucency: 0.62,
    roughness: 0.92,
    sheen: 0.2,
    bump: 1,
    effect: 'Natürlich und leicht strukturiert. Der Schirm leuchtet warm, die Struktur zeichnet sich im Licht ab.',
    patterns: true,
  },
  {
    id: 'seide',
    label: 'Seide',
    kind: 'fabric',
    grain: 'silk',
    translucency: 0.82,
    roughness: 0.5,
    sheen: 1,
    bump: 0.5,
    effect: 'Edel, mit feinem Glanz. Lässt das Licht weich durchscheinen, der ganze Schirm wird zur Lichtquelle.',
    patterns: true,
  },
  {
    id: 'polyester',
    label: 'Polyester',
    kind: 'fabric',
    grain: 'fine',
    translucency: 0.6,
    roughness: 0.75,
    sheen: 0.3,
    bump: 0.3,
    effect: 'Pflegeleicht und in vielen Farben erhältlich. Gleichmässiges, ruhiges Licht.',
    patterns: true,
  },
  {
    id: 'smocking',
    label: 'Smocking',
    kind: 'fabric',
    grain: 'smock',
    translucency: 0.55,
    roughness: 0.88,
    sheen: 0.4,
    bump: 2.4,
    effect: 'In Falten gezogener Stoff. Das Wabenmuster wirkt bei Licht besonders plastisch.',
    patterns: false,
  },
  {
    id: 'pergament',
    label: 'Pergament',
    kind: 'stiff',
    grain: 'parchment',
    translucency: 0.78,
    roughness: 0.6,
    sheen: 0,
    bump: 0.6,
    effect: 'Gibt ein warmes, gleichmässiges Licht und eine klare Form.',
    colors: PARCHMENT_COLORS,
    patterns: false,
  },
  {
    id: 'leder',
    label: 'Leder',
    kind: 'stiff',
    grain: 'leather',
    translucency: 0.04,
    roughness: 0.55,
    sheen: 0,
    bump: 1.2,
    effect: 'Kräftig und wohnlich. Das Licht fällt vor allem oben und unten aus dem Schirm.',
    patterns: false,
  },
  {
    id: 'blattmetall',
    label: 'Blattmetall',
    kind: 'metal',
    grain: 'leaf',
    translucency: 0,
    roughness: 0.32,
    sheen: 0,
    bump: 0.6,
    effect: 'Der Schirm schimmert, das Licht tritt nur oben und unten aus und bekommt einen warmen Ton.',
    colors: LEAF_COLORS,
    patterns: false,
  },
];

export const FABRIC_COLORS: Color[] = [
  { id: 'kreide', label: 'Kreideweiss', hex: '#f2eee6' },
  { id: 'leinen', label: 'Naturleinen', hex: '#d8cbb3' },
  { id: 'sand', label: 'Sand', hex: '#c4ad88' },
  { id: 'altrosa', label: 'Altrosa', hex: '#d3a29c' },
  { id: 'terracotta', label: 'Terracotta', hex: '#b5603d' },
  { id: 'senf', label: 'Senf', hex: '#c8982c' },
  { id: 'salbei', label: 'Salbei', hex: '#98a98c' },
  { id: 'olive', label: 'Olive', hex: '#6a6d3b' },
  { id: 'petrol', label: 'Petrol', hex: '#1f5b62' },
  { id: 'wehrli', label: 'Wehrli-Blau', hex: '#214073' },
  { id: 'nachtblau', label: 'Nachtblau', hex: '#1b2438' },
  { id: 'bordeaux', label: 'Bordeaux', hex: '#6c1e2a' },
  { id: 'taupe', label: 'Taupe', hex: '#877a6e' },
  { id: 'anthrazit', label: 'Anthrazit', hex: '#34373c' },
];

export type PatternId = 'uni' | 'nadelstreifen' | 'blockstreifen' | 'ringel' | 'karo' | 'punkte' | 'motiv';

export const PATTERNS: { id: PatternId; label: string }[] = [
  { id: 'uni', label: 'Uni' },
  { id: 'nadelstreifen', label: 'Nadelstreifen' },
  { id: 'blockstreifen', label: 'Blockstreifen' },
  { id: 'ringel', label: 'Ringel' },
  { id: 'karo', label: 'Karo' },
  { id: 'punkte', label: 'Punkte' },
  { id: 'motiv', label: 'Eigenes Motiv' },
];

export type LiningId = 'weiss' | 'gold' | 'silber' | 'kupfer';

export const LININGS: { id: LiningId; label: string; hex: string; metal: boolean; effect: string }[] = [
  { id: 'weiss', label: 'Weiss', hex: '#f4f1ea', metal: false, effect: 'Neutrales, helles Licht.' },
  { id: 'gold', label: 'Gold', hex: '#d6ae4c', metal: true, effect: 'Wirft warmes, goldenes Licht nach unten.' },
  { id: 'silber', label: 'Silber', hex: '#d3d6db', metal: true, effect: 'Brillant und kühl, viel Licht nach unten.' },
  { id: 'kupfer', label: 'Kupfer', hex: '#c27b52', metal: true, effect: 'Rötlich warmes, gemütliches Licht.' },
];

export type TrimId = 'keine' | 'paspel' | 'borte';

export const TRIMS: { id: TrimId; label: string }[] = [
  { id: 'keine', label: 'Keine' },
  { id: 'paspel', label: 'Paspel' },
  { id: 'borte', label: 'Borte' },
];

export type LampId = 'tisch' | 'steh' | 'pendel' | 'wand';

export const LAMPS: { id: LampId; label: string }[] = [
  { id: 'tisch', label: 'Tischleuchte' },
  { id: 'steh', label: 'Stehleuchte' },
  { id: 'pendel', label: 'Pendelleuchte' },
  { id: 'wand', label: 'Wandleuchte' },
];

export type FinishId = 'messing' | 'chrom' | 'schwarz' | 'weiss' | 'eiche';

export const FINISHES: { id: FinishId; label: string; hex: string; metalness: number; roughness: number }[] = [
  { id: 'messing', label: 'Messing', hex: '#c9a45c', metalness: 1, roughness: 0.28 },
  { id: 'chrom', label: 'Chrom', hex: '#dfe2e6', metalness: 1, roughness: 0.12 },
  { id: 'schwarz', label: 'Schwarz matt', hex: '#232427', metalness: 0.2, roughness: 0.6 },
  { id: 'weiss', label: 'Keramik weiss', hex: '#efece6', metalness: 0, roughness: 0.25 },
  { id: 'eiche', label: 'Eiche', hex: '#b8895a', metalness: 0, roughness: 0.7 },
];

export type RoomId = 'atelier' | 'wohnen' | 'essen' | 'schlafen';

export const ROOMS: { id: RoomId; label: string }[] = [
  { id: 'atelier', label: 'Atelier' },
  { id: 'wohnen', label: 'Wohnzimmer' },
  { id: 'essen', label: 'Esszimmer' },
  { id: 'schlafen', label: 'Schlafzimmer' },
];

export const LIGHT_TEMPERATURES: { kelvin: number; label: string }[] = [
  { kelvin: 2200, label: 'Kerzenlicht' },
  { kelvin: 2700, label: 'Warmweiss' },
  { kelvin: 3000, label: 'Hell warm' },
  { kelvin: 4000, label: 'Neutral' },
];

/** Limits of the size sliders, in cm (depth in % of the width). */
export const SIZE_LIMITS = {
  height: { min: 12, max: 60 },
  bottom: { min: 15, max: 90 },
  top: { min: 8, max: 90 },
  depth: { min: 40, max: 100 },
} as const;

export const findShape = (id: ShapeId): Shape => SHAPES.find((shape) => shape.id === id) ?? SHAPES[0];
export const findMaterial = (id: MaterialId): Material => MATERIALS.find((material) => material.id === id) ?? MATERIALS[0];
