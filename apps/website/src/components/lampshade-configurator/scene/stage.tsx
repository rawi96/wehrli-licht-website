'use client';

import type { LampshadeDesign } from '@/domain/lampshade/design';
import { ShapeParams, toShapeParams } from '@/domain/lampshade/shape';
import { CameraControls, Environment, Html, Lightformer, Line, PerformanceMonitor } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { FC, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { BackSide, DirectionalLight, HemisphereLight, Object3D, Vector3 } from 'three';
import { Lamp, LightState } from './lamp';
import { Room } from './room';
import { BACK_WALL_Z, ROOM_LAYOUTS, SIDE_WALL_X } from './rooms';

export type StageHandle = {
  /** The current view as a JPEG data URL. */
  capture: () => string;
};

type Props = {
  design: LampshadeDesign;
  lightOn: boolean;
  dimmer: number;
  kelvin: number;
  motif: HTMLImageElement | null;
  showSizes: boolean;
  /** Pauses rendering, e.g. while the configurator is scrolled out of view. */
  paused: boolean;
  handle: RefObject<StageHandle | null>;
  onInteract?: () => void;
};

/** Distance of the camera from the shade, per lamp. */
const DISTANCE = { tisch: 2.3, steh: 3.1, pendel: 2.9, wand: 2.3 } as const;

const shadeCentre = (design: LampshadeDesign): Vector3 => {
  const { lamps } = ROOM_LAYOUTS[design.room];
  const placement = lamps[design.lamp];
  const z = design.lamp === 'wand' ? BACK_WALL_Z + 0.25 : placement.anchor[2];

  return new Vector3(placement.anchor[0], placement.shadeBottom + design.height / 200, z);
};

const MAX_DISTANCE = 3.6;
const MAX_AZIMUTH = 1.15;

/**
 * How far the camera may orbit to the left before it passes the side wall (rooms have one on the left). With
 * MAX_DISTANCE and a polar angle up to 1.75 (slightly below the horizon) it also stays above the floor.
 */
const minAzimuthFor = (room: LampshadeDesign['room'], target: Vector3): number => {
  if (room === 'atelier') {
    return -MAX_AZIMUTH;
  }
  const space = (target.x - (SIDE_WALL_X + 0.3)) / MAX_DISTANCE;

  return -Math.min(MAX_AZIMUTH, Math.asin(Math.min(1, Math.max(0, space))));
};

/** Moves the camera smoothly to the lamp whenever lamp or room change. */
const CameraRig: FC<{ design: LampshadeDesign; onInteract?: () => void }> = ({ design, onInteract }) => {
  const controlsRef = useRef<CameraControls>(null);
  const firstRef = useRef(true);
  const { room, lamp } = design;
  const minAzimuth = minAzimuthFor(room, shadeCentre(design));

  useEffect(() => {
    const { view } = ROOM_LAYOUTS[room];
    const target = shadeCentre({ ...design, room, lamp });
    const direction = new Vector3(view[0], lamp === 'pendel' ? -0.04 : view[1], view[2]).normalize();
    const size = Math.max(design.bottom, design.top, design.height) / 40;
    const distance = Math.min(MAX_DISTANCE, DISTANCE[lamp] * Math.min(1.35, Math.max(0.85, size)));
    const position = target.clone().add(direction.clone().multiplyScalar(distance));
    const camera = controlsRef.current;
    if (!camera) {
      return;
    }
    if (firstRef.current) {
      // Entrance: start further away and glide in.
      firstRef.current = false;
      const far = target.clone().add(direction.clone().multiplyScalar(distance * 2.2));
      void camera.setLookAt(far.x, far.y + 0.6, far.z, target.x, target.y, target.z, false);
    }
    void camera.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, true);
    // Only lamp and room move the camera, not every change of the shade.
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, [room, lamp]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={0.6}
      maxDistance={MAX_DISTANCE}
      minPolarAngle={0.25}
      maxPolarAngle={1.75}
      minAzimuthAngle={minAzimuth}
      maxAzimuthAngle={MAX_AZIMUTH}
      smoothTime={0.45}
      onStart={onInteract}
    />
  );
};

/** Daylight from the window and sky; fades out in the evening. */
const Daylight: FC<{ light: RefObject<LightState> }> = ({ light }) => {
  const sunRef = useRef<DirectionalLight>(null);
  const skyRef = useRef<HemisphereLight>(null);
  const target = useMemo(() => new Object3D(), []);
  const scene = useThree((state) => state.scene);

  useFrame(() => {
    if (!sunRef.current || !skyRef.current) {
      return;
    }
    const night = light.current.target > 0 ? 1 : 0;
    const userData = sunRef.current.userData as { day?: number };
    const day = userData.day ?? 1 - night;
    const next = day + (1 - night - day) * 0.06;
    userData.day = next;
    sunRef.current.intensity = next * 2.4;
    skyRef.current.intensity = 0.05 + next * 1.1;
    scene.environmentIntensity = 0.22 + next * 0.5;
  });

  return (
    <>
      <hemisphereLight ref={skyRef} args={['#e8eef7', '#8a7a68', 1]} />
      <directionalLight
        ref={sunRef}
        position={[SIDE_WALL_X - 2, 3.4, 0.8]}
        target={target}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        color="#fff4e6"
      />
      <primitive object={target} position={[0, 0, -1.2]} />
    </>
  );
};

/** Size lines with labels in cm next to the shade. */
const SizeLabels: FC<{ design: LampshadeDesign }> = ({ design }) => {
  const centre = shadeCentre(design);
  const height = design.height / 100;
  const bottom = design.bottom / 200;
  const top = design.top / 200;
  const y0 = centre.y - height / 2;
  const side = Math.max(bottom, top) + 0.06;
  const front = design.lamp === 'wand' ? centre.z + 0.15 : centre.z;
  const label = 'rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold whitespace-nowrap text-black shadow-sm';
  const color = '#214073';

  return (
    <group position={[centre.x, 0, front]}>
      <Line
        points={[
          [side, y0, 0],
          [side, y0 + height, 0],
        ]}
        color={color}
        lineWidth={1.5}
      />
      <Line
        points={[
          [-bottom, y0 - 0.04, 0],
          [bottom, y0 - 0.04, 0],
        ]}
        color={color}
        lineWidth={1.5}
      />
      <Line
        points={[
          [-top, y0 + height + 0.04, 0],
          [top, y0 + height + 0.04, 0],
        ]}
        color={color}
        lineWidth={1.5}
      />
      <Html position={[side + 0.02, y0 + height / 2, 0]} center={false} zIndexRange={[20, 0]}>
        <span className={label}>{design.height} cm</span>
      </Html>
      <Html position={[0, y0 - 0.07, 0]} center zIndexRange={[20, 0]}>
        <span className={label}>{design.bottom} cm</span>
      </Html>
      <Html position={[0, y0 + height + 0.08, 0]} center zIndexRange={[20, 0]}>
        <span className={label}>{design.top} cm</span>
      </Html>
    </group>
  );
};

const Capture: FC<{ handle: RefObject<StageHandle | null> }> = ({ handle }) => {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    handle.current = {
      capture: () => {
        gl.render(scene, camera);

        return gl.domElement.toDataURL('image/jpeg', 0.92);
      },
    };
  }, [gl, scene, camera, handle]);

  return null;
};

export const Stage: FC<Props> = ({ design, lightOn, dimmer, kelvin, motif, showSizes, paused, handle, onInteract }) => {
  const [dpr, setDpr] = useState(1.75);
  const lightRef = useRef<LightState>({ level: 0, target: 0, kelvin });
  lightRef.current.target = lightOn ? dimmer : 0;
  lightRef.current.kelvin = kelvin;
  const shapeRef = useRef<ShapeParams>(toShapeParams(design));
  const placement = ROOM_LAYOUTS[design.room].lamps[design.lamp];

  return (
    <Canvas
      shadows="percentage"
      dpr={dpr}
      frameloop={paused ? 'never' : 'always'}
      camera={{ fov: 38, near: 0.05, far: 30, position: [0, 1.6, 3] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      aria-hidden
    >
      <color attach="background" args={['#d9d6d0']} />
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.75)} />
      <Environment resolution={128} frames={1}>
        {/* Soft room around everything, so metals never mirror black. */}
        <mesh scale={20}>
          <sphereGeometry args={[1, 32, 16]} />
          <meshBasicMaterial color="#8d8780" side={BackSide} />
        </mesh>
        <Lightformer intensity={2} position={[0, 4, 0]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} />
        <Lightformer intensity={3} position={[-5, 2, 0]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} color="#eaf1fb" />
        <Lightformer intensity={1.2} position={[5, 1.5, 2]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} color="#fff1dc" />
        <Lightformer intensity={0.6} position={[0, 1, 5]} scale={[6, 3, 1]} />
      </Environment>
      <Daylight light={lightRef} />
      <ambientLight intensity={0.04} color="#9fb0d0" />
      <Room room={design.room} daylight={lightOn ? 0 : 1} showPlinth={design.lamp === 'tisch'} />
      <Lamp design={design} placement={placement} light={lightRef} motif={motif} shape={shapeRef} />
      {showSizes && <SizeLabels design={design} />}
      <CameraRig design={design} onInteract={onInteract} />
      <Capture handle={handle} />
    </Canvas>
  );
};
