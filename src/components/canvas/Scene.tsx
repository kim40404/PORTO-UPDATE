"use client";

import { useRef, useMemo, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, PerspectiveCamera, Float, Bounds, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// ── Preload chess + mountain (brain uses raw Three.js loader) ──
useGLTF.preload("/chess_set.glb");
useGLTF.preload("/great_mountain.glb");

// ── Shared molten metal material ──
function useMoltenMaterial() {
    return useMemo(() => new THREE.MeshPhysicalMaterial({
        color: 0x1a1a1a, metalness: 0.9, roughness: 0.15,
        clearcoat: 0.8, clearcoatRoughness: 0.1, envMapIntensity: 2.5,
    }), []);
}

// ── OptimizedModel (for hero/about) ──
function OptimizedModel({ url, scale = 1, position = [0, 0, 0] as [number, number, number], rotation = [0, 0, 0] as [number, number, number], speed = 0.005, skipFrames = 3 }: {
    url: string; scale?: number; position?: [number, number, number]; rotation?: [number, number, number]; speed?: number; skipFrames?: number;
}) {
    const { scene } = useGLTF(url) as any;
    const meshRef = useRef<THREE.Group>(null);
    const material = useMoltenMaterial();
    const frameCount = useRef(0);
    useMemo(() => {
        scene.traverse((child: any) => {
            if ((child as THREE.Mesh).isMesh) {
                const m = child as THREE.Mesh;
                m.material = material; m.frustumCulled = true; m.matrixAutoUpdate = false; m.updateMatrix();
            }
        });
    }, [scene, material]);
    useFrame(() => {
        if (!meshRef.current) return;
        frameCount.current++;
        if (frameCount.current % skipFrames !== 0) return;
        meshRef.current.rotation.y += speed;
        meshRef.current.updateMatrix();
    });
    return <primitive object={scene.clone()} ref={meshRef} scale={scale} position={position} rotation={rotation} />;
}

// ═══ 1. Hero ═══
export function HeroScene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
            <ambientLight intensity={0.8} color="#1a1a2a" />
            <pointLight position={[5, 5, 5]} intensity={3} color="#e8a020" distance={30} />
            <Environment preset="city" />
            <fog attach="fog" args={["#080808", 8, 20]} />
            <Suspense fallback={null}><Bounds fit margin={1.5}><Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.5}><OptimizedModel url="/rotating_circle.glb" scale={1.5} speed={0.01} skipFrames={2} /></Float></Bounds></Suspense>
        </>
    );
}

// ═══ 2. About ═══
export function AboutScene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
            <ambientLight intensity={0.6} color="#1a1a2a" />
            <pointLight position={[3, 3, 3]} intensity={2} color="#e8a020" distance={20} />
            <Environment preset="city" />
            <fog attach="fog" args={["#080808", 6, 16]} />
            <Suspense fallback={null}><Bounds fit margin={1.8}><Float speed={0.8} rotationIntensity={0.15} floatIntensity={2}><OptimizedModel url="/cc0_-_drops.glb" scale={1.2} speed={0.003} skipFrames={3} /></Float></Bounds></Suspense>
        </>
    );
}

// ═══ 3. Brain — PURE THREE.JS (no R3F, guaranteed visible) ═══
export function BrainCanvas() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = mountRef.current;
        if (!el) return;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(el.clientWidth, el.clientHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.6;
        renderer.setClearColor(new THREE.Color("#080808"));
        el.appendChild(renderer.domElement);

        // Scene + Camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36, el.clientWidth / el.clientHeight, 0.1, 9999999);
        camera.position.set(0, 0, 100);
        scene.add(camera);

        // Lights
        const ambient = new THREE.AmbientLight(new THREE.Color("#3d1a00"), 1.2);
        scene.add(ambient);

        const lightDefs = [
            { pos: [6000, 6000, 8000] as [number, number, number], color: "#f5c842", i: 2e12 },
            { pos: [-7000, -3000, 6000] as [number, number, number], color: "#e86010", i: 1.5e12 },
            { pos: [0, 8000, 3000] as [number, number, number], color: "#ffffff", i: 1e12 },
            { pos: [-6000, 3000, -8000] as [number, number, number], color: "#00aaff", i: 8e11 },
        ];
        lightDefs.forEach(l => {
            const pl = new THREE.PointLight(l.color, l.i, 0, 2);
            pl.position.set(l.pos[0], l.pos[1], l.pos[2]);
            scene.add(pl);
        });

        // Load GLB
        const loader = new GLTFLoader();
        let brainGroup: THREE.Group | null = null;
        let floatTime = 0;
        let floatAmp = 50;

        loader.load("/neural_networks_of_the_brain.glb", (gltf) => {
            const model = gltf.scene;

            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);

            model.position.sub(center);

            const mat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color("#2a1400"),
                emissive: new THREE.Color("#c8680a"),
                emissiveIntensity: 0.7,
                metalness: 0.92,
                roughness: 0.15,
                clearcoat: 0.7,
                clearcoatRoughness: 0.12,
                envMapIntensity: 2.0,
            });
            model.traverse((node: any) => {
                if (node.isMesh) {
                    node.material = mat.clone();
                    node.frustumCulled = true;
                }
            });

            brainGroup = new THREE.Group();
            brainGroup.add(model);
            scene.add(brainGroup);

            const dist = maxDim * 2.5;
            camera.position.set(0, maxDim * 0.05, dist);
            camera.far = maxDim * 20;
            camera.near = maxDim * 0.0005;
            camera.updateProjectionMatrix();
            floatAmp = maxDim * 0.018;

            console.log("[Brain] maxDim:", maxDim.toFixed(0), "→ camZ:", dist.toFixed(0));
        }, undefined, (err: any) => console.error("[Brain] load error:", err));

        // Mouse interaction
        const mouse = { x: 0, y: 0 };
        const target = { rx: 0, ry: 0 };

        const onMove = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
            mouse.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
        };
        const onLeave = () => { mouse.x = 0; mouse.y = 0; };
        el.addEventListener("mousemove", onMove, { passive: true });
        el.addEventListener("mouseleave", onLeave);

        // Animation loop
        let rafId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            rafId = requestAnimationFrame(animate);
            const delta = clock.getDelta();

            if (brainGroup) {
                const lf = 1 - Math.pow(0.06, delta);
                target.ry += (mouse.x * 0.65 - target.ry) * lf;
                target.rx += (mouse.y * 0.45 - target.rx) * lf;
                brainGroup.rotation.y = target.ry;
                brainGroup.rotation.x = target.rx;

                floatTime += delta;
                brainGroup.position.y = Math.sin(floatTime * 0.8) * floatAmp;
            }

            renderer.render(scene, camera);
        };
        animate();

        // Resize
        const onResize = () => {
            camera.aspect = el.clientWidth / el.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(el.clientWidth, el.clientHeight);
        };
        window.addEventListener("resize", onResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(rafId);
            el.removeEventListener("mousemove", onMove);
            el.removeEventListener("mouseleave", onLeave);
            window.removeEventListener("resize", onResize);
            renderer.dispose();
            if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                width: "100%", height: 480, borderRadius: 16, overflow: "hidden",
                border: "1px solid rgba(232,160,32,0.1)", position: "relative",
                background: "radial-gradient(ellipse at 50% 45%, #1c0d00 0%, #080808 100%)",
            }}
        >
            <div style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                width: 260, height: 260, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(200,100,10,0.12) 0%, transparent 65%)",
                pointerEvents: "none", animation: "brainGlow 3s ease-in-out infinite alternate",
            }} />
            <div style={{
                position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center",
                fontFamily: "JetBrains Mono", fontSize: 9,
                color: "rgba(232,160,32,0.3)", letterSpacing: "0.2em", pointerEvents: "none", zIndex: 2,
            }}>NEURAL ARCHITECTURE · MOVE MOUSE</div>
            <style>{`@keyframes brainGlow { from { opacity:.4; transform:translate(-50%,-50%) scale(1) } to { opacity:1; transform:translate(-50%,-50%) scale(1.15) } }`}</style>
        </div>
    );
}

// ═══ 4. Mountain — GREEN LIVING TEXTURE ═══
function MountainMesh() {
    const gltf = useGLTF("/great_mountain.glb") as any;
    const { camera } = useThree();
    const modelRef = useRef<THREE.Group>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!gltf.scene || ready) return;
        const model = gltf.scene.clone(true);

        const totalBox = new THREE.Box3().setFromObject(model);
        const totalSize = totalBox.getSize(new THREE.Vector3());
        const center = totalBox.getCenter(new THREE.Vector3());
        const maxDim = Math.max(totalSize.x, totalSize.y, totalSize.z);
        console.log("[Mountain] MaxDim:", maxDim.toFixed(1));

        model.position.sub(center);

        // Height-based material layering
        model.traverse((node: any) => {
            if (!node.isMesh) return;

            const meshBox = new THREE.Box3().setFromObject(node);
            const meshCenter = meshBox.getCenter(new THREE.Vector3());
            const normalizedY = (meshCenter.y - (center.y - totalSize.y / 2)) / totalSize.y;

            let color: THREE.Color, emissive: THREE.Color, roughness: number, metalness: number;

            if (normalizedY > 0.75) {
                // Summit: grey rock / snow tint
                color = new THREE.Color("#5a5a52");
                emissive = new THREE.Color("#2a2820");
                roughness = 0.9;
                metalness = 0.05;
            } else if (normalizedY > 0.45) {
                // Mid: dark forest green
                color = new THREE.Color("#1e3a1e");
                emissive = new THREE.Color("#0a1a08");
                roughness = 0.88;
                metalness = 0.02;
            } else {
                // Base: earth brown with moss
                color = new THREE.Color("#2e2416");
                emissive = new THREE.Color("#150e06");
                roughness = 0.85;
                metalness = 0.04;
            }

            node.material = new THREE.MeshStandardMaterial({
                color, emissive,
                emissiveIntensity: 0.12,
                roughness, metalness,
                envMapIntensity: 1.2,
            });
            node.frustumCulled = true;
            node.castShadow = false;
            node.receiveShadow = false;
        });

        if (modelRef.current) {
            while (modelRef.current.children.length) modelRef.current.remove(modelRef.current.children[0]);
            modelRef.current.add(model);
        }

        const dist = maxDim * 1.8;
        camera.position.set(maxDim * 0.3, maxDim * 0.5, dist);
        (camera as THREE.PerspectiveCamera).far = maxDim * 15;
        (camera as THREE.PerspectiveCamera).near = maxDim * 0.001;
        (camera as THREE.PerspectiveCamera).fov = 45;
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
        setReady(true);
    }, [gltf.scene, camera, ready]);

    return <group ref={modelRef} rotation={[0, Math.PI / 5, 0]} />;
}

// Self-contained mountain preview (for experience card)
export function MountainPreview() {
    return (
        <div style={{
            width: "100%", height: "100%", minHeight: 120, borderRadius: 12, overflow: "hidden",
        }}>
            <Canvas
                camera={{ position: [0, 2500, 5000], fov: 45, near: 10, far: 50000 }}
                frameloop="demand" dpr={1}
                gl={{ alpha: false, antialias: false }}
                onCreated={({ gl }) => {
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.toneMappingExposure = 1.2;
                    gl.setClearColor(new THREE.Color("#0a0703"));
                }}
            >
                <ambientLight intensity={0.8} color="#1a2a10" />
                <directionalLight position={[1, 1.5, 0.8]} intensity={3.5} color="#d4e8b0" />
                <pointLight position={[3000, 4000, 3000]} intensity={6e7} color="#f0e080" decay={2} />
                <pointLight position={[-3000, 1000, -2000]} intensity={2e7} color="#80c0ff" decay={2} />
                <pointLight position={[0, -2000, 2000]} intensity={1.5e7} color="#40a020" decay={2} />
                <Suspense fallback={null}><MountainMesh /></Suspense>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 2.3} />
            </Canvas>
        </div>
    );
}

// ═══ 5. Chess — SELF-CONTAINED ═══
function ChessBoard({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
    const gltf = useGLTF("/chess_set.glb") as any;
    const groupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();
    const rotX = useRef(0);
    const [ready, setReady] = useState(false);
    const didInit = useRef(false);

    useEffect(() => {
        if (!gltf.scene || !groupRef.current || didInit.current) return;
        didInit.current = true;

        const model = gltf.scene.clone(true);

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        console.log("[Chess] Size:", size.x.toFixed(1), size.y.toFixed(1), size.z.toFixed(1));

        model.position.sub(center);

        // Keep original materials
        model.traverse((node: any) => {
            if (node.isMesh) {
                node.castShadow = false;
                node.receiveShadow = false;
                node.frustumCulled = true;
                if (node.material && !node.material.map) {
                    node.material.metalness = 0.6;
                    node.material.roughness = 0.3;
                    node.material.needsUpdate = true;
                }
            }
        });

        groupRef.current.add(model);

        const dist = maxDim * 2.4;
        camera.position.set(maxDim * 0.1, maxDim * 0.7, dist);
        (camera as THREE.PerspectiveCamera).far = maxDim * 30;
        (camera as THREE.PerspectiveCamera).near = maxDim * 0.001;
        (camera as THREE.PerspectiveCamera).fov = 38;
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
        setReady(true);
    }, [gltf.scene, camera]);

    useFrame((_, delta) => {
        if (!ready || !groupRef.current) return;
        const lf = 1 - Math.pow(0.04, delta);
        rotX.current += (mouseRef.current.y * 0.12 - rotX.current) * lf;
        groupRef.current.rotation.x = rotX.current;
    });

    return <group ref={groupRef} rotation={[0, Math.PI / 6, 0]} />;
}

export function ChessScene() {
    const mouseRef = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            onMouseMove={e => {
                const r = containerRef.current?.getBoundingClientRect();
                if (!r) return;
                mouseRef.current = {
                    x: ((e.clientX - r.left) / r.width - 0.5) * 2,
                    y: -((e.clientY - r.top) / r.height - 0.5) * 2,
                };
            }}
            onMouseLeave={() => { mouseRef.current = { x: 0, y: 0 }; }}
            style={{
                width: "100%", height: 500, borderRadius: 20, overflow: "hidden",
                background: "radial-gradient(ellipse at 50% 70%, #120e04 0%, #080604 100%)",
                position: "relative", border: "1px solid rgba(232,160,32,0.12)",
            }}
        >
            <Canvas
                camera={{ position: [0, 10, 20], fov: 38, near: 0.001, far: 100000 }}
                frameloop="demand" dpr={[1, 1.5]}
                gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
                onCreated={({ gl }) => {
                    gl.setClearColor(new THREE.Color("#080604"));
                    gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                }}
            >
                <ambientLight intensity={1.2} color="#5a4020" />
                <directionalLight position={[5, 10, 8]} intensity={4} color="#fff5e0" />
                <pointLight position={[-5, 6, 5]} intensity={3} color="#f5c842" />
                <pointLight position={[5, 3, -5]} intensity={2} color="#00d4ff" />
                <pointLight position={[0, 8, 0]} intensity={3} color="#ffffff" />
                <Suspense fallback={
                    <mesh><boxGeometry args={[1, 0.1, 1]} /><meshStandardMaterial color="#e8a020" wireframe /></mesh>
                }>
                    <ChessBoard mouseRef={mouseRef} />
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.5} />
            </Canvas>
            <div style={{
                position: "absolute", bottom: 14, right: 18,
                fontFamily: "JetBrains Mono", fontSize: 9,
                color: "rgba(232,160,32,0.35)", letterSpacing: "0.15em", pointerEvents: "none",
            }}>DRAG TO ROTATE</div>
        </div>
    );
}
