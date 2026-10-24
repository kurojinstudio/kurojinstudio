"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const MAX_TRAIL_LENGTH = 42;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float iTime;
  uniform vec3 iResolution;
  uniform vec2 iMouse;
  uniform vec2 iPrevMouse[MAX_TRAIL_LENGTH];
  uniform float iOpacity;
  uniform float iScale;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f *= f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rotation = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = rotation * p * 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  float blob(vec2 position, vec2 mousePosition, float intensity) {
    vec2 q = vec2(fbm(position * iScale + iTime * 0.1), fbm(position * iScale + vec2(5.2, 1.3) + iTime * 0.1));
    vec2 distortion = vec2(fbm(position * iScale + q * 1.5 + iTime * 0.15), fbm(position * iScale + q * 1.5 + vec2(8.3, 2.8) + iTime * 0.15));
    float smoke = fbm(position * iScale + distortion * 0.8);
    float radius = 0.5 + 0.3 * (1.0 / iScale);
    float distanceFactor = 1.0 - smoothstep(0.0, radius, length(position - mousePosition));
    float alpha = pow(smoke, 2.5) * distanceFactor * intensity;
    return alpha;
  }
  void main() {
    vec2 aspect = vec2(iResolution.x / iResolution.y, 1.0);
    vec2 position = (gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0) * aspect;
    vec2 mouse = (iMouse * 2.0 - 1.0) * aspect;
    float reveal = blob(position, mouse, 1.0);
    for (int i = 0; i < MAX_TRAIL_LENGTH; i++) {
      vec2 previousMouse = (iPrevMouse[i] * 2.0 - 1.0) * aspect;
      float trailStrength = pow(1.0 - float(i) / float(MAX_TRAIL_LENGTH), 2.0);
      if (trailStrength > 0.01) {
        reveal += blob(position, previousMouse, trailStrength * 0.8);
      }
    }

    // The canvas is the black veil. The fluid trail subtracts from its alpha.
    float revealAlpha = clamp(reveal * iOpacity * 0.72, 0.0, 0.96);
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0 - revealAlpha);
  }
`;

export interface HalftoneRevealProps {
  className?: string;
  style?: CSSProperties;
  borderRadius?: string;
}

const HalftoneReveal = ({
  className = "",
  style,
  borderRadius = "16px",
}: HalftoneRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const filmGrainShader = useMemo(
    () => ({
      uniforms: { tDiffuse: { value: null }, iTime: { value: 0 }, intensity: { value: 0.035 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform sampler2D tDiffuse; uniform float iTime; uniform float intensity; varying vec2 vUv; float hash(float value) { return fract(sin(value) * 43758.5453); } void main() { vec4 color = texture2D(tDiffuse, vUv); float grain = hash(vUv.x * 1000.0 + vUv.y * 2000.0 + iTime) * 2.0 - 1.0; color.rgb += grain * intensity * color.rgb; gl_FragColor = color; }`,
    }),
    []
  );

    useEffect(() => {
      const host = containerRef.current;
      const parent = host?.parentElement;
      if (!host || !parent) return;

      let active = true;
      let animationFrame = 0;
      const previousPosition = parent.style.position;
      if (!previousPosition || previousPosition === "static") parent.style.position = "relative";

      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
      if (isMobileViewport) return;

      const renderer = new THREE.WebGLRenderer({
        antialias: !isTouch,
        alpha: true,
        depth: false,
        stencil: false,
        powerPreference: isTouch ? "low-power" : "high-performance",
        premultipliedAlpha: false,
      });
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.cssText = "display:block;width:100%;height:100%;pointer-events:none";
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const geometry = new THREE.PlaneGeometry(2, 2);
      const trailLength = isTouch ? 12 : MAX_TRAIL_LENGTH;
      const trail = Array.from({ length: trailLength }, () => new THREE.Vector2(0.5, 0.5));
      const mouse = new THREE.Vector2(0.5, 0.5);
      const currentMouse = new THREE.Vector2(0.5, 0.5);
      const material = new THREE.ShaderMaterial({
        defines: { MAX_TRAIL_LENGTH: trailLength },
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector3(1, 1, 1) },
          iMouse: { value: mouse.clone() },
          iPrevMouse: { value: trail },
          iOpacity: { value: 0 },
          iScale: { value: 1 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });
      scene.add(new THREE.Mesh(geometry, material));

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), isTouch ? 0 : 0.08, 0.5, 0.12));
      const filmPass = new ShaderPass(filmGrainShader);
      composer.addPass(filmPass);

      let pointerActive = false;
      let lastMove = performance.now();
      let opacity = 0;

      const resize = () => {
        const rect = host.getBoundingClientRect();
        const pixelRatio = Math.min(window.devicePixelRatio || 1, isTouch ? 0.45 : 0.85);
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(width, height, false);
        composer.setPixelRatio(pixelRatio);
        composer.setSize(width, height);
        material.uniforms.iResolution.value.set(width * pixelRatio, height * pixelRatio, 1);
        material.uniforms.iScale.value = Math.max(0.65, Math.min(1.8, Math.min(width, height) / 600));
      };

      const onPointerMove = (event: PointerEvent) => {
        const rect = parent.getBoundingClientRect();
        const inside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        if (!inside) {
          pointerActive = false;
          lastMove = performance.now();
          return;
        }

        currentMouse.set(
          THREE.MathUtils.clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1),
          THREE.MathUtils.clamp(1 - (event.clientY - rect.top) / Math.max(1, rect.height), 0, 1)
        );
        pointerActive = true;
        lastMove = performance.now();
      };
      const onPointerDown = (event: PointerEvent) => {
        onPointerMove(event);
      };
      const onPointerUp = () => {
        pointerActive = false;
        lastMove = performance.now();
      };
      const onWindowBlur = () => {
        pointerActive = false;
        lastMove = performance.now();
      };

      const animate = (now: number) => {
        if (!active) return;
        const elapsed = now / 1000;
        if (pointerActive) {
          mouse.lerp(currentMouse, 0.18);
          opacity += (1 - opacity) * 0.12;
        } else {
          opacity += (0 - opacity) * 0.035;
          if (now - lastMove > 900) opacity = Math.max(0, opacity - 0.01);
        }
        const head = trail.pop();
        if (head) {
          head.copy(mouse);
          trail.unshift(head);
        }
        material.uniforms.iTime.value = elapsed;
        material.uniforms.iOpacity.value = opacity;
        filmPass.uniforms.iTime.value = elapsed;
        composer.render();
        animationFrame = requestAnimationFrame(animate);
      };

      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(parent);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      window.addEventListener("pointerup", onPointerUp, { passive: true });
      window.addEventListener("blur", onWindowBlur);
      animationFrame = requestAnimationFrame(animate);

      return () => {
        active = false;
        cancelAnimationFrame(animationFrame);
        resizeObserver.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("blur", onWindowBlur);
        geometry.dispose();
        material.dispose();
        composer.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
        if (!previousPosition || previousPosition === "static") parent.style.position = previousPosition;
      };
    }, [filmGrainShader]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-10 pointer-events-none overflow-hidden touch-none cursor-none ${className}`.trim()}
      style={{ borderRadius, ...style }}
    >
    </div>
  );
};

export default HalftoneReveal;

