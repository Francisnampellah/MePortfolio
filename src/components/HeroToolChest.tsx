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
  Texture,
  type Object3D,
} from "three";
import { HeroModelWait } from "./HeroModelWait";

const MODEL_URL = "/models/alarm_clock/alarm_clock_4k.gltf";
const FOV = 40;
/** Padding around the bounding sphere. 1.43 ≈ 20% larger than the prior 1.72 framing. */
const FIT_MARGIN = 1.43;
const ACCENT_FALLBACK = "#c2613f";

/** Shift the whole model container in layout — not the 3D scene origin. */
const CONTAINER_SHIFT = "translate(-12%, -10%)"; // little left, 10% up

const WAIT_LINES = [
  "Winding the spring…",
  "Setting the hands…",
  "Polishing the glass…",
  "Almost ready. Hang tight.",
];

function readAccentHex(): string {
  if (typeof window === "undefined") return ACCENT_FALLBACK;
  const v = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  return v || ACCENT_FALLBACK;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hh = ((h % 360) + 360) % 360 / 360;
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let T = t;
    if (T < 0) T += 1;
    if (T > 1) T -= 1;
    if (T < 1 / 6) return p + (q - p) * 6 * T;
    if (T < 1 / 2) return q;
    if (T < 2 / 3) return p + (q - p) * (2 / 3 - T) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, hh + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, hh) * 255),
    Math.round(hue2rgb(p, q, hh - 1 / 3) * 255),
  ];
}

/** True for the pale teal / aqua body paint — leave dial, metal, and red alone. */
function isTealBodyPixel(h: number, s: number, l: number): boolean {
  return s > 0.1 && l > 0.18 && l < 0.88 && h >= 135 && h <= 210;
}

/**
 * Remap teal body paint in the diffuse map to the site accent, keeping
 * luminance so shading still reads correctly.
 */
function recolorTealMapToAccent(map: Texture, accentHex: string): Texture {
  const img = map.image as CanvasImageSource | undefined;
  if (!img || typeof document === "undefined") return map;

  const width = "width" in img ? Number(img.width) : 0;
  const height = "height" in img ? Number(img.height) : 0;
  if (!width || !height) return map;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return map;

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;
  const [ar, ag, ab] = hexToRgb(accentHex);
  const [accentH, accentS] = rgbToHsl(ar, ag, ab);

  for (let i = 0; i < data.length; i += 4) {
    const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
    if (!isTealBodyPixel(h, s, l)) continue;
    const [nr, ng, nb] = hslToRgb(accentH, Math.min(0.75, Math.max(s, accentS * 0.65)), l);
    data[i] = nr;
    data[i + 1] = ng;
    data[i + 2] = nb;
  }

  ctx.putImageData(imageData, 0, 0);
  const next = map.clone();
  next.image = canvas;
  next.colorSpace = map.colorSpace;
  next.flipY = map.flipY;
  next.needsUpdate = true;
  return next;
}

function recolorClockBody(root: Object3D, accentHex: string) {
  const remapped = new WeakMap<Texture, Texture>();

  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of mats) {
      if (!(mat instanceof MeshStandardMaterial)) continue;
      if (/glass/i.test(mat.name)) continue;
      if (!mat.map) continue;

      let tinted = remapped.get(mat.map);
      if (!tinted) {
        tinted = recolorTealMapToAccent(mat.map, accentHex);
        remapped.set(mat.map, tinted);
      }
      mat.map = tinted;
      mat.needsUpdate = true;
    }
  });
}

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
    recolorClockBody(c, readAccentHex());
    return c;
  }, [scene]);
  const [shadowY, setShadowY] = useState(-0.4);
  const readySent = useRef(false);

  useLayoutEffect(() => {
    const box = new Box3().setFromObject(clone);
    const sphere = new Sphere();
    box.getBoundingSphere(sphere);

    // Center only — layout shift is handled by the container CSS.
    clone.position.sub(sphere.center);

    const after = new Box3().setFromObject(clone);
    setShadowY(after.min.y - 0.02);

    const aspect = size.width / Math.max(size.height, 1);
    const vFov = (FOV * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const distV = sphere.radius / Math.tan(vFov / 2);
    const distH = sphere.radius / Math.tan(hFov / 2);
    const distance = Math.max(distV, distH) * FIT_MARGIN;

    camera.position.set(distance * 0.18, distance * 0.14, distance);
    camera.near = Math.max(0.01, distance / 100);
    camera.far = distance * 40;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

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
          transform: CONTAINER_SHIFT,
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
        style={{ transform: CONTAINER_SHIFT }}
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
        <p className="pointer-events-none -mt-2 text-center font-mono text-[11px] tracking-[0.04em] text-muted2">
        A Product Like <span className="text-accent">An Alarm Clock</span>
        </p>
      </div>
    </div>
  );
}
