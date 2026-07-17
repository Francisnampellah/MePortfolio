"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF, useProgress } from "@react-three/drei";
import {
  Box3,
  Group,
  Mesh,
  MeshStandardMaterial,
  Sphere,
  type Object3D,
} from "three";
import { HeroModelWait } from "./HeroModelWait";

const MODEL_URL = "/models/alarm_clock/alarm_clock_4k.gltf";
const FOV = 40;
/** Padding around the bounding sphere. 1.43 ≈ 20% larger than the prior 1.72 framing. */
const FIT_MARGIN = 1.43;
/** Nudge the model as a fraction of its radius. */
const LIFT_RATIO = 0.20; // 10% up
const LEFT_RATIO = 0.20; // 15% left

const WAIT_LINES = [
  "Winding the spring…",
  "Setting the hands…",
  "Polishing the glass…",
  "Almost ready. Hang tight.",
];

/**
 * Keep the glass cover, but keep it simple and clear.
 * Transmission glass can look "zoomed"/empty over the dial in this setup.
 */
function fixClockGlass(root: Object3D) {
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of mats) {
      if (!(mat instanceof MeshStandardMaterial)) continue;
      if (!/glass/i.test(mat.name)) continue;

      mat.map = null;
      mat.normalMap = null;
      mat.metalnessMap = null;
      mat.roughnessMap = null;
      mat.color.set("#ffffff");
      mat.metalness = 0;
      mat.roughness = 0.12;
      mat.transparent = true;
      mat.opacity = 0.22;
      mat.depthWrite = false;
      mat.envMapIntensity = 0.9;
      mat.needsUpdate = true;
    }
  });
}

function AlarmClock({ onReady }: { onReady: () => void }) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const clone = useMemo(() => {
    const c = scene.clone(true);
    fixClockGlass(c);
    return c;
  }, [scene]);
  const [shadowY, setShadowY] = useState(-0.4);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const readySent = useRef(false);

  useLayoutEffect(() => {
    const box = new Box3().setFromObject(clone);
    const sphere = new Sphere();
    box.getBoundingSphere(sphere);

    clone.position.sub(sphere.center);

    const after = new Box3().setFromObject(clone);
    const lift = sphere.radius * LIFT_RATIO;
    const left = -sphere.radius * LEFT_RATIO;
    setShadowY(after.min.y - 0.02 + lift);
    setOffset({ x: left, y: lift });

    const aspect = size.width / Math.max(size.height, 1);
    const vFov = (FOV * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const distV = sphere.radius / Math.tan(vFov / 2);
    const distH = sphere.radius / Math.tan(hFov / 2);
    const distance = Math.max(distV, distH) * FIT_MARGIN;

    // Front-biased camera so the dial faces the visitor.
    camera.position.set(distance * 0.18 + left, distance * 0.14 + lift, distance);
    camera.near = Math.max(0.01, distance / 100);
    camera.far = distance * 40;
    camera.lookAt(left, lift, 0);
    camera.updateProjectionMatrix();

    if (group.current) {
      group.current.position.set(left, lift, 0);
      group.current.rotation.y = 0.15;
    }

    if (!readySent.current) {
      readySent.current = true;
      requestAnimationFrame(() => onReady());
    }
  }, [clone, camera, size.width, size.height, onReady]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.4;
  });

  return (
    <>
      <group ref={group}>
        <primitive object={clone} />
      </group>
      <ContactShadows
        position={[offset.x, shadowY, 0]}
        opacity={0.32}
        scale={Math.max(4, shadowY * -8)}
        blur={2.6}
        far={4}
      />
    </>
  );
}

useGLTF.preload(MODEL_URL);

function ProgressBridge({ onProgress }: { onProgress: (n: number) => void }) {
  const { progress } = useProgress();
  useEffect(() => {
    onProgress(progress);
  }, [progress, onProgress]);
  return null;
}

/** Rotating hero 3D model (alarm clock). Kept export name for Hero import stability. */
export function HeroToolChest() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    if (ready) return;
    const id = setInterval(() => setLineIdx((i) => (i + 1) % WAIT_LINES.length), 2200);
    return () => clearInterval(id);
  }, [ready]);

  return (
    <div className="relative mx-auto aspect-square h-auto w-full max-w-[560px] overflow-visible lg:mx-0 lg:ml-auto lg:max-w-none lg:w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(45% 45% at 60% 35%, rgba(194,97,63,.28), transparent 70%)",
        }}
      />

      <div
        aria-live="polite"
        aria-busy={!ready}
        className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-500 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      >
        <HeroModelWait progress={progress} message={WAIT_LINES[lineIdx]} />
      </div>

      <div
        className={`h-full w-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
      >
        <Canvas
          camera={{ fov: FOV, position: [1.2, 0.9, 3.2], near: 0.01, far: 100 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 4, 5]} intensity={1.6} />
          <directionalLight position={[-3, 2, -2]} intensity={0.4} />
          <ProgressBridge onProgress={setProgress} />
          <Suspense fallback={null}>
            <AlarmClock onReady={() => setReady(true)} />
            <Environment preset="apartment" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
