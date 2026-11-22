import { findShape, ProfileId } from './catalog';
import type { LampshadeDesign } from './design';

/**
 * Numeric description of a shade surface, in metres. Every value can be interpolated, so a shade morphs smoothly
 * from one form into the next: the profile is a weighted mix of the profile curves.
 */
export type ShapeParams = {
  height: number;
  bottom: number;
  top: number;
  /** Depth relative to the width, 0.4 to 1. */
  depth: number;
  /** Exponent of the cross-section (2: round, higher: square). */
  corners: number;
  /** 0 or 1: flat back. */
  half: number;
  /** 0 or 1: waved bottom rim. */
  wave: number;
  profile: Record<ProfileId, number>;
};

export const PROFILES: ProfileId[] = ['straight', 'pagoda', 'doublePagoda', 'tiers'];

export const toShapeParams = (design: LampshadeDesign): ShapeParams => {
  const shape = findShape(design.shape);

  return {
    height: design.height / 100,
    bottom: design.bottom / 100,
    top: design.top / 100,
    depth: design.depth / 100,
    corners: shape.corners,
    half: shape.half ? 1 : 0,
    wave: shape.wave ? 1 : 0,
    profile: { straight: 0, pagoda: 0, doublePagoda: 0, tiers: 0, [shape.profile]: 1 },
  };
};

/** Moves params a step towards a target (exponential damping); returns whether they are still moving. */
export const dampShapeParams = (current: ShapeParams, target: ShapeParams, factor: number): boolean => {
  let moving = false;
  const step = (from: number, to: number) => {
    const next = from + (to - from) * factor;
    if (Math.abs(to - next) > 1e-4) {
      moving = true;

      return next;
    }

    return to;
  };

  current.height = step(current.height, target.height);
  current.bottom = step(current.bottom, target.bottom);
  current.top = step(current.top, target.top);
  current.depth = step(current.depth, target.depth);
  current.corners = step(current.corners, target.corners);
  current.half = step(current.half, target.half);
  current.wave = step(current.wave, target.wave);
  for (const profile of PROFILES) {
    current.profile[profile] = step(current.profile[profile], target.profile[profile]);
  }

  return moving;
};

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));

  return t * t * (3 - 2 * t);
};

/** Half width at height t (0: bottom rim, 1: top rim) for each profile. */
const profileRadius = (profile: ProfileId, t: number, bottom: number, top: number): number => {
  switch (profile) {
    case 'straight':
      return bottom + (top - bottom) * t;
    case 'pagoda':
      // Concave sides that swing out at the bottom.
      return top + (bottom - top) * (1 - t) ** 2.3;
    case 'doublePagoda': {
      const middle = top + (bottom - top) * 0.4;

      return t < 0.5 ? middle + (bottom - middle) * (1 - 2 * t) ** 2.2 : top + (middle - top) * (2 - 2 * t) ** 2.2;
    }
    case 'tiers': {
      // Three stacked cylinders, with short steps between them.
      const step = smoothstep(0.31, 0.35, t) + smoothstep(0.64, 0.68, t);

      return bottom + ((top - bottom) * step) / 2;
    }
  }
};

export const radiusAt = (params: ShapeParams, t: number): { bottom: number; top: number; radius: number } => {
  const bottom = params.bottom / 2;
  const top = params.top / 2;
  let radius = 0;
  let weight = 0;
  for (const profile of PROFILES) {
    const w = params.profile[profile];
    if (w > 0) {
      radius += w * profileRadius(profile, t, bottom, top);
      weight += w;
    }
  }

  return { bottom, top, radius: weight > 0 ? radius / weight : bottom };
};

/**
 * Point on the surface: t from bottom (0) to top (1), angle around the shade. The cross-section is a superellipse,
 * the back is flattened for half shades, the bottom rim waved. The shade's bottom centre is the origin.
 */
export const surfacePoint = (params: ShapeParams, t: number, angle: number, out: [number, number, number]) => {
  const { radius } = radiusAt(params, t);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const exponent = 2 / params.corners;
  let x = Math.sign(cos) * Math.abs(cos) ** exponent * radius;
  let z = Math.sign(sin) * Math.abs(sin) ** exponent * radius * params.depth;
  if (z < 0) {
    z *= 1 - params.half * 0.985;
  }
  // A half shade is mounted with its flat back on the wall: move it forward.
  z += params.half * 0.004;
  let y = t * params.height;
  if (params.wave > 0) {
    y += params.wave * (1 - t) ** 4 * params.height * 0.09 * (0.5 + 0.5 * Math.cos(angle * 10));
  }
  x = Number.isFinite(x) ? x : 0;
  out[0] = x;
  out[1] = y;
  out[2] = z;
};

/** Side view of a shape as an SVG path in a 0–100 box, for the form picker. */
export const silhouettePath = (params: ShapeParams): string => {
  const scale = 80 / Math.max(params.height, params.bottom, params.top);
  const steps = 24;
  const points: string[] = [];
  const edge = (t: number) => radiusAt(params, t).radius * scale;
  const y = (t: number) => 50 + (params.height * scale) / 2 - t * params.height * scale;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    points.push(`${(50 - edge(t)).toFixed(1)},${y(t).toFixed(1)}`);
  }
  for (let i = steps; i >= 0; i -= 1) {
    const t = i / steps;
    points.push(`${(50 + edge(t)).toFixed(1)},${y(t).toFixed(1)}`);
  }

  return `M${points.join('L')}Z`;
};
