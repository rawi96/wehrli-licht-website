'use client';

import { FINISHES, findMaterial, LININGS } from '@/domain/lampshade/catalog';
import type { LampshadeDesign } from '@/domain/lampshade/design';
import { dampShapeParams, radiusAt, ShapeParams, toShapeParams } from '@/domain/lampshade/shape';
import { useFrame } from '@react-three/fiber';
import { FC, RefObject, useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BackSide,
  Color,
  DoubleSide,
  FrontSide,
  Group,
  LatheGeometry,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PointLight,
  SpotLight,
  Sprite,
  SplineCurve,
  SpriteMaterial,
  Texture,
  Vector2,
  Vector3,
} from 'three';
import { BACK_WALL_Z, kelvinColor, LampPlacement } from './rooms';
import {
  createRimGeometry,
  createShadeGeometry,
  RIM_PROFILES,
  updateRimGeometry,
  updateShadeGeometry,
} from './shade-geometry';
import { bumpTexture, colorTexture, glowTexture, imageTexture, TILE_SIZE_M } from './textures';

export type LightState = {
  /** 0 (off) to 1 (on at full dimmer), animated towards the target. */
  level: number;
  target: number;
  kelvin: number;
};

type Props = {
  design: LampshadeDesign;
  placement: LampPlacement;
  light: RefObject<LightState>;
  motif: HTMLImageElement | null;
  /** Current, morphing shape: shared with the size labels. */
  shape: RefObject<ShapeParams>;
};

/** Height of the bulb in the shade, relative to its height. */
const BULB_AT = { tisch: 0.36, steh: 0.4, pendel: 0.55, wand: 0.45 } as const;

const scratch = new Vector3();

/** Places a unit cylinder (height 1 along y) between two points. */
const stretch = (object: Object3D, from: Vector3, to: Vector3) => {
  object.position.copy(from).add(to).multiplyScalar(0.5);
  scratch.copy(to).sub(from);
  const length = scratch.length();
  object.scale.set(1, Math.max(length, 1e-4), 1);
  object.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), scratch.normalize());
};

const useFinish = (finishId: LampshadeDesign['finish']) => {
  const material = useMemo(() => new MeshStandardMaterial(), []);
  const finish = FINISHES.find(({ id }) => id === finishId) ?? FINISHES[0];
  material.color.set(finish.hex);
  material.metalness = finish.metalness;
  material.roughness = finish.roughness;

  return material;
};

/** Table lamp foot: a turned body, like a vase. */
const tableFootGeometry = new LatheGeometry(
  new SplineCurve(
    [
      [0.001, 0],
      [0.078, 0.002],
      [0.08, 0.016],
      [0.07, 0.035],
      [0.098, 0.11],
      [0.104, 0.17],
      [0.085, 0.24],
      [0.045, 0.28],
      [0.022, 0.3],
      [0.02, 0.32],
      [0.001, 0.322],
    ].map(([x, y]) => new Vector2(x, y)),
  ).getPoints(60),
  96,
);

export const Lamp: FC<Props> = ({ design, placement, light, motif, shape }) => {
  const material = findMaterial(design.material);
  const lining = LININGS.find(({ id }) => id === design.lining) ?? LININGS[0];
  const finish = useFinish(design.finish);
  const target = useMemo(() => toShapeParams(design), [design]);

  // Geometry and materials, updated in place.
  const shadeGeometry = useMemo(() => createShadeGeometry(), []);
  const rims = useMemo(
    () => ({
      edge: [createRimGeometry(RIM_PROFILES.edge), createRimGeometry(RIM_PROFILES.edge)],
      piping: [createRimGeometry(RIM_PROFILES.piping), createRimGeometry(RIM_PROFILES.piping)],
      band: [createRimGeometry(RIM_PROFILES.band), createRimGeometry(RIM_PROFILES.band)],
    }),
    [],
  );
  const rimGeometries = rims[design.trim === 'paspel' ? 'piping' : design.trim === 'borte' ? 'band' : 'edge'];
  const uniforms = useMemo(() => ({ uBulb: { value: 0.4 } }), []);
  const outer = useMemo(() => {
    const result = new MeshPhysicalMaterial({ side: FrontSide, shadowSide: DoubleSide, sheenRoughness: 0.45 });
    result.onBeforeCompile = (shader) => {
      shader.uniforms.uBulb = uniforms.uBulb;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying float vShadeV;')
        .replace('#include <uv_vertex>', '#include <uv_vertex>\nvShadeV = uv.y;');
      // Backlit fabric glows most around the bulb.
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying float vShadeV;\nuniform float uBulb;')
        .replace(
          '#include <emissivemap_fragment>',
          '#include <emissivemap_fragment>\ntotalEmissiveRadiance *= 0.3 + 1.1 * exp(-pow((vShadeV - uBulb) * 2.4, 2.0));',
        );
    };

    return result;
  }, [uniforms]);
  const inner = useMemo(() => new MeshStandardMaterial({ side: BackSide }), []);
  const trimMaterial = useMemo(() => new MeshStandardMaterial({ side: DoubleSide, roughness: 0.7 }), []);
  const halo = useMemo(
    () =>
      new SpriteMaterial({
        map: glowTexture(),
        blending: AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0,
      }),
    [],
  );

  // Colour texture of the material, or the visitor's motif.
  const map = useMemo<Texture>(() => {
    if (design.pattern === 'motiv' && motif) {
      return imageTexture(motif);
    }

    return colorTexture(
      material.grain,
      design.color,
      design.pattern === 'motiv' ? 'uni' : design.pattern,
      design.patternColor,
    );
  }, [material.grain, design.color, design.pattern, design.patternColor, motif]);
  useEffect(() => () => map.dispose(), [map]);

  const isMotif = design.pattern === 'motiv' && motif !== null;
  const bump = bumpTexture(material.grain);
  const metalLining = lining.metal;
  // A metal-coated lining keeps the light inside: it only leaves at the top and bottom.
  const translucency = material.translucency * (metalLining ? 0.08 : 1);
  const lightTint = useMemo(
    () => new Color(lining.hex).lerp(new Color('#ffffff'), metalLining ? 0.35 : 0.85),
    [lining.hex, metalLining],
  );

  useEffect(() => {
    outer.map = map;
    outer.emissiveMap = map;
    outer.bumpMap = isMotif ? null : bump;
    outer.bumpScale = material.bump * 1.2;
    outer.roughness = material.roughness;
    outer.metalness = material.kind === 'metal' ? 1 : 0;
    outer.sheen = material.sheen;
    outer.sheenColor.set(design.color).lerp(new Color('#ffffff'), 0.5);
    outer.color.set('#ffffff');
    outer.needsUpdate = true;
    inner.color.set(lining.hex);
    inner.metalness = metalLining ? 0.85 : 0;
    inner.roughness = metalLining ? 0.3 : 0.9;
    inner.needsUpdate = true;
    trimMaterial.color.set(
      design.trim === 'keine' ? (material.kind === 'metal' ? design.color : lining.hex) : design.trimColor,
    );
    trimMaterial.metalness = design.trim === 'keine' && material.kind === 'metal' ? 1 : 0;
    trimMaterial.roughness = design.trim === 'keine' && material.kind === 'metal' ? 0.3 : 0.75;
  }, [
    outer,
    inner,
    trimMaterial,
    map,
    bump,
    isMotif,
    material,
    design.color,
    design.trim,
    design.trimColor,
    lining.hex,
    metalLining,
  ]);

  const shadeGroupRef = useRef<Group>(null);
  const pointLightRef = useRef<PointLight>(null);
  const downLightRef = useRef<SpotLight>(null);
  const upLightRef = useRef<SpotLight>(null);
  const haloSpriteRef = useRef<Sprite>(null);
  const bulbRef = useRef<Mesh>(null);
  const cordRef = useRef<Mesh>(null);
  const wallPlateRef = useRef<Mesh>(null);
  const armOutRef = useRef<Mesh>(null);
  const armUpRef = useRef<Mesh>(null);
  const rodRef = useRef<Mesh>(null);
  const strutRefs = [useRef<Mesh>(null), useRef<Mesh>(null), useRef<Mesh>(null)];
  const bulbMaterial = useMemo(() => new MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff' }), []);
  const lightColor = useMemo(() => new Color(), []);
  const downTarget = useMemo(() => new Object3D(), []);
  const upTarget = useMemo(() => new Object3D(), []);
  const startedRef = useRef(false);
  const bulbAt = BULB_AT[design.lamp];

  const [ax, ay, az] = placement.anchor;
  const wallLamp = design.lamp === 'wand';
  // The shade's bottom centre, in room coordinates.
  const shadePosition: [number, number, number] = wallLamp
    ? [ax, placement.shadeBottom, BACK_WALL_Z + (target.half ? 0.008 : 0.1 + (target.bottom / 2) * target.depth)]
    : [ax, placement.shadeBottom, az];

  // In a half shade the bulb sits in front of the flat back.
  const bulbZ = target.half ? (target.bottom / 2) * target.depth * 0.4 : 0;

  useFrame((_, delta) => {
    const group = shadeGroupRef.current;
    const current = shape.current;
    const state = light.current;
    if (
      !group ||
      !bulbRef.current ||
      !pointLightRef.current ||
      !downLightRef.current ||
      !upLightRef.current ||
      !haloSpriteRef.current
    ) {
      return;
    }
    const factor = startedRef.current ? 1 - Math.exp(-delta * 7) : 1;
    startedRef.current = true;
    const moving = dampShapeParams(current, target, factor);
    state.level += (state.target - state.level) * (1 - Math.exp(-delta * 5));

    if (moving || !group.userData.built || group.userData.trim !== design.trim) {
      const perimeter = updateShadeGeometry(shadeGeometry, current);
      updateRimGeometry(rimGeometries[0], current, false);
      updateRimGeometry(rimGeometries[1], current, true);
      group.userData.built = true;
      group.userData.trim = design.trim;
      group.userData.perimeter = perimeter;
    }
    const perimeter = group.userData.perimeter as number;
    if (isMotif && motif) {
      const aspect = motif.naturalWidth / Math.max(1, motif.naturalHeight);
      map.repeat.set(Math.max(1, Math.round(perimeter / (current.height * aspect))), 1);
    } else {
      map.repeat.set(Math.max(1, Math.round(perimeter / TILE_SIZE_M)), current.height / TILE_SIZE_M);
    }
    bump.repeat.copy(map.repeat);

    // Frame: three struts from the top ring to the centre, a rodRef down to the foot.
    const height = current.height;
    const { top: topRadius, bottom: bottomRadius } = radiusAt(current, 0);
    const hub = new Vector3(0, design.lamp === 'pendel' ? height + 0.005 : height - 0.03, 0);
    strutRefs.forEach((strut, index) => {
      const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 3 + Math.PI;
      const end = new Vector3(
        Math.cos(angle) * topRadius * 0.98,
        height - 0.003,
        Math.sin(angle) * topRadius * current.depth * 0.98,
      );
      if (current.half > 0.5 && end.z < 0) {
        end.z = 0.01;
      }
      if (strut.current) {
        stretch(strut.current, hub, end);
      }
    });
    if (rodRef.current) {
      stretch(rodRef.current, new Vector3(0, design.lamp === 'tisch' ? -0.03 : 0.02 - placement.shadeBottom, 0), hub);
    }
    if (wallPlateRef.current && armOutRef.current && armUpRef.current) {
      const wall = BACK_WALL_Z - shadePosition[2];
      const elbow = new Vector3(0, -0.06, bulbZ);
      wallPlateRef.current.position.set(0, -0.06, wall + 0.006);
      stretch(armOutRef.current, new Vector3(0, -0.06, wall), elbow);
      stretch(armUpRef.current, elbow, new Vector3(0, height * bulbAt, bulbZ));
    }
    if (cordRef.current) {
      stretch(cordRef.current, new Vector3(0, height, 0), new Vector3(0, placement.anchor[1] - placement.shadeBottom, 0));
    }

    // Light: through the fabric, down out of the bottom opening, up out of the top.
    const level = state.level;
    const bulbY = height * bulbAt;
    kelvinColor(state.kelvin, lightColor);
    uniforms.uBulb.value = bulbAt;
    outer.emissive.copy(lightColor);
    outer.emissiveIntensity = level * translucency * 1.35;
    inner.emissive.copy(lightColor).multiply(inner.color);
    inner.emissiveIntensity = level * (metalLining ? 0.55 : 0.75);
    bulbMaterial.emissive.copy(lightColor);
    bulbMaterial.emissiveIntensity = 0.2 + level * 6;
    bulbRef.current.position.set(0, bulbY, bulbZ);

    pointLightRef.current.position.set(0, bulbY, bulbZ);
    pointLightRef.current.color.copy(lightColor);
    pointLightRef.current.intensity = level * (0.12 + translucency * 1.3);
    const downAngle = Math.atan2(bottomRadius * 0.95, Math.max(0.02, bulbY));
    downLightRef.current.position.set(0, bulbY, bulbZ);
    downLightRef.current.angle = Math.min(1.35, downAngle);
    downLightRef.current.color.copy(lightColor).multiply(lightTint);
    downLightRef.current.intensity = level * 6;
    const upAngle = Math.atan2(topRadius * 0.95, Math.max(0.02, height - bulbY));
    upLightRef.current.position.set(0, bulbY, bulbZ);
    upLightRef.current.angle = Math.min(1.35, upAngle);
    upLightRef.current.color.copy(lightColor).multiply(lightTint);
    upLightRef.current.intensity = level * 3.2;

    haloSpriteRef.current.position.set(0, height * 0.5, 0);
    const haloSize = Math.max(current.bottom, current.top, height) * 2.6;
    haloSpriteRef.current.scale.set(haloSize, haloSize, 1);
    halo.color.copy(lightColor);
    halo.opacity = level * (0.04 + translucency * 0.16);
  });

  return (
    <group>
      {/* Foot, pole, canopy or wall plate */}
      {design.lamp === 'tisch' && (
        <group position={[ax, ay, az]}>
          <mesh geometry={tableFootGeometry} material={finish} castShadow receiveShadow />
        </group>
      )}
      {design.lamp === 'steh' && (
        <group position={[ax, ay, az]}>
          <mesh position={[0, 0.012, 0]} material={finish} castShadow receiveShadow>
            <cylinderGeometry args={[0.17, 0.18, 0.024, 64]} />
          </mesh>
        </group>
      )}
      {design.lamp === 'pendel' && (
        <mesh position={[ax, ay - 0.015, az]} material={finish} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.03, 48]} />
        </mesh>
      )}
      <group ref={shadeGroupRef} position={shadePosition}>
        {/* Shade: outside, lining, rims */}
        <mesh geometry={shadeGeometry} material={outer} castShadow receiveShadow />
        <mesh geometry={shadeGeometry} material={inner} />
        <mesh geometry={rimGeometries[0]} material={trimMaterial} castShadow />
        <mesh geometry={rimGeometries[1]} material={trimMaterial} castShadow />

        {/* Frame */}
        {strutRefs.map((strut, index) => (
          // eslint-disable-next-line @eslint-react/no-array-index-key -- three fixed struts
          <mesh key={index} ref={strut} material={finish}>
            <cylinderGeometry args={[0.0025, 0.0025, 1, 8]} />
          </mesh>
        ))}
        {(design.lamp === 'tisch' || design.lamp === 'steh') && (
          <mesh ref={rodRef} material={finish} castShadow>
            <cylinderGeometry
              args={[design.lamp === 'steh' ? 0.013 : 0.006, design.lamp === 'steh' ? 0.013 : 0.006, 1, 16]}
            />
          </mesh>
        )}
        {wallLamp && (
          <>
            <mesh ref={wallPlateRef} material={finish} castShadow>
              <boxGeometry args={[0.07, 0.13, 0.012]} />
            </mesh>
            <mesh ref={armOutRef} material={finish} castShadow>
              <cylinderGeometry args={[0.007, 0.007, 1, 16]} />
            </mesh>
            <mesh ref={armUpRef} material={finish} castShadow>
              <cylinderGeometry args={[0.006, 0.006, 1, 16]} />
            </mesh>
          </>
        )}
        {design.lamp === 'pendel' && (
          <mesh ref={cordRef} castShadow>
            <cylinderGeometry args={[0.003, 0.003, 1, 8]} />
            <meshStandardMaterial color="#1d1d1f" roughness={0.6} />
          </mesh>
        )}

        {/* Bulb and lights */}
        <mesh ref={bulbRef} material={bulbMaterial}>
          <sphereGeometry args={[0.03, 24, 16]} />
        </mesh>
        <pointLight ref={pointLightRef} decay={2} intensity={0} />
        <spotLight
          ref={downLightRef}
          decay={2}
          penumbra={0.55}
          intensity={0}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0004}
          shadow-normalBias={0.02}
          shadow-camera-near={0.05}
          shadow-camera-far={6}
          target={downTarget}
        />
        <primitive object={downTarget} position={[0, -1, 0]} />
        <spotLight ref={upLightRef} decay={2} penumbra={0.6} intensity={0} target={upTarget} />
        <primitive object={upTarget} position={[0, 3, 0]} />
        <sprite ref={haloSpriteRef} material={halo} renderOrder={10} />
      </group>
    </group>
  );
};
