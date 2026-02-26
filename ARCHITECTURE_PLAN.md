# NCQ Platform — 3D Scroll Experience: Complete Architecture Plan

> **Document Type:** Architecture Blueprint (no implementation)
> **Target:** Replicate Hut 8 "Our Platform" scroll-driven 3D experience
> **Products:** ERP, IoT Platform, Blockchain Solutions, Quantum Computing, AI Tools & Agents

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [File System Structure](#2-file-system-structure)
3. [Layer Architecture](#3-layer-architecture)
4. [Camera Path System](#4-camera-path-system)
5. [Scroll Synchronization Flow](#5-scroll-synchronization-flow)
6. [Section Content (NCQ Products)](#6-section-content-ncq-products)
7. [3D Object Specifications](#7-3d-object-specifications)
8. [Post-Processing Pipeline](#8-post-processing-pipeline)
9. [Color Palette](#9-color-palette)
10. [Imports Map (Per File)](#10-imports-map-per-file)
11. [App.tsx Route Change](#11-apptsx-route-change)
12. [Vite Config Changes](#12-vite-config-changes)
13. [Performance Budget](#13-performance-budget)
14. [Mobile & Accessibility Strategy](#14-mobile--accessibility-strategy)
15. [Implementation Order (Build Sequence)](#15-implementation-order-build-sequence)
16. [Reverse Engineering Analysis](#16-reverse-engineering-analysis)
17. [Verification Checklist](#17-verification-checklist)

---

## 1. Technology Stack

### Core Framework (Already in Repo)

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.2.0 | UI framework |
| `react-dom` | ^18.2.0 | DOM rendering |
| `react-router-dom` | ^6.20.1 | Client-side routing |
| `vite` | ^5.0.8 | Build tool & dev server |
| `typescript` | ^5.2.2 | Type safety |
| `tailwindcss` | ^3.3.6 | Utility CSS |
| `framer-motion` | ^10.16.16 | Basic React animations |
| `zustand` | ^4.4.7 | State management |

### New Dependencies to Install

#### 3D Engine

| Package | Version | Purpose |
|---------|---------|---------|
| `three` | ^0.170.0 | WebGL 3D rendering engine |
| `@react-three/fiber` | ^8.17.0 | React renderer for Three.js (R3F) |
| `@react-three/drei` | ^9.114.0 | Helpers: Float, MeshDistortMaterial, Text, Environment, useProgress |
| `@react-three/postprocessing` | ^2.16.0 | Bloom, Vignette, ChromaticAberration, ToneMapping |
| `@types/three` | ^0.170.0 | TypeScript types for Three.js |

#### Animation & Scroll

| Package | Version | Purpose |
|---------|---------|---------|
| `gsap` | ^3.12.5 | Timeline animation engine |
| `@studio-freight/lenis` | ^1.0.42 | Smooth scroll with damping/momentum |

> **Note:** GSAP ScrollTrigger is included with `gsap` — import from `gsap/ScrollTrigger`.

#### Optional / Nice-to-Have (Dev Tools)

| Package | Version | Purpose |
|---------|---------|---------|
| `leva` | ^0.9.35 | Dev-only GUI to tweak 3D params in real-time |
| `r3f-perf` | ^7.2.1 | Dev-only FPS/draw-call monitor |
| `theatre` | ^0.7.2 | Visual keyframe editor for camera paths |

### BabylonJS Decision

| Package | Action |
|---------|--------|
| `@babylonjs/core` | **Keep** — still used by Building3D.tsx and SmartBuildings.tsx |
| `@babylonjs/gui` | **Keep** |
| `@babylonjs/loaders` | **Keep** |
| `@babylonjs/materials` | **Keep** |

> The two engines coexist — they render to separate canvases on different routes.

### Install Command

```bash
cd ncq-platform/frontend/user-portal

npm install three @react-three/fiber @react-three/drei @react-three/postprocessing gsap @studio-freight/lenis

npm install -D @types/three
```

---

## 2. File System Structure

```
ncq-platform/frontend/user-portal/src/
│
├── pages/
│   └── PlatformLanding.tsx              # REWRITE — orchestrates the full experience
│
├── components/
│   └── platform/                        # NEW DIRECTORY — all 3D scroll components
│       │
│       ├── index.ts                     # Barrel exports
│       │
│       │── ── 3D SCENE ── ──
│       ├── PlatformCanvas.tsx           # R3F <Canvas> wrapper + post-processing
│       ├── CameraRig.tsx                # CatmullRomCurve3 path + scroll-driven position
│       ├── SceneLighting.tsx            # Ambient, Directional, Point, Spot lights
│       ├── SceneEnvironment.tsx         # Fog, dark environment map, tone mapping
│       │
│       │── ── 3D OBJECTS ── ──
│       ├── FloorGrid.tsx               # Infinite grid with animated shader lines
│       ├── ServerCluster.tsx            # InstancedMesh server racks (ERP/IoT visualization)
│       ├── DataNodes.tsx                # Glowing spheres + connecting cables (Blockchain)
│       ├── QuantumCore.tsx              # Animated quantum computing visualization
│       ├── AIBrain.tsx                  # Neural network mesh / AI brain visualization
│       ├── ParticleField.tsx            # Points geometry with custom vertex shader
│       ├── ConnectionCables.tsx         # TubeGeometry following spline paths between nodes
│       │
│       │── ── SCROLL & UI ── ──
│       ├── ScrollManager.tsx            # Lenis smooth scroll + GSAP ScrollTrigger setup
│       ├── ScrollSections.tsx           # Pinned sections with start/end triggers
│       ├── SectionOverlay.tsx           # Individual HTML overlay (title, description, stats)
│       ├── HeroSection.tsx              # Full-viewport hero with animated text + metrics
│       ├── MetricCounter.tsx            # Animated number counter component
│       ├── ProgressIndicator.tsx        # Visual scroll progress bar
│       ├── PlatformNav.tsx              # Floating navigation bar
│       ├── ProductGrid.tsx              # Bottom section: product cards with links
│       │
│       │── ── UTILITIES ── ──
│       ├── LoadingScreen.tsx            # Preloader with progress bar (useProgress from drei)
│       ├── useScrollProgress.ts         # Custom hook: returns normalized 0→1 scroll value
│       ├── useSectionTrigger.ts         # Custom hook: GSAP ScrollTrigger for a section
│       ├── useReducedMotion.ts          # Custom hook: prefers-reduced-motion detection
│       ├── constants.ts                 # Camera keyframes, section configs, color palette
│       └── shaders/                     # GLSL shader files
│           ├── gridFloor.vert           # Floor grid vertex shader
│           ├── gridFloor.frag           # Floor grid fragment shader
│           ├── particleField.vert       # Particle vertex shader
│           └── particleField.frag       # Particle fragment shader
│
├── App.tsx                              # MODIFY — remove Layout wrapper from /platform
└── ...
```

**Total new files: ~25**
**Files modified: 2** (PlatformLanding.tsx rewrite, App.tsx route change)

---

## 3. Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 0: WebGL Canvas (position: fixed, inset: 0, z-index: 0) │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  <Canvas>  (React Three Fiber)                            │  │
│  │    ├── <CameraRig />        — camera on spline path       │  │
│  │    ├── <SceneLighting />    — ambient + directional + pts │  │
│  │    ├── <SceneEnvironment /> — fog + env map               │  │
│  │    ├── <FloorGrid />        — shader-based grid           │  │
│  │    ├── <ServerCluster />    — InstancedMesh x 500         │  │
│  │    ├── <DataNodes />        — blockchain visualization    │  │
│  │    ├── <QuantumCore />      — animated quantum structure  │  │
│  │    ├── <AIBrain />          — neural network mesh         │  │
│  │    ├── <ConnectionCables /> — TubeGeometry paths          │  │
│  │    ├── <ParticleField />    — floating particles          │  │
│  │    └── <PostProcessing />   — bloom + vignette + tone     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: HTML Overlays (position: fixed, z-index: 10)          │
│    ├── <PlatformNav />         — floating top nav              │
│    ├── <ProgressIndicator />   — scroll progress bar           │
│    └── <SectionOverlay />      — text/stats for active section │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2: Scroll Container (position: relative, z-index: 20)   │
│    ├── height: 600vh           — creates scroll distance       │
│    ├── <ScrollManager />       — Lenis + ScrollTrigger init    │
│    ├── Section trigger zones   — invisible divs for pinning    │
│    └── <ProductGrid />         — visible HTML at bottom        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Camera Path System

### Keyframe Definitions (constants.ts)

5 camera positions corresponding to 5 scroll sections:

| Section | Progress | Camera Position (x,y,z) | LookAt Target (x,y,z) | What's Visible |
|---------|----------|------------------------|----------------------|----------------|
| Hero | 0.00 | (-30, 15, 40) | (0, 0, 0) | Wide overview, particles, grid |
| ERP & IoT | 0.20 | (-5, 8, 20) | (5, 3, 0) | Server cluster reveals |
| Blockchain | 0.45 | (10, 5, 10) | (10, 5, -5) | Data nodes + cables animate in |
| Quantum | 0.70 | (0, 3, 5) | (-5, 5, -10) | Quantum core pulses |
| AI & Overview | 0.90 | (-15, 12, 30) | (0, 5, 0) | AI brain + full scene visible |

### Spline Construction

```
THREE.CatmullRomCurve3([
  new Vector3(-30, 15, 40),   // Hero — far overview
  new Vector3(-5, 8, 20),     // ERP — mid approach
  new Vector3(10, 5, 10),     // Blockchain — side view
  new Vector3(0, 3, 5),       // Quantum — close up
  new Vector3(-15, 12, 30),   // AI — pull back overview
])
```

Camera smoothly interpolates along this curve. LookAt targets use a **separate** `CatmullRomCurve3` for independent interpolation.

### How Camera Movement Works

```
                    CAMERA PATH ARCHITECTURE

     Scroll: 0%                              Scroll: 100%
        |                                        |
        v                                        v
    ----P0----------P1----------P2----------P3----  <-- CatmullRomCurve3

    Each point has:
    - position (x, y, z)
    - lookAt target (x, y, z)
    - optional: FOV, rotation quaternion
```

- A predefined camera path (CatmullRom spline) is created in 3D space
- As you scroll, `scrollY / maxScroll` gives a normalized progress value (0 to 1)
- That progress value interpolates the camera's position AND rotation along the path
- `camera.position.copy(path.getPointAt(progress))`
- `camera.lookAt(targetPath.getPointAt(progress))`

---

## 5. Scroll Synchronization Flow

```
USER SCROLLS (wheel / touch / keyboard)
         |
         v
+------------------------------+
|  LENIS captures scroll event |
|  Applies damping (0.08)      |
|  Smooth interpolation        |
+------------------------------+
         |
         v
+------------------------------+
|  GSAP ScrollTrigger          |
|  Maps scroll to progress     |
|  Pins sections as needed     |
|  Fires onUpdate callbacks    |
+------------------------------+
         |
    +----+------------+
    v    v            v
 Camera  Objects    UI/Text
  Path   Reveals    Overlays
  (R3F)  (R3F)     (React DOM)
    |    |            |
    +----+------------+
         v
  requestAnimationFrame
     Render Frame
```

### Shared State: useScrollProgress Hook

A **Zustand store** that holds `progress: number` (0 to 1), updated by GSAP ScrollTrigger's `onUpdate`. Both the R3F scene (via `useFrame`) and HTML overlays read from this single source of truth.

### Damping Mathematics

```
Damping factor = 0.08
Each frame: scrollCurrent += (scrollTarget - scrollCurrent) * 0.08

Frame 1: moves 8% of remaining distance
Frame 2: moves 8% of NEW remaining distance
Frame 3: moves 8% of NEW remaining distance
... asymptotically approaches target

This creates the smooth, "weighty" feel to all motion.
```

### Virtual Scroll Pattern

```
USER SCROLLS WHEEL
    |
    v
preventDefault() — STOP NATIVE SCROLL
    |
    v
UPDATE scrollTarget += deltaY * sensitivity
    |
    v
CLAMP scrollTarget (0 to maxScroll)
    |
    v
DAMPING: scrollCurrent lerps to scrollTarget
    |
    v
NORMALIZE: progress = scrollCurrent / maxScroll (0.0 to 1.0)
    |
    +-------+----------+
    v       v          v
 CAMERA   3D OBJECTS   HTML/UI
```

---

## 6. Section Content (NCQ Products)

### Section 1: Hero

- **Title:** "NCQ Platform"
- **Subtitle:** "Enterprise SaaS. Infinite Scale."
- **Metrics:** 9+ Products | 10M+ API Calls | 99.99% Uptime | 25+ Countries
- **3D:** Wide overview — particles floating, grid visible, all objects at distance

### Section 2: ERP & IoT (Innovate)

- **Title:** "Enterprise Infrastructure"
- **Description:** "ERP systems and IoT platforms that power real-time operations across your organization."
- **3D:** Server cluster InstancedMesh reveals (500 racks stagger in), green LED glows
- **Stats:** 1,200+ Sensors | 50TB Daily Data | <10ms Latency

### Section 3: Blockchain (Integrate)

- **Title:** "Blockchain Solutions"
- **Description:** "Distributed ledger technology for secure, transparent, and immutable transactions."
- **3D:** Data nodes (glowing spheres) appear, TubeGeometry cables animate connecting them
- **Stats:** 10K+ TPS | 256-bit Encryption | Smart Contracts

### Section 4: Quantum Computing (Compute)

- **Title:** "Quantum Computing"
- **Description:** "Next-generation computational power for optimization, simulation, and cryptography."
- **3D:** Quantum core structure pulses, orbiting particles, distortion shader
- **Stats:** 1,000+ Qubits | Hybrid Classical-Quantum | Real-time Optimization

### Section 5: AI Tools & Agents (Optimize)

- **Title:** "AI Tools & Agents"
- **Description:** "Intelligent agents that automate, analyze, and augment every layer of your business."
- **3D:** Neural network mesh reveals, camera pulls back to show all objects connected
- **Stats:** 50+ AI Models | Multi-Agent Orchestration | Natural Language Interface

### Section 6: Product Grid (HTML only, below 3D)

- Standard product cards linking to `/hospital`, `/llm`, `/iot`, `/payment-gateway`, etc.
- CTA: "Get Started" / "Contact Sales"

---

## 7. 3D Object Specifications

### FloorGrid

- **Geometry:** PlaneGeometry(200, 200)
- **Material:** ShaderMaterial with custom GLSL (gridFloor.vert + gridFloor.frag)
- **Effect:** Animated grid lines fading into fog, sage green color, scanning line effect
- **Performance:** Single draw call

### ServerCluster (ERP/IoT)

- **Geometry:** BoxGeometry(0.4, 2, 0.8) — single rack
- **Mesh:** InstancedMesh with 500 instances (single draw call for all 500)
- **Material:** MeshStandardMaterial(metalness: 0.8, roughness: 0.3, color: #1a1a2e)
- **Accent:** Emissive green LEDs on each rack (small BoxGeometry strips, separate InstancedMesh)
- **Reveal:** Scale from 0 to 1, staggered by row
- **LED Animation:** Per-instance color update in useFrame, random blink rates

### DataNodes (Blockchain)

- **Geometry:** SphereGeometry(0.5, 32, 32) — 20 nodes
- **Material:** MeshStandardMaterial(emissive: #00ff88, emissiveIntensity: 2)
- **Cables:** TubeGeometry following CatmullRomCurve3 paths between nodes
- **Reveal:** Opacity 0 to 1 with scale, cables grow along path via drawRange animation
- **Animation:** Float component from drei for gentle bobbing

### QuantumCore

- **Geometry:** IcosahedronGeometry(3, 2) + orbiting TorusGeometry rings
- **Material:** MeshDistortMaterial (from drei) with animated distortion factor
- **Effect:** Pulsing emissive intensity, orbiting particles on elliptical paths
- **Reveal:** Scale from center with rotation animation

### AIBrain

- **Geometry:** Network of SphereGeometry nodes (30 nodes) + LineSegments connections (60 lines)
- **Material:** MeshStandardMaterial(emissive: #8b5cf6) for nodes
- **Connections:** LineBasicMaterial with opacity animation
- **Reveal:** Nodes appear first (staggered), then connections draw in

### ParticleField

- **Geometry:** BufferGeometry with 5000 points, random positions in a 60x20x100 volume
- **Material:** Custom ShaderMaterial with vertex shader for size attenuation + drift
- **Animation:** Slow upward drift + horizontal oscillation, scroll-responsive movement
- **Blending:** AdditiveBlending for glow effect
- **Always visible:** Background atmosphere element across all sections

### ConnectionCables

- **Between clusters:** TubeGeometry(CatmullRomCurve3, segments: 64, radius: 0.05)
- **Material:** MeshStandardMaterial(emissive: #00ff88, transparent: true)
- **Reveal:** drawRange animation (progressively reveal tube segments as scroll progresses)

---

## 8. Post-Processing Pipeline

```
Scene Render
    |
    v
+----------------------------------------+
|  Bloom                                  |
|  - intensity: 1.5                       |
|  - luminanceThreshold: 0.8              |
|  - luminanceSmoothing: 0.3              |
|  - Only affects emissive materials      |
+----------------------------------------+
    |
    v
+----------------------------------------+
|  Vignette                               |
|  - offset: 0.3                          |
|  - darkness: 0.9                        |
|  - Darkens edges for cinematic feel     |
+----------------------------------------+
    |
    v
+----------------------------------------+
|  ChromaticAberration (subtle)           |
|  - offset: [0.0005, 0.0005]            |
|  - RGB split at screen edges            |
+----------------------------------------+
    |
    v
+----------------------------------------+
|  ToneMapping (ACES Filmic)              |
|  - Realistic light response             |
|  - exposure: 1.2                        |
+----------------------------------------+
    |
    v
  Final Output
```

### R3F Imports for Post-Processing

```tsx
import { EffectComposer, Bloom, Vignette, ChromaticAberration, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
```

---

## 9. Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0a0a0f` | Page background, scene background |
| `--bg-secondary` | `#111118` | Card backgrounds |
| `--accent-green` | `#00ff88` | Primary accent, emissive glows, CTAs |
| `--accent-sage` | `#7cb89e` | Secondary text, subtle highlights |
| `--accent-purple` | `#8b5cf6` | AI/Quantum accent color |
| `--accent-cyan` | `#06b6d4` | IoT/Data accent color |
| `--text-primary` | `#ffffff` | Headlines |
| `--text-secondary` | `#a1a1aa` | Body text, descriptions |
| `--text-muted` | `#52525b` | Labels, captions |

---

## 10. Imports Map (Per File)

### PlatformLanding.tsx

```tsx
import PlatformCanvas from '@/components/platform/PlatformCanvas'
import ScrollManager from '@/components/platform/ScrollManager'
import ScrollSections from '@/components/platform/ScrollSections'
import HeroSection from '@/components/platform/HeroSection'
import ProductGrid from '@/components/platform/ProductGrid'
import PlatformNav from '@/components/platform/PlatformNav'
import ProgressIndicator from '@/components/platform/ProgressIndicator'
import LoadingScreen from '@/components/platform/LoadingScreen'
```

### PlatformCanvas.tsx

```tsx
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import CameraRig from './CameraRig'
import SceneLighting from './SceneLighting'
import SceneEnvironment from './SceneEnvironment'
import FloorGrid from './FloorGrid'
import ServerCluster from './ServerCluster'
import DataNodes from './DataNodes'
import QuantumCore from './QuantumCore'
import AIBrain from './AIBrain'
import ParticleField from './ParticleField'
import ConnectionCables from './ConnectionCables'
```

### CameraRig.tsx

```tsx
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollProgress } from './useScrollProgress'
import { CAMERA_KEYFRAMES } from './constants'
// Uses: THREE.CatmullRomCurve3, THREE.Vector3, THREE.Quaternion
// Uses: camera.position.copy(), camera.quaternion.slerp()
```

### SceneLighting.tsx

```tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScrollProgress } from './useScrollProgress'
// JSX: <ambientLight>, <directionalLight>, <pointLight>, <spotLight>
```

### SceneEnvironment.tsx

```tsx
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
// JSX: <fog>, <Environment preset="night" />
```

### FloorGrid.tsx

```tsx
import { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
// Custom ShaderMaterial with GLSL for animated grid
```

### ServerCluster.tsx

```tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollProgress } from './useScrollProgress'
// Uses: THREE.InstancedMesh, THREE.Matrix4, THREE.Object3D (dummy for matrix calc)
```

### DataNodes.tsx

```tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float } from '@react-three/drei'
import { useScrollProgress } from './useScrollProgress'
// Uses: THREE.SphereGeometry, THREE.TubeGeometry, THREE.CatmullRomCurve3
```

### QuantumCore.tsx

```tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float } from '@react-three/drei'
import { useScrollProgress } from './useScrollProgress'
// Uses: <icosahedronGeometry>, <torusGeometry>, MeshDistortMaterial
```

### AIBrain.tsx

```tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollProgress } from './useScrollProgress'
// Uses: THREE.BufferGeometry, THREE.LineSegments, THREE.LineBasicMaterial
```

### ParticleField.tsx

```tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
// Uses: THREE.BufferGeometry, THREE.Float32BufferAttribute, THREE.Points, THREE.PointsMaterial
// Custom ShaderMaterial for vertex-level size attenuation and drift
```

### ConnectionCables.tsx

```tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollProgress } from './useScrollProgress'
// Uses: THREE.TubeGeometry, THREE.CatmullRomCurve3, mesh.geometry.setDrawRange()
```

### ScrollManager.tsx

```tsx
import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// gsap.registerPlugin(ScrollTrigger)
```

### ScrollSections.tsx

```tsx
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionOverlay from './SectionOverlay'
import { SECTIONS } from './constants'
```

### SectionOverlay.tsx

```tsx
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import MetricCounter from './MetricCounter'
```

### HeroSection.tsx

```tsx
import { motion } from 'framer-motion'
import MetricCounter from './MetricCounter'
```

### MetricCounter.tsx

```tsx
import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'
// Animated number counter: counts from 0 to target when visible
```

### LoadingScreen.tsx

```tsx
import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
```

### useScrollProgress.ts

```tsx
import { create } from 'zustand'
// Zustand store: { progress: number, setProgress: (p: number) => void }
```

### useSectionTrigger.ts

```tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
```

### useReducedMotion.ts

```tsx
import { useState, useEffect } from 'react'
// window.matchMedia('(prefers-reduced-motion: reduce)')
```

### constants.ts

```tsx
import * as THREE from 'three'
// Exports: CAMERA_KEYFRAMES, SECTIONS, COLORS, METRICS
```

---

## 11. App.tsx Route Change

**Current:**

```tsx
<Route path="/platform" element={<Layout><PlatformLanding /></Layout>} />
```

**New:**

```tsx
<Route path="/platform" element={<PlatformLanding />} />
```

Remove the `<Layout>` wrapper so `/platform` is full-screen (no sidebar, no header). The PlatformLanding page manages its own navigation via `<PlatformNav />`.

---

## 12. Vite Config Changes

Add manual chunk for Three.js to keep bundle size optimized:

```ts
// vite.config.ts -> build.rollupOptions.output.manualChunks
{
  vendor: ['react', 'react-dom'],
  router: ['react-router-dom'],
  ui: ['framer-motion', 'lucide-react'],
  three: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],  // NEW
  gsap: ['gsap'],  // NEW
}
```

---

## 13. Performance Budget

| Metric | Target |
|--------|--------|
| Initial JS bundle (gzipped) | < 300KB (excluding Three.js chunk) |
| Three.js chunk (gzipped) | < 250KB (lazy loaded) |
| First Contentful Paint | < 2s |
| 3D Scene Ready | < 4s |
| Frame rate | 60fps (desktop), 30fps (mobile) |
| Draw calls | < 50 |
| Triangle count | < 100K |
| Texture memory | < 64MB |

### Performance Strategies

1. **InstancedMesh** for all repeated geometry (servers, nodes)
2. **Lazy load** Three.js chunk via React.lazy() on /platform route
3. **useProgress** hook shows loading screen while assets initialize
4. **Frustum culling** enabled by default in R3F
5. **Mobile detection** — reduce particle count, disable post-processing, simpler geometry
6. **requestAnimationFrame** for all scroll-driven updates (via useFrame hook in R3F)
7. **LOD (Level of Detail)** — simplified geometry when far from camera
8. **Object pooling** — reuse particles/effects
9. **Draco compression** if loading GLTF models in the future

---

## 14. Mobile & Accessibility Strategy

### Mobile (< 768px)

- Reduce particle count: 5000 to 1000
- Disable ChromaticAberration
- Reduce Bloom intensity: 1.5 to 0.8
- Reduce InstancedMesh count: 500 to 100
- Touch scroll instead of wheel
- Simpler camera path (fewer keyframes)
- Pixel ratio capped at 2

### Reduced Motion (prefers-reduced-motion: reduce)

- Disable scroll-driven camera movement
- Show static camera positions per section
- Use opacity fade for section transitions instead of 3D animation
- Keep post-processing but disable animated particles

### Accessibility

- `<canvas>` has `role="img"` and `aria-label="NCQ Platform 3D visualization"`
- All text content is in real HTML overlays (not rendered in 3D)
- Keyboard: Arrow keys and Page Up/Down trigger scroll
- Progress indicator serves as visual scroll alternative
- All sections navigable via tab key
- Screen reader `aria-live` region announces current section

---

## 15. Implementation Order (Build Sequence)

```
Phase 1: Foundation
|-- 1.1  Install dependencies
|-- 1.2  Create constants.ts (colors, keyframes, sections)
|-- 1.3  Create useScrollProgress.ts (Zustand store)
|-- 1.4  Create useReducedMotion.ts
+-- 1.5  Modify App.tsx (remove Layout from /platform)

Phase 2: 3D Scene (can be tested in isolation)
|-- 2.1  PlatformCanvas.tsx (empty Canvas + camera + lights)
|-- 2.2  SceneLighting.tsx
|-- 2.3  SceneEnvironment.tsx (fog + dark background)
|-- 2.4  FloorGrid.tsx (shader grid)
|-- 2.5  ParticleField.tsx (ambient particles)
|-- 2.6  CameraRig.tsx (spline path, controlled by progress ref)
+-- 2.7  Post-processing (Bloom + Vignette)

Phase 3: 3D Objects (add one at a time)
|-- 3.1  ServerCluster.tsx (InstancedMesh, section 2 reveal)
|-- 3.2  DataNodes.tsx (spheres + cables, section 3 reveal)
|-- 3.3  QuantumCore.tsx (distorted icosahedron, section 4 reveal)
|-- 3.4  AIBrain.tsx (network mesh, section 5 reveal)
+-- 3.5  ConnectionCables.tsx (tubes between clusters)

Phase 4: Scroll System
|-- 4.1  ScrollManager.tsx (Lenis + ScrollTrigger init)
|-- 4.2  ScrollSections.tsx (section triggers + pinning)
|-- 4.3  SectionOverlay.tsx (text + stats per section)
+-- 4.4  Wire scroll progress -> CameraRig + object reveals

Phase 5: UI Overlays
|-- 5.1  HeroSection.tsx (title + animated metrics)
|-- 5.2  MetricCounter.tsx (animated number)
|-- 5.3  PlatformNav.tsx (floating nav)
|-- 5.4  ProgressIndicator.tsx (scroll bar)
|-- 5.5  ProductGrid.tsx (bottom product cards)
+-- 5.6  LoadingScreen.tsx (preloader)

Phase 6: Integration
|-- 6.1  Rewrite PlatformLanding.tsx (wire all components)
|-- 6.2  Vite config chunk splitting
|-- 6.3  Mobile detection + fallbacks
|-- 6.4  Polish: timing, easing, colors
+-- 6.5  Test + commit + push
```

---

## 16. Reverse Engineering Analysis

### How the Hut 8 Experience Works (Technical Breakdown)

#### Scene Hierarchy

```
Scene
|-- Environment
|   |-- Floor (PlaneGeometry with grid shader)
|   |-- Ceiling (optional)
|   +-- Fog (THREE.Fog for depth)
|
|-- Data Center Structure
|   |-- InstancedMesh: Server Racks (100s of units)
|   |   +-- Each instance has: position, rotation, color variation
|   |-- InstancedMesh: Cooling Units
|   |-- Cables (TubeGeometry along splines)
|   +-- Equipment Details
|
|-- Lighting
|   |-- AmbientLight (base illumination, intensity: 0.5)
|   |-- DirectionalLight (main shadow-casting, intensity: 1)
|   |-- PointLights (accent, colored — cyan/green)
|   +-- SpotLights (dramatic highlights)
|
|-- Particles (optional)
|   +-- Points geometry with custom shader
|
+-- Camera
    +-- PerspectiveCamera on CatmullRomCurve3 path
```

#### Object Reveal Techniques

| Technique | How It Works |
|-----------|--------------|
| **Opacity Fade** | Object starts at `opacity: 0`, tweens to `1` |
| **Scale Animation** | Object starts at `scale: 0`, grows to `1` |
| **Position Fly-in** | Object starts off-screen, slides into place |
| **Shader Reveal** | Custom shader with `uProgress` uniform controls visibility |
| **Staggered Groups** | Arrays of objects animate in sequence with delays |
| **drawRange** | TubeGeometry progressively reveals tube segments |

#### Section-Based Triggers

```
Section 1: 0% - 20%    -> Camera at Position A, reveal particles + grid
Section 2: 20% - 40%   -> Camera moves to B, reveal server racks
Section 3: 40% - 60%   -> Camera moves to C, reveal blockchain nodes
Section 4: 60% - 80%   -> Camera moves to D, reveal quantum core
Section 5: 80% - 100%  -> Camera pulls back, reveal AI brain + full scene
```

#### Text Animation Strategy

```
SCROLL ENTERS SECTION
    |
    v
SPLIT TEXT INTO CHARACTERS (GSAP SplitText or manual)
"INFRASTRUCTURE" -> ["I","N","F","R","A","S","T","R","U","C","T","U","R","E"]
    |
    v
STAGGER ANIMATION
  each char: opacity 0 -> 1
  each char: y: 20 -> 0
  stagger: 0.02s between chars
    |
    v
HOLD IN VIEW (while in section range)
    |
    v
FADE OUT (when leaving section)
```

#### Complete Data Flow

```
+-----------------------------------------------------------------------+
|                              USER INPUT                                |
|                    (wheel, touch, keyboard, scroll)                    |
+-----------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                         SCROLL PROCESSOR                               |
|  - Capture delta values                                                |
|  - Apply damping/smoothing (0.08)                                      |
|  - Clamp to bounds (0 -> maxScroll)                                    |
|  - Normalize to progress (0.0 -> 1.0)                                  |
+-----------------------------------------------------------------------+
                                    |
         +--------------------------+---------------------------+
         v                          v                           v
+-----------------+      +---------------------+      +---------------------+
|  CAMERA SYSTEM  |      |   OBJECT ANIMATOR   |      |    UI CONTROLLER    |
+-----------------+      +---------------------+      +---------------------+
| - Get point on  |      | - Check section     |      | - Update progress   |
|   spline path   |      |   triggers          |      |   bar               |
| - Interpolate   |      | - Animate opacity   |      | - Animate text in/  |
|   lookAt target |      | - Animate scale     |      |   out               |
| - Update FOV    |      | - Animate position  |      | - Update stats      |
|   (optional)    |      | - Update materials  |      | - Show/hide CTAs    |
+-----------------+      +---------------------+      +---------------------+
         |                          |                           |
         +--------------------------+---------------------------+
                                    v
+-----------------------------------------------------------------------+
|                         RENDER PIPELINE                                 |
|  - Three.js scene render                                               |
|  - Post-processing passes (bloom, vignette, etc.)                      |
|  - Composite with HTML overlays                                        |
|  - requestAnimationFrame loop                                          |
+-----------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                              DISPLAY                                    |
|                     (Canvas + DOM overlays)                             |
+-----------------------------------------------------------------------+
```

#### Performance Optimizations Used

| Optimization | Implementation |
|--------------|----------------|
| **Instanced Meshes** | 500+ objects as 1 draw call |
| **LOD (Level of Detail)** | Simplified geometry when far |
| **Frustum Culling** | Only render visible objects |
| **Texture Compression** | KTX2/Basis for GPU textures |
| **Model Optimization** | Draco compression for GLTF |
| **Throttled Events** | requestAnimationFrame for scroll |
| **Object Pooling** | Reuse particles/effects |
| **Deferred Loading** | Load 3D assets progressively |

#### Likely Tools & Workflow

| Phase | Tools |
|-------|-------|
| **3D Modeling** | Blender, Cinema 4D |
| **Path Design** | Blender (animate camera, export keyframes) |
| **Textures** | Substance Painter, Photoshop |
| **Optimization** | gltf-transform, Draco encoder |
| **Development** | VS Code, Three.js Editor |
| **Animation Keyframing** | Theatre.js Studio, GSAP DevTools |
| **Testing** | Chrome DevTools, Spector.js (WebGL debugging) |

---

## 17. Verification Checklist

- [ ] `npm run dev` starts without errors
- [ ] `/platform` route shows full-screen 3D scene (no sidebar)
- [ ] Scrolling moves camera smoothly along spline path
- [ ] Each section pins and reveals its 3D objects
- [ ] HTML overlays (title, stats) fade in/out per section
- [ ] Bloom effect visible on emissive materials
- [ ] Loading screen shows while 3D initializes
- [ ] Mobile: reduced particles, touch scroll works
- [ ] `prefers-reduced-motion`: graceful degradation
- [ ] Other routes (`/dashboard`, `/hospital`, etc.) still work with Layout
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] Frame rate > 50fps on mid-range laptop
