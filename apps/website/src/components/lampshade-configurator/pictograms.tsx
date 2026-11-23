import type { LampId, RoomId } from '@/domain/lampshade/catalog';
import { FC } from 'react';

/** Line drawings in a 48 × 48 box, for the room and lamp cards. */
const ROOM_PATHS: Record<RoomId, string> = {
  atelier: 'M24 6 14 42M24 6l10 36M24 6v36M14 12h20v15H14z',
  wohnen: 'M7 24h34v10H7zM12 24v-8h24v8M10 34v5M38 34v5M12 29h24',
  essen: 'M24 4v7M18 11h12l3 6H15zM8 28h32M12 28v13M36 28v13M17 28v-5M31 28v-5',
  schlafen: 'M6 14v26M6 30h36v10M42 30v-4H6M10 25h9v5h-9zM6 20h10',
};

const LAMP_PATHS: Record<LampId, string> = {
  tisch: 'M16 9h16l5 15H11zM24 24v14M16 41h16',
  steh: 'M17 4h14l4 11H13zM24 15v27M16 44h16',
  pendel: 'M24 2v14M17 16h14l7 14H10zM21 34h6',
  wand: 'M8 4v40M8 26h8M16 14h11l4 17H16z',
};

const Pictogram: FC<{ path: string }> = ({ path }) => (
  <svg
    viewBox="0 0 48 48"
    className="size-12"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={path} />
  </svg>
);

export const RoomPictogram: FC<{ room: RoomId }> = ({ room }) => <Pictogram path={ROOM_PATHS[room]} />;

export const LampPictogram: FC<{ lamp: LampId }> = ({ lamp }) => <Pictogram path={LAMP_PATHS[lamp]} />;

/** A round colour sample, e.g. for a material or lining card. */
export const ColorDot: FC<{ hex: string }> = ({ hex }) => (
  // The colour comes from the catalogue or the visitor's choice.
  <span className="block size-11 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: hex }} />
);

/** A shade outline (path in a 100 × 100 box) drawn at a share of the full size, for the size cards. */
export const SizeOutline: FC<{ path: string; scale: number }> = ({ path, scale }) => (
  <svg viewBox="0 0 100 100" className="size-14" aria-hidden="true">
    <path d={path} className="fill-current" transform={`translate(50 90) scale(${scale}) translate(-50 -90)`} />
  </svg>
);

const BULB = 'M24 8a10 10 0 0 0-6 18v6h12v-6a10 10 0 0 0-6-18zM19 37h10M21 42h6';
const RAYS = 'M24 1v2M9 7l2 2M39 7l-2 2M4 19h3M44 19h-3';

/** A light bulb, with rays when it is on. */
export const LightPictogram: FC<{ on: boolean }> = ({ on }) => <Pictogram path={on ? `${BULB}${RAYS}` : BULB} />;
