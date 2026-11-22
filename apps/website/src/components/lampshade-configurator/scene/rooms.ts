import type { LampId, RoomId } from '@/domain/lampshade/catalog';
import { Color, SRGBColorSpace } from 'three';

type Vec3 = [number, number, number];

/** Where the lamp stands (table, floor, wall), and the bottom edge of its shade, in metres. */
export type LampPlacement = {
  /** Foot of a table or floor lamp, ceiling point of a pendant, wall point of a wall lamp. */
  anchor: Vec3;
  /** Height of the shade's bottom rim above the floor. */
  shadeBottom: number;
};

export type RoomLayout = {
  wall: string;
  ceiling: number | null;
  lamps: Record<LampId, LampPlacement>;
  /** Camera direction from the shade (normalised later), seen from the room. */
  view: Vec3;
};

export const BACK_WALL_Z = -2.4;
export const SIDE_WALL_X = -3.4;
export const CEILING = 2.7;

export const ROOM_LAYOUTS: Record<RoomId, RoomLayout> = {
  atelier: {
    wall: '#e9e6e1',
    ceiling: null,
    view: [0.35, 0.22, 1],
    lamps: {
      tisch: { anchor: [0, 0.72, -0.9], shadeBottom: 0.72 + 0.34 },
      steh: { anchor: [0, 0, -0.9], shadeBottom: 1.28 },
      pendel: { anchor: [0, 3.6, -0.9], shadeBottom: 1.35 },
      wand: { anchor: [0, 1.45, BACK_WALL_Z], shadeBottom: 1.45 },
    },
  },
  wohnen: {
    wall: '#ebe6de',
    ceiling: CEILING,
    view: [0.25, 0.18, 1],
    lamps: {
      tisch: { anchor: [1.55, 0.55, -1.85], shadeBottom: 0.55 + 0.34 },
      steh: { anchor: [-1.45, 0, -1.9], shadeBottom: 1.28 },
      pendel: { anchor: [0.1, CEILING, -0.55], shadeBottom: 1.55 },
      wand: { anchor: [1.55, 1.45, BACK_WALL_Z], shadeBottom: 1.45 },
    },
  },
  essen: {
    wall: '#e1e5dd',
    ceiling: CEILING,
    view: [0.3, 0.25, 1],
    lamps: {
      tisch: { anchor: [0.55, 0.805, -2.12], shadeBottom: 0.805 + 0.34 },
      steh: { anchor: [-1.75, 0, -1.95], shadeBottom: 1.28 },
      pendel: { anchor: [0, CEILING, -0.85], shadeBottom: 1.42 },
      // Right of the picture (x −0.8 to 0).
      wand: { anchor: [0.75, 1.5, BACK_WALL_Z], shadeBottom: 1.5 },
    },
  },
  schlafen: {
    wall: '#e8e0e2',
    ceiling: CEILING,
    view: [0.3, 0.2, 1],
    lamps: {
      tisch: { anchor: [1.25, 0.51, -2.08], shadeBottom: 0.51 + 0.34 },
      steh: { anchor: [-2.15, 0, -1.95], shadeBottom: 1.28 },
      pendel: { anchor: [-1.25, CEILING, -2.0], shadeBottom: 1.15 },
      wand: { anchor: [1.25, 1.2, BACK_WALL_Z], shadeBottom: 1.2 },
    },
  },
};

/** Light colour of a bulb with the given colour temperature (approximation by Tanner Helland). */
export const kelvinColor = (kelvin: number, target = new Color()): Color => {
  const k = kelvin / 100;
  const red = k <= 66 ? 255 : 329.698727446 * (k - 60) ** -0.1332047592;
  const green = k <= 66 ? 99.4708025861 * Math.log(k) - 161.1195681661 : 288.1221695283 * (k - 60) ** -0.0755148492;
  const blue = k >= 66 ? 255 : k <= 19 ? 0 : 138.5177312231 * Math.log(k - 10) - 305.0447927307;
  const clamp = (value: number) => Math.min(255, Math.max(0, value)) / 255;

  return target.setRGB(clamp(red), clamp(green), clamp(blue), SRGBColorSpace);
};
