"use client";

import { Suspense, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF, ContactShadows } from "@react-three/drei";
import { Box3, Group, Sphere } from "three";

const MODEL_URL = "/models/alarm_clock/alarm_clock_2k.gltf";
const FOV = 38;
/** Extra room so corners never clip while spinning. */
const FIT_MARGIN = 1.55;

function AlarmClock() {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const clone = useMemo(() => scene.clone(true), [scene]);
  const [shadowY, setShadowY] = useState(-0.4);

  useLayoutEffect(() => {
    const box = new Box3().setFromObject(clone);
    const sphere = new Sphere();
    box.getBoundingSphere(sphere);

    // Center the model on the origin so rotation stays in place.
    clone.position.sub(sphere.center);

    const after = new Box3().setFromObject(clone);
    setShadowY(after.min.y - 0.02);

    // Frame for the full bounding sphere (covers every rotation angle).
    const aspect = size.width / Math.max(size.height, 1);
    const vFov = (FOV * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const distV = sphere.radius / Math.tan(vFov / 2);
    const distH = sphere.radius / Math.tan(hFov / 2);
    const distance = Math.max(distV, distH) * FIT_MARGIN;

    camera.position.set(distance * 0.35, distance * 0.28, distance);
    camera.near = distance / 100;
    camera.far = distance * 20;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [clone, camera, size.width, size.height]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.4;
  });

  return (
    <>
      <group ref={group}>
        <primitive object={clone} />
      </group>
      <ContactShadows
        position={[0, shadowY, 0]}
        opacity={0.32}
        scale={Math.max(4, shadowY * -8)}
        blur={2.6}
        far={4}
      />
    </>
  );
}

useGLTF.preload(MODEL_URL);

/** Rotating hero 3D model (alarm clock). Kept export name for Hero import stability. */
export function HeroToolChest() {
  return (
    <div className="relative mx-auto aspect-square h-auto w-full max-w-[560px] lg:mx-0 lg:ml-auto lg:max-w-none lg:w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(45% 45% at 60% 35%, rgba(194,97,63,.28), transparent 70%)",
        }}
      />
      <Canvas
        camera={{ fov: FOV, position: [1.2, 0.9, 3.2], near: 0.01, far: 100 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 3]} intensity={1.35} />
        <directionalLight position={[-3, 2, -2]} intensity={0.35} />
        <Suspense fallback={null}>
          <AlarmClock />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
