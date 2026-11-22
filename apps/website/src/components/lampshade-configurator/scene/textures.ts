import type { GrainId, PatternId } from '@/domain/lampshade/catalog';
import { CanvasTexture, Color, NoColorSpace, RepeatWrapping, SRGBColorSpace, Texture } from 'three';

// Procedural, seamless surfaces: no image files to load. One texture tile shows 8 × 8 cm of material.

export const TILE_SIZE_M = 0.08;
const SIZE = 512;

const hash = (x: number, y: number, seed: number) => {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1442695040)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);

  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

/** Smooth value noise that repeats every `px` × `py` cells, sampled at u, v in [0, 1). */
const noise = (u: number, v: number, px: number, py: number, seed: number) => {
  const x = u * px;
  const y = v * py;
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const sx = xf * xf * (3 - 2 * xf);
  const sy = yf * yf * (3 - 2 * yf);
  const x0 = ((xi % px) + px) % px;
  const y0 = ((yi % py) + py) % py;
  const x1 = (x0 + 1) % px;
  const y1 = (y0 + 1) % py;
  const a = hash(x0, y0, seed);
  const b = hash(x1, y0, seed);
  const c = hash(x0, y1, seed);
  const d = hash(x1, y1, seed);

  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
};

const fbm = (u: number, v: number, period: number, octaves: number, seed: number) => {
  let sum = 0;
  let amplitude = 0.5;
  let total = 0;
  for (let octave = 0; octave < octaves; octave += 1) {
    const p = period * 2 ** octave;
    sum += noise(u, v, p, p, seed + octave) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
  }

  return sum / total;
};

const ridge = (value: number) => 1 - Math.abs(2 * value - 1);
const frac = (value: number) => value - Math.floor(value);

type Grain = {
  height: (u: number, v: number) => number;
  /** How much the relief shows in the colour. */
  contrast: number;
};

const GRAINS: Record<GrainId, Grain> = {
  linen: {
    contrast: 0.32,
    height: (u, v) => {
      const weave = 0.5 + 0.25 * Math.sin(2 * Math.PI * 96 * u) * Math.sin(2 * Math.PI * 96 * v);
      const slubs = noise(u, v, 4, 160, 3);

      return 0.5 * weave + 0.32 * slubs + 0.18 * fbm(u, v, 8, 3, 9);
    },
  },
  silk: {
    contrast: 0.22,
    height: (u, v) => 0.55 * noise(u, v, 3, 180, 5) + 0.3 * noise(u, v, 6, 320, 6) + 0.15 * fbm(u, v, 8, 2, 7),
  },
  fine: {
    contrast: 0.12,
    height: (u, v) =>
      0.5 + 0.08 * Math.sin(2 * Math.PI * 128 * u) * Math.sin(2 * Math.PI * 128 * v) + 0.35 * (fbm(u, v, 16, 3, 2) - 0.5),
  },
  smock: {
    contrast: 0.55,
    height: (u, v) => {
      const a = frac(u * 5 + v * 5);
      const b = frac(u * 5 - v * 5);
      const pillow = Math.sin(Math.PI * a) * Math.sin(Math.PI * b);

      return 0.85 * Math.max(0, pillow) ** 0.55 + 0.15 * noise(u, v, 4, 160, 4);
    },
  },
  parchment: {
    contrast: 0.42,
    height: (u, v) => 0.75 * fbm(u, v, 3, 5, 11) + 0.25 * noise(u, v, 128, 12, 12),
  },
  bladder: {
    contrast: 0.8,
    height: (u, v) => {
      const veins = ridge(fbm(u, v, 3, 4, 21)) ** 7;

      return 0.55 * fbm(u, v, 2, 4, 22) + 0.45 * (1 - veins);
    },
  },
  leather: {
    contrast: 0.3,
    height: (u, v) => 0.55 * ridge(noise(u, v, 72, 72, 31)) ** 0.6 + 0.45 * fbm(u, v, 4, 4, 32),
  },
  leaf: {
    contrast: 0.35,
    height: (u, v) => {
      // Four leaves per tile, each with its own tone, overlapping seams and fine cracks.
      const leaf = hash(Math.floor(u * 2), Math.floor(v * 2), 41);
      const seam = Math.min(frac(u * 2), frac(v * 2));
      const cracks = ridge(fbm(u, v, 6, 3, 42)) ** 18;

      return 0.35 + 0.3 * leaf + (seam < 0.012 ? -0.25 : 0) - 0.3 * cracks + 0.1 * fbm(u, v, 12, 2, 43);
    },
  },
};

const heights = new Map<GrainId, Float32Array>();

const heightField = (grain: GrainId): Float32Array => {
  const cached = heights.get(grain);
  if (cached) {
    return cached;
  }
  const field = new Float32Array(SIZE * SIZE);
  const { height } = GRAINS[grain];
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      field[y * SIZE + x] = height(x / SIZE, y / SIZE);
    }
  }
  heights.set(grain, field);

  return field;
};

/** Share of the pattern colour at u, v of a tile. */
const patternMask = (pattern: PatternId, u: number, v: number): number => {
  const band = (value: number, width: number) => {
    const distance = Math.abs(frac(value) - 0.5);

    return Math.min(1, Math.max(0, (width / 2 - distance) * 60 + 0.5));
  };
  switch (pattern) {
    case 'nadelstreifen':
      return band(u * 8, 0.12);
    case 'blockstreifen':
      return band(u * 2, 0.5);
    case 'ringel':
      return band(v * 2, 0.5);
    case 'karo':
      return (band(u * 2, 0.5) + band(v * 2, 0.5)) / 2;
    case 'punkte': {
      const row = Math.floor(v * 4);
      const du = frac(u * 4 + (row % 2) * 0.5) - 0.5;
      const dv = frac(v * 4) - 0.5;

      return Math.min(1, Math.max(0, (0.2 - Math.hypot(du, dv)) * 60 + 0.5));
    }
    default:
      return 0;
  }
};

const canvasTexture = (draw: (data: Uint8ClampedArray) => void, color: boolean): CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D is not available');
  }
  const image = context.createImageData(SIZE, SIZE);
  draw(image.data);
  context.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.anisotropy = 8;
  texture.colorSpace = color ? SRGBColorSpace : NoColorSpace;

  return texture;
};

const bumps = new Map<GrainId, CanvasTexture>();

/** Relief of a material, shared by all shades. */
export const bumpTexture = (grain: GrainId): CanvasTexture => {
  const cached = bumps.get(grain);
  if (cached) {
    return cached;
  }
  const field = heightField(grain);
  const texture = canvasTexture((data) => {
    for (let i = 0; i < field.length; i += 1) {
      const value = Math.round(Math.min(1, Math.max(0, field[i])) * 255);
      data[i * 4] = value;
      data[i * 4 + 1] = value;
      data[i * 4 + 2] = value;
      data[i * 4 + 3] = 255;
    }
  }, false);
  bumps.set(grain, texture);

  return texture;
};

/** Colour of the material: base colour, pattern and the relief's shading baked into one tile. */
export const colorTexture = (grain: GrainId, base: string, pattern: PatternId, patternColor: string): CanvasTexture => {
  const field = heightField(grain);
  const { contrast } = GRAINS[grain];
  // Linear values, so the mix matches what the renderer does with sRGB textures.
  const a = new Color(base);
  const b = new Color(patternColor);
  const toByte = (linear: number) => {
    const clamped = Math.min(1, Math.max(0, linear));
    const srgb = clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * clamped ** (1 / 2.4) - 0.055;

    return Math.round(srgb * 255);
  };

  return canvasTexture((data) => {
    for (let y = 0; y < SIZE; y += 1) {
      for (let x = 0; x < SIZE; x += 1) {
        const i = y * SIZE + x;
        const mask = pattern === 'uni' ? 0 : patternMask(pattern, x / SIZE, y / SIZE);
        const shade = 1 + contrast * (field[i] - 0.5) * 2;
        data[i * 4] = toByte((a.r + (b.r - a.r) * mask) * shade);
        data[i * 4 + 1] = toByte((a.g + (b.g - a.g) * mask) * shade);
        data[i * 4 + 2] = toByte((a.b + (b.b - a.b) * mask) * shade);
        data[i * 4 + 3] = 255;
      }
    }
  }, true);
};

/** Soft round glow for the halo around a lit shade. */
export const glowTexture = (() => {
  let texture: CanvasTexture | null = null;

  return (): CanvasTexture => {
    if (!texture) {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Canvas 2D is not available');
      }
      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.35, 'rgba(255,255,255,0.35)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);
      texture = new CanvasTexture(canvas);
    }

    return texture;
  };
})();

/** Wooden floor boards, one tile is 1.2 × 1.2 m. */
export const floorTexture = (() => {
  let texture: CanvasTexture | null = null;

  return (): CanvasTexture => {
    if (!texture) {
      // sRGB bytes of oak.
      const base = { r: 0xb4, g: 0x8a, b: 0x5e };
      texture = canvasTexture((data) => {
        for (let y = 0; y < SIZE; y += 1) {
          for (let x = 0; x < SIZE; x += 1) {
            const u = x / SIZE;
            const v = y / SIZE;
            const board = Math.floor(u * 8);
            const offset = hash(board, 0, 51);
            const plank = Math.floor(frac(v + offset) * 2);
            const tone = 0.82 + 0.3 * hash(board, plank, 52);
            const grain =
              0.88 + 0.24 * noise(u, v + offset, 64, 6, 53) + 0.08 * Math.sin(v * 90 + noise(u, v, 8, 8, 54) * 9);
            const seam = frac(u * 8) < 0.025 || frac((v + offset) * 2) < 0.006 ? 0.55 : 1;
            const i = (y * SIZE + x) * 4;
            data[i] = Math.min(255, base.r * tone * grain * seam);
            data[i + 1] = Math.min(255, base.g * tone * grain * seam);
            data[i + 2] = Math.min(255, base.b * tone * grain * seam);
            data[i + 3] = 255;
          }
        }
      }, true);
    }

    return texture;
  };
})();

/** Texture from an image the visitor chose («Eigenes Motiv»); stays in the browser. */
export const imageTexture = (image: HTMLImageElement): Texture => {
  const texture = new Texture(image);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  return texture;
};
