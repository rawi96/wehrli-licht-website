import {
  FABRIC_COLORS,
  FINISHES,
  FinishId,
  findMaterial,
  findShape,
  LAMPS,
  LampId,
  LININGS,
  LiningId,
  MATERIALS,
  MaterialId,
  PATTERNS,
  PatternId,
  ROOMS,
  RoomId,
  SHAPES,
  ShapeId,
  SIZE_LIMITS,
  TRIMS,
  TrimId,
} from './catalog';

/** A lampshade as designed in the configurator. Sizes in cm, depth in % of the width. */
export type LampshadeDesign = {
  shape: ShapeId;
  height: number;
  bottom: number;
  top: number;
  depth: number;
  material: MaterialId;
  color: string;
  pattern: PatternId;
  patternColor: string;
  lining: LiningId;
  trim: TrimId;
  trimColor: string;
  lamp: LampId;
  finish: FinishId;
  room: RoomId;
};

export const DEFAULT_DESIGN: LampshadeDesign = {
  shape: 'konisch',
  ...sizeOf('konisch'),
  material: 'leinen',
  color: '#d8cbb3',
  pattern: 'uni',
  patternColor: '#214073',
  lining: 'weiss',
  trim: 'paspel',
  trimColor: '#34373c',
  lamp: 'tisch',
  finish: 'messing',
  room: 'wohnen',
};

function sizeOf(shape: ShapeId) {
  const { size } = findShape(shape);

  return { height: size.height, bottom: size.bottom, top: size.top, depth: size.depth };
}

/** Choosing a form resets its proportions; a half shade belongs on the wall. */
export const withShape = (design: LampshadeDesign, shape: ShapeId): LampshadeDesign => ({
  ...design,
  shape,
  ...sizeOf(shape),
  lamp: findShape(shape).half ? 'wand' : design.lamp === 'wand' ? 'tisch' : design.lamp,
});

/** Materials with their own colours (e.g. leaf metal) switch to one of them. */
export const withMaterial = (design: LampshadeDesign, material: MaterialId): LampshadeDesign => {
  const { colors, patterns } = findMaterial(material);
  const keepsColor = !colors || colors.some(({ hex }) => hex === design.color);

  return {
    ...design,
    material,
    color: keepsColor ? design.color : colors[0].hex,
    pattern: patterns ? design.pattern : 'uni',
  };
};

export const colorsOf = (material: MaterialId) => findMaterial(material).colors ?? FABRIC_COLORS;

export const PRESETS: { label: string; design: LampshadeDesign }[] = [
  { label: 'Klassisch', design: DEFAULT_DESIGN },
  {
    label: 'Goldene Pagode',
    design: {
      ...DEFAULT_DESIGN,
      ...sizeOf('pagode'),
      shape: 'pagode',
      material: 'seide',
      color: '#1b2438',
      lining: 'gold',
      trim: 'borte',
      trimColor: '#c8982c',
      lamp: 'steh',
      finish: 'messing',
      room: 'wohnen',
    },
  },
  {
    label: 'Über dem Esstisch',
    design: {
      ...DEFAULT_DESIGN,
      ...sizeOf('trommel'),
      shape: 'trommel',
      bottom: 60,
      top: 60,
      material: 'leinen',
      color: '#98a98c',
      lining: 'weiss',
      trim: 'keine',
      lamp: 'pendel',
      finish: 'schwarz',
      room: 'essen',
    },
  },
  {
    label: 'Blattgold',
    design: {
      ...DEFAULT_DESIGN,
      ...sizeOf('konisch-flach'),
      shape: 'konisch-flach',
      material: 'blattmetall',
      color: '#c9a14a',
      lining: 'gold',
      trim: 'keine',
      lamp: 'pendel',
      finish: 'messing',
      room: 'atelier',
    },
  },
  {
    label: 'Gestreift',
    design: {
      ...DEFAULT_DESIGN,
      ...sizeOf('zylinder'),
      shape: 'zylinder',
      material: 'polyester',
      color: '#f2eee6',
      pattern: 'blockstreifen',
      patternColor: '#1f5b62',
      trim: 'paspel',
      trimColor: '#1f5b62',
      lamp: 'tisch',
      finish: 'weiss',
      room: 'schlafen',
    },
  },
  {
    label: 'Wandschild',
    design: {
      ...DEFAULT_DESIGN,
      ...sizeOf('halbschild'),
      shape: 'halbschild',
      material: 'pergament',
      color: '#ead9b5',
      lining: 'weiss',
      trim: 'paspel',
      trimColor: '#877a6e',
      lamp: 'wand',
      finish: 'messing',
      room: 'schlafen',
    },
  },
];

const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];
const between = (min: number, max: number) => Math.round(min + Math.random() * (max - min));

/** A random but sensible design: «Überraschen Sie mich». */
export const randomDesign = (current: LampshadeDesign): LampshadeDesign => {
  const shape = pick(SHAPES.filter(({ id }) => id !== current.shape));
  const material = pick(MATERIALS);
  const colors = colorsOf(material.id);
  const scale = between(85, 120) / 100;
  const design = withMaterial(withShape({ ...current, room: current.room }, shape.id), material.id);

  return {
    ...design,
    height: clampSize('height', design.height * scale),
    bottom: clampSize('bottom', design.bottom * scale),
    top: clampSize('top', design.top * scale),
    color: pick(colors).hex,
    pattern: material.patterns && Math.random() < 0.35 ? pick(PATTERNS.filter(({ id }) => id !== 'motiv')).id : 'uni',
    patternColor: pick(FABRIC_COLORS).hex,
    lining: pick(LININGS).id,
    trim: pick(TRIMS).id,
    trimColor: pick(FABRIC_COLORS).hex,
    finish: pick(FINISHES).id,
  };
};

export const clampSize = (key: keyof typeof SIZE_LIMITS, value: number): number =>
  Math.round(Math.min(SIZE_LIMITS[key].max, Math.max(SIZE_LIMITS[key].min, value)));

// Sharing: the design as readable URL parameters (in the hash, so the page itself stays cacheable).

const PARAMS: Record<keyof LampshadeDesign, string> = {
  shape: 'form',
  height: 'h',
  bottom: 'unten',
  top: 'oben',
  depth: 'tiefe',
  material: 'material',
  color: 'farbe',
  pattern: 'muster',
  patternColor: 'musterfarbe',
  lining: 'futter',
  trim: 'kante',
  trimColor: 'kantenfarbe',
  lamp: 'leuchte',
  finish: 'gestell',
  room: 'raum',
};

const HEX = /^[\da-f]{6}$/i;

export const encodeDesign = (design: LampshadeDesign): string =>
  new URLSearchParams(
    Object.entries(PARAMS).map(([key, param]) => {
      const value = design[key as keyof LampshadeDesign];

      return [param, typeof value === 'string' ? value.replace(/^#/, '') : String(value)];
    }),
  ).toString();

const oneOf = <T extends string>(value: string | null, items: readonly { id: T }[]): T | undefined =>
  items.find(({ id }) => id === value)?.id;

/** Reads a shared design; unknown or broken values fall back to the defaults. */
export const decodeDesign = (query: string): LampshadeDesign | null => {
  const params = new URLSearchParams(query.replace(/^#/, ''));
  const shape = oneOf(params.get(PARAMS.shape), SHAPES);

  if (!shape) {
    return null;
  }

  const base = withShape(DEFAULT_DESIGN, shape);
  const size = (key: keyof typeof SIZE_LIMITS) => {
    const value = Number(params.get(PARAMS[key]));

    return Number.isFinite(value) && value > 0 ? clampSize(key, value) : base[key];
  };
  const hex = (key: keyof LampshadeDesign, fallback: string) => {
    const value = params.get(PARAMS[key]) ?? '';

    return HEX.test(value) ? `#${value.toLowerCase()}` : fallback;
  };
  const material = oneOf(params.get(PARAMS.material), MATERIALS) ?? base.material;
  const pattern = oneOf(params.get(PARAMS.pattern), PATTERNS);

  return {
    ...base,
    height: size('height'),
    bottom: size('bottom'),
    top: size('top'),
    depth: size('depth'),
    material,
    color: hex('color', base.color),
    // An own motif is a local image and cannot be shared.
    pattern: pattern && pattern !== 'motiv' && findMaterial(material).patterns ? pattern : 'uni',
    patternColor: hex('patternColor', base.patternColor),
    lining: oneOf(params.get(PARAMS.lining), LININGS) ?? base.lining,
    trim: oneOf(params.get(PARAMS.trim), TRIMS) ?? base.trim,
    trimColor: hex('trimColor', base.trimColor),
    lamp: oneOf(params.get(PARAMS.lamp), LAMPS) ?? base.lamp,
    finish: oneOf(params.get(PARAMS.finish), FINISHES) ?? base.finish,
    room: oneOf(params.get(PARAMS.room), ROOMS) ?? base.room,
  };
};

const labelOf = <T extends string>(id: T, items: readonly { id: T; label: string }[]) =>
  items.find((item) => item.id === id)?.label ?? id;

const colorName = (hex: string, material: MaterialId) =>
  [...colorsOf(material), ...FABRIC_COLORS].find((color) => color.hex === hex)?.label ?? hex.toUpperCase();

/** Label without soft hyphens (they only help breaking in narrow buttons). */
export const plainLabel = (label: string) => label.replaceAll('\u00ad', '');

/** Readable summary for the inquiry, e.g. «Form 03 · Konisch». */
export const describeDesign = (design: LampshadeDesign): string[] => {
  const shape = findShape(design.shape);
  const round = design.depth === 100 && shape.corners === 2;
  const width = round ? 'Ø' : 'Breite';
  const pattern =
    design.pattern === 'uni'
      ? ''
      : `, Muster ${labelOf(design.pattern, PATTERNS)}${design.pattern === 'motiv' ? '' : ` in ${colorName(design.patternColor, design.material)}`}`;

  return [
    `Form ${shape.form} · ${plainLabel(shape.label)}`,
    `Masse: Höhe ${design.height} cm, ${width} unten ${design.bottom} cm, ${width} oben ${design.top} cm${round ? '' : `, Tiefe ${design.depth} %`}`,
    `Material: ${labelOf(design.material, MATERIALS)}, ${colorName(design.color, design.material)}${pattern}`,
    `Futter: ${labelOf(design.lining, LININGS)}`,
    `Kante: ${labelOf(design.trim, TRIMS)}${design.trim === 'keine' ? '' : ` in ${colorName(design.trimColor, design.material)}`}`,
    `Für: ${labelOf(design.lamp, LAMPS)}, Gestell ${labelOf(design.finish, FINISHES)}`,
  ];
};

export type SizeAdvice = { fits: boolean; text: string };

/** Rules of thumb of the atelier: does the size suit the lamp? */
export const sizeAdvice = (design: LampshadeDesign): SizeAdvice => {
  const width = Math.max(design.bottom, design.top);
  const ranges: Record<LampId, { min: number; max: number; text: string }> = {
    tisch: { min: 30, max: 48, text: 'Auf einem Fuss von rund 40 cm wirkt ein Schirm mit 30 bis 48 cm Breite ruhig.' },
    steh: { min: 38, max: 60, text: 'Stehleuchten tragen gut einen Schirm von 38 bis 60 cm Breite.' },
    pendel: {
      min: 35,
      max: 75,
      text: 'Über einem Esstisch passt ein Schirm von etwa einem Drittel der Tischlänge, 35 bis 75 cm.',
    },
    wand: { min: 18, max: 38, text: 'Wandleuchten wirken mit 18 bis 38 cm Breite leicht und tragen nicht auf.' },
  };
  const range = ranges[design.lamp];
  const fits = width >= range.min && width <= range.max && design.height <= width * 1.2;

  return {
    fits,
    text: fits
      ? 'Die Proportionen passen gut zu dieser Leuchte.'
      : design.height > width * 1.2
        ? 'Tipp: Ein Schirm, der deutlich höher als breit ist, wirkt schnell schmal. Etwas breiter wirkt ruhiger.'
        : `Tipp: ${range.text}`,
  };
};
