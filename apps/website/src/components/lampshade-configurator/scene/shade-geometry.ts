import { radiusAt, ShapeParams, surfacePoint } from '@/domain/lampshade/shape';
import { BufferAttribute, BufferGeometry } from 'three';

// Geometries of the shade that are rebuilt in place while the shape morphs: no new buffers per frame.

const SEGMENTS = 160;
const ROWS = 64;
/** The seam lies at the back of the shade. */
const angleAt = (j: number) => -Math.PI / 2 + (2 * Math.PI * j) / SEGMENTS;

const point: [number, number, number] = [0, 0, 0];

export const createShadeGeometry = (): BufferGeometry => {
  const geometry = new BufferGeometry();
  const count = (SEGMENTS + 1) * (ROWS + 1);
  const uv = new Float32Array(count * 2);
  const index: number[] = [];
  for (let i = 0; i <= ROWS; i += 1) {
    for (let j = 0; j <= SEGMENTS; j += 1) {
      const k = i * (SEGMENTS + 1) + j;
      uv[k * 2] = j / SEGMENTS;
      uv[k * 2 + 1] = i / ROWS;
      if (i < ROWS && j < SEGMENTS) {
        const a = k;
        const b = k + SEGMENTS + 1;
        const c = k + 1;
        const d = b + 1;
        index.push(a, b, c, b, d, c);
      }
    }
  }
  geometry.setIndex(index);
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('normal', new BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('uv', new BufferAttribute(uv, 2));

  return geometry;
};

/** Writes the surface of `params` into the geometry; returns the perimeter at mid height (for texture scale). */
export const updateShadeGeometry = (geometry: BufferGeometry, params: ShapeParams): number => {
  const position = geometry.getAttribute('position') as BufferAttribute;
  const positions = position.array as Float32Array;
  let perimeter = 0;
  let previous: [number, number] | null = null;
  for (let i = 0; i <= ROWS; i += 1) {
    const t = i / ROWS;
    for (let j = 0; j <= SEGMENTS; j += 1) {
      surfacePoint(params, t, angleAt(j), point);
      const k = (i * (SEGMENTS + 1) + j) * 3;
      positions[k] = point[0];
      positions[k + 1] = point[1];
      positions[k + 2] = point[2];
      if (i === ROWS / 2) {
        if (previous) {
          perimeter += Math.hypot(point[0] - previous[0], point[2] - previous[1]);
        }
        previous = [point[0], point[2]];
      }
    }
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();

  // The seam's two columns share a position: give them the same normal.
  const normals = (geometry.getAttribute('normal') as BufferAttribute).array as Float32Array;
  for (let i = 0; i <= ROWS; i += 1) {
    const first = i * (SEGMENTS + 1) * 3;
    const last = first + SEGMENTS * 3;
    for (let axis = 0; axis < 3; axis += 1) {
      const average = (normals[first + axis] + normals[last + axis]) / 2;
      normals[first + axis] = average;
      normals[last + axis] = average;
    }
  }
  geometry.computeBoundingSphere();

  return perimeter;
};

/** Cross-section of a rim, as offsets outwards (m) and along the surface (m, positive: into the shade). */
export type RimProfile = [number, number][];

const circle = (radius: number, steps = 10): RimProfile =>
  Array.from({ length: steps }, (_, step) => {
    const angle = (2 * Math.PI * step) / steps;

    return [radius + radius * Math.cos(angle), radius * Math.sin(angle)];
  });

export const RIM_PROFILES = {
  /** Folded fabric edge. */
  edge: circle(0.0016, 6),
  /** Piping. */
  piping: circle(0.0042, 10),
  /** Band (Borte), 2.5 cm on the surface. */
  band: [
    [0.0005, -0.0015],
    [0.0022, -0.0015],
    [0.0026, 0.004],
    [0.0026, 0.021],
    [0.0022, 0.025],
    [0.0005, 0.025],
  ] as RimProfile,
};

const RIM_SEGMENTS = SEGMENTS;

export const createRimGeometry = (profile: RimProfile): BufferGeometry => {
  const geometry = new BufferGeometry();
  const sides = profile.length;
  const count = (RIM_SEGMENTS + 1) * sides;
  const index: number[] = [];
  for (let j = 0; j < RIM_SEGMENTS; j += 1) {
    for (let s = 0; s < sides; s += 1) {
      const a = j * sides + s;
      const b = j * sides + ((s + 1) % sides);
      const c = a + sides;
      const d = b + sides;
      index.push(a, c, b, b, c, d);
    }
  }
  geometry.setIndex(index);
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('normal', new BufferAttribute(new Float32Array(count * 3), 3));
  geometry.userData.profile = profile;

  return geometry;
};

const before: [number, number, number] = [0, 0, 0];
const after: [number, number, number] = [0, 0, 0];

/** Places a rim along the bottom (`top` false) or top edge of the shade. */
export const updateRimGeometry = (geometry: BufferGeometry, params: ShapeParams, top: boolean) => {
  const profile = geometry.userData.profile as RimProfile;
  const positions = (geometry.getAttribute('position') as BufferAttribute).array as Float32Array;
  const sides = profile.length;
  const epsilon = 0.002;
  for (let j = 0; j <= RIM_SEGMENTS; j += 1) {
    const angle = angleAt(j);
    surfacePoint(params, top ? 1 : 0, angle - epsilon, before);
    surfacePoint(params, top ? 1 : 0, angle + epsilon, after);
    // Outward direction in the horizontal plane, from the tangent around the shade.
    let nx = after[2] - before[2];
    let nz = -(after[0] - before[0]);
    const length = Math.hypot(nx, nz) || 1;
    nx /= length;
    nz /= length;
    for (let s = 0; s < sides; s += 1) {
      const [out, along] = profile[s];
      const t = top ? 1 - along / params.height : along / params.height;
      surfacePoint(params, Math.min(1, Math.max(0, t)), angle, before);
      // Parts of the profile past the rim continue straight down (bottom) or up (top).
      const beyond = along < 0 ? -along : 0;
      const k = (j * sides + s) * 3;
      positions[k] = before[0] + nx * out;
      positions[k + 1] = before[1] + (top ? beyond : -beyond);
      positions[k + 2] = before[2] + nz * out;
    }
  }
  (geometry.getAttribute('position') as BufferAttribute).needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
};

/** Radii of the rims, for the frame and the light cones. */
export const rimRadii = (params: ShapeParams) => {
  const { bottom, top } = radiusAt(params, 0);

  return { bottom, top };
};
