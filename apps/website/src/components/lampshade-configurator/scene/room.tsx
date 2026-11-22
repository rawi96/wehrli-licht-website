'use client';

import type { RoomId } from '@/domain/lampshade/catalog';
import { RoundedBox } from '@react-three/drei';
import { FC, ReactNode, useMemo } from 'react';
import { BufferAttribute, BufferGeometry, MeshStandardMaterial, RepeatWrapping } from 'three';
import { BACK_WALL_Z, ROOM_LAYOUTS, SIDE_WALL_X } from './rooms';
import { floorTexture } from './textures';

type Vec3 = [number, number, number];

const useMaterial = (color: string, roughness = 0.85, metalness = 0) =>
  useMemo(() => new MeshStandardMaterial({ color, roughness, metalness }), [color, roughness, metalness]);

const Box: FC<{ size: Vec3; position: Vec3; color: string; radius?: number; roughness?: number }> = ({
  size,
  position,
  color,
  radius = 0.02,
  roughness,
}) => {
  const material = useMaterial(color, roughness);

  return (
    <RoundedBox
      args={size}
      radius={radius}
      smoothness={3}
      position={position}
      material={material}
      castShadow
      receiveShadow
    />
  );
};

const Cylinder: FC<{
  radius: number;
  height: number;
  position: Vec3;
  color: string;
  roughness?: number;
  metalness?: number;
}> = ({ radius, height, position, color, roughness, metalness }) => {
  const material = useMaterial(color, roughness, metalness);

  return (
    <mesh position={position} material={material} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, 48]} />
    </mesh>
  );
};

const Floor: FC = () => {
  const material = useMemo(() => {
    const map = floorTexture().clone();
    map.wrapS = RepeatWrapping;
    map.wrapT = RepeatWrapping;
    map.repeat.set(10 / 1.2, 10 / 1.2);

    return new MeshStandardMaterial({ map, roughness: 0.55 });
  }, []);

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0.6]} material={material} receiveShadow>
      <planeGeometry args={[10, 10]} />
    </mesh>
  );
};

const Walls: FC<{ color: string; ceiling: number | null }> = ({ color, ceiling }) => {
  const wall = useMaterial(color, 0.95);
  const white = useMaterial('#f4f2ee', 0.9);

  return (
    <>
      <mesh position={[0, 2, BACK_WALL_Z]} material={wall} receiveShadow>
        <planeGeometry args={[10, 4]} />
      </mesh>
      <mesh position={[SIDE_WALL_X, 2, 0.6]} rotation-y={Math.PI / 2} material={wall} receiveShadow>
        <planeGeometry args={[6, 4]} />
      </mesh>
      {/* Skirting boards */}
      <mesh position={[0, 0.04, BACK_WALL_Z + 0.008]} material={white} receiveShadow>
        <boxGeometry args={[10, 0.08, 0.016]} />
      </mesh>
      <mesh position={[SIDE_WALL_X + 0.008, 0.04, 0.6]} material={white} receiveShadow>
        <boxGeometry args={[0.016, 0.08, 6]} />
      </mesh>
      {ceiling !== null && (
        <mesh position={[0, ceiling, 0.6]} rotation-x={Math.PI / 2} material={white} receiveShadow>
          <planeGeometry args={[10, 6]} />
        </mesh>
      )}
    </>
  );
};

/** Window in the side wall: the daylight comes from here. */
const Window: FC<{ daylight: number }> = ({ daylight }) => {
  const glass = useMemo(() => new MeshStandardMaterial({ color: '#000000', emissive: '#cfe0f2' }), []);
  glass.emissiveIntensity = 0.15 + daylight * 1.6;
  glass.emissive.set(daylight > 0.5 ? '#d7e6f5' : '#1d2b45');

  return (
    <group position={[SIDE_WALL_X + 0.01, 1.45, -0.6]} rotation-y={Math.PI / 2}>
      <mesh material={glass}>
        <planeGeometry args={[1.3, 1.7]} />
      </mesh>
      <Box size={[1.42, 0.06, 0.06]} position={[0, 0.86, 0]} color="#f4f2ee" radius={0.005} />
      <Box size={[1.42, 0.08, 0.12]} position={[0, -0.88, 0.03]} color="#f4f2ee" radius={0.005} />
      <Box size={[0.06, 1.74, 0.06]} position={[-0.68, 0, 0]} color="#f4f2ee" radius={0.005} />
      <Box size={[0.06, 1.74, 0.06]} position={[0.68, 0, 0]} color="#f4f2ee" radius={0.005} />
      <Box size={[0.04, 1.7, 0.04]} position={[0, 0, 0]} color="#f4f2ee" radius={0.005} />
    </group>
  );
};

const Plant: FC<{ position: Vec3 }> = ({ position }) => {
  const leaves = useMaterial('#4f6b45', 0.8);

  return (
    <group position={position}>
      <Cylinder radius={0.17} height={0.42} position={[0, 0.21, 0]} color="#d8d2c8" roughness={0.6} />
      {[
        [0, 0.75, 0, 0.26],
        [0.12, 0.98, 0.05, 0.2],
        [-0.1, 1.08, -0.04, 0.18],
        [0.02, 1.25, 0.02, 0.14],
      ].map(([x, y, z, r]) => (
        <mesh key={`${x}-${y}`} position={[x, y, z]} scale={[1, 1.35, 1]} material={leaves} castShadow>
          <icosahedronGeometry args={[r, 1]} />
        </mesh>
      ))}
      <Cylinder radius={0.012} height={0.6} position={[0, 0.7, 0]} color="#5b4632" />
    </group>
  );
};

const Picture: FC<{ position: Vec3; size: [number, number]; colors: [string, string, string] }> = ({
  position,
  size,
  colors,
}) => (
  <group position={position}>
    <Box size={[size[0], size[1], 0.03]} position={[0, 0, 0]} color="#2b2b2b" radius={0.004} />
    <Box size={[size[0] - 0.06, size[1] - 0.06, 0.005]} position={[0, 0, 0.016]} color="#f3f0ea" radius={0.001} />
    <Box
      size={[size[0] * 0.5, size[1] * 0.42, 0.004]}
      position={[-size[0] * 0.08, size[1] * 0.08, 0.02]}
      color={colors[0]}
      radius={0.001}
    />
    <Box
      size={[size[0] * 0.3, size[1] * 0.3, 0.004]}
      position={[size[0] * 0.18, -size[1] * 0.12, 0.021]}
      color={colors[1]}
      radius={0.001}
    />
    <Box
      size={[size[0] * 0.2, size[1] * 0.5, 0.004]}
      position={[size[0] * 0.05, -size[1] * 0.05, 0.022]}
      color={colors[2]}
      radius={0.001}
    />
  </group>
);

const LivingRoom: FC = () => (
  <>
    {/* Rug */}
    <Box size={[2.9, 0.012, 2]} position={[0.1, 0.006, -0.9]} color="#cbbda6" radius={0.004} roughness={1} />
    {/* Sofa */}
    <group position={[0.05, 0, -1.88]}>
      <Box size={[2.25, 0.36, 0.92]} position={[0, 0.24, 0]} color="#7d8379" radius={0.05} />
      <Box size={[2.25, 0.5, 0.22]} position={[0, 0.62, -0.35]} color="#7d8379" radius={0.08} />
      <Box size={[0.22, 0.62, 0.92]} position={[-1.08, 0.31, 0]} color="#737a70" radius={0.08} />
      <Box size={[0.22, 0.62, 0.92]} position={[1.08, 0.31, 0]} color="#737a70" radius={0.08} />
      {[-0.66, 0, 0.66].map((x) => (
        <Box key={x} size={[0.64, 0.14, 0.68]} position={[x, 0.49, 0.06]} color="#868c82" radius={0.06} />
      ))}
      <Box size={[0.42, 0.38, 0.14]} position={[-0.7, 0.72, -0.18]} color="#c9a36a" radius={0.07} />
      <Box size={[0.4, 0.36, 0.14]} position={[0.75, 0.71, -0.18]} color="#e4ddd0" radius={0.07} />
      {[-1.05, 1.05].flatMap((x) =>
        [-0.38, 0.38].map((z) => (
          <Cylinder key={`${x}-${z}`} radius={0.02} height={0.06} position={[x, 0.03, z]} color="#3b2f25" />
        )),
      )}
    </group>
    {/* Coffee table */}
    <group position={[0.1, 0, -0.55]}>
      <Cylinder radius={0.48} height={0.04} position={[0, 0.4, 0]} color="#8c6a4a" roughness={0.5} />
      <Cylinder radius={0.3} height={0.38} position={[0, 0.19, 0]} color="#3d3229" roughness={0.6} />
      <Box size={[0.24, 0.035, 0.32]} position={[0.12, 0.44, 0.05]} color="#bf4b36" radius={0.004} />
      <Box size={[0.22, 0.03, 0.3]} position={[0.12, 0.47, 0.05]} color="#e9e2d4" radius={0.004} />
    </group>
    {/* Side table */}
    <group position={[1.55, 0, -1.85]}>
      <Cylinder radius={0.26} height={0.03} position={[0, 0.535, 0]} color="#3d3229" roughness={0.45} />
      <Cylinder radius={0.03} height={0.52} position={[0, 0.26, 0]} color="#3d3229" />
      <Cylinder radius={0.18} height={0.02} position={[0, 0.01, 0]} color="#3d3229" />
    </group>
    <Plant position={[-2.75, 0, -1.9]} />
    <Picture position={[0.05, 1.55, BACK_WALL_Z + 0.02]} size={[1.0, 0.7]} colors={['#c4ad88', '#214073', '#b5603d']} />
  </>
);

const DiningRoom: FC = () => (
  <>
    {/* Table */}
    <group position={[0, 0, -0.85]}>
      <Box size={[1.9, 0.045, 0.95]} position={[0, 0.755, 0]} color="#a37b55" radius={0.01} roughness={0.5} />
      {[-0.85, 0.85].flatMap((x) =>
        [-0.4, 0.4].map((z) => (
          <Box key={`${x}-${z}`} size={[0.06, 0.73, 0.06]} position={[x, 0.365, z]} color="#8f6a47" radius={0.01} />
        )),
      )}
      {/* Chairs */}
      {[-0.5, 0.5].flatMap((x) =>
        [-1, 1].map((side) => (
          <group key={`${x}-${side}`} position={[x, 0, side * 0.62]} rotation-y={side === 1 ? Math.PI : 0}>
            <Box size={[0.46, 0.05, 0.44]} position={[0, 0.46, 0]} color="#2f3134" radius={0.02} />
            <Box size={[0.46, 0.42, 0.04]} position={[0, 0.7, -0.22]} color="#2f3134" radius={0.02} />
            {[-0.2, 0.2].flatMap((lx) =>
              [-0.19, 0.19].map((lz) => (
                <Cylinder key={`${lx}-${lz}`} radius={0.016} height={0.45} position={[lx, 0.225, lz]} color="#2f3134" />
              )),
            )}
          </group>
        )),
      )}
      <mesh position={[-0.2, 0.84, 0]} castShadow>
        <sphereGeometry args={[0.08, 32, 16]} />
        <meshStandardMaterial color="#e7e1d6" roughness={0.3} />
      </mesh>
      <Cylinder radius={0.13} height={0.04} position={[0.3, 0.8, 0.05]} color="#d9d3c8" roughness={0.3} />
    </group>
    {/* Sideboard */}
    <group position={[0, 0, -2.12]}>
      <Box size={[1.9, 0.62, 0.46]} position={[0, 0.47, 0]} color="#ece7de" radius={0.015} roughness={0.6} />
      <Box size={[1.9, 0.03, 0.46]} position={[0, 0.79, 0]} color="#a37b55" radius={0.006} roughness={0.5} />
      {[-0.85, 0.85].map((x) => (
        <Cylinder key={x} radius={0.018} height={0.16} position={[x, 0.08, 0]} color="#3b2f25" />
      ))}
    </group>
    <Plant position={[2.5, 0, -1.95]} />
    <Picture position={[-0.4, 1.6, BACK_WALL_Z + 0.02]} size={[0.8, 0.6]} colors={['#98a98c', '#c8982c', '#34373c']} />
  </>
);

const Bedroom: FC = () => (
  <>
    <Box size={[3, 0.012, 2.1]} position={[0, 0.006, -1.1]} color="#d8cfc4" radius={0.004} roughness={1} />
    <group position={[0, 0, -1.3]}>
      <Box size={[1.72, 0.28, 2.12]} position={[0, 0.17, 0]} color="#b9a58e" radius={0.03} />
      <Box size={[1.62, 0.22, 2.02]} position={[0, 0.42, 0]} color="#f4f1ec" radius={0.06} />
      <Box size={[1.66, 0.09, 1.45]} position={[0, 0.56, 0.3]} color="#9eaab3" radius={0.04} />
      <Box size={[0.62, 0.15, 0.4]} position={[-0.38, 0.6, -0.78]} color="#ffffff" radius={0.06} />
      <Box size={[0.62, 0.15, 0.4]} position={[0.38, 0.6, -0.78]} color="#ffffff" radius={0.06} />
      <Box size={[1.86, 1.05, 0.09]} position={[0, 0.52, -1.06]} color="#a8927a" radius={0.04} />
    </group>
    {[-1.25, 1.25].map((x) => (
      <group key={x} position={[x, 0, -2.08]}>
        <Box size={[0.5, 0.48, 0.4]} position={[0, 0.27, 0]} color="#a37b55" radius={0.015} roughness={0.55} />
        <Box size={[0.46, 0.005, 0.005]} position={[0, 0.3, 0.2]} color="#3b2f25" radius={0.001} />
      </group>
    ))}
    <Picture position={[0, 1.65, BACK_WALL_Z + 0.02]} size={[1.2, 0.5]} colors={['#d3a29c', '#1b2438', '#c4ad88']} />
  </>
);

/** Seamless backdrop of a photo studio: the floor bends up into the wall. */
const Backdrop: FC<{ color: string }> = ({ color }) => {
  const material = useMaterial(color, 0.95);
  const geometry = useMemo(() => {
    const profile: [number, number][] = [];
    const radius = 1.2;
    const wallZ = BACK_WALL_Z;
    profile.push([4, 0]);
    for (let step = 0; step <= 16; step += 1) {
      const angle = (step / 16) * (Math.PI / 2);
      profile.push([wallZ + radius - Math.sin(angle) * radius, radius - Math.cos(angle) * radius]);
    }
    profile.push([wallZ, 5]);
    const width = 14;
    const positions: number[] = [];
    const index: number[] = [];
    profile.forEach(([z, y], i) => {
      positions.push(-width / 2, y, z, width / 2, y, z);
      if (i > 0) {
        const a = (i - 1) * 2;
        index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    });
    const result = new BufferGeometry();
    result.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
    result.setIndex(index);
    result.computeVertexNormals();

    return result;
  }, []);

  return <mesh geometry={geometry} material={material} receiveShadow />;
};

const Atelier: FC = () => (
  <>
    <Backdrop color="#e9e6e1" />
    {/* Plinth for table lamps */}
    <Cylinder radius={0.32} height={0.72} position={[0, 0.36, -0.9]} color="#f1efeb" roughness={0.7} />
  </>
);

type Props = { room: RoomId; daylight: number; showPlinth: boolean };

export const Room: FC<Props> = ({ room, daylight, showPlinth }) => {
  const layout = ROOM_LAYOUTS[room];
  let furniture: ReactNode;
  switch (room) {
    case 'wohnen':
      furniture = <LivingRoom />;
      break;
    case 'essen':
      furniture = <DiningRoom />;
      break;
    case 'schlafen':
      furniture = <Bedroom />;
      break;
    default:
      furniture = showPlinth ? <Atelier /> : <Backdrop color={layout.wall} />;
  }

  return (
    <>
      {room !== 'atelier' && (
        <>
          <Floor />
          <Walls color={layout.wall} ceiling={layout.ceiling} />
          <Window daylight={daylight} />
        </>
      )}
      {furniture}
    </>
  );
};
