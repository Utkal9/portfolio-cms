import { useEffect, useRef } from "react";
import * as THREE from "three";
// ── Three.js particle background ─────────────────────────────────────
export default function HeroBackground() {
    const mountRef = useRef(null);

    useEffect(() => {
        const el = mountRef.current;
        if (!el) return;
        const W = el.clientWidth;
        const H = el.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        el.appendChild(renderer.domElement);
        camera.position.z = 4;

        const COUNT = 1600;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(COUNT * 3);
        const col = new Float32Array(COUNT * 3);
        const palette = [
            new THREE.Color("#4f8ef7"),
            new THREE.Color("#8b5cf6"),
            new THREE.Color("#06b6d4"),
            new THREE.Color("#10b981"),
        ];

        for (let i = 0; i < COUNT; i++) {
            const r = 3 + Math.random() * 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
            const c = palette[Math.floor(Math.random() * palette.length)];
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
        const mat = new THREE.PointsMaterial({
            size: 0.04,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true,
        });
        const points = new THREE.Points(geo, mat);
        scene.add(points);

        let mx = 0,
            my = 0;
        const onMouse = (e) => {
            mx = (e.clientX / window.innerWidth - 0.5) * 0.4;
            my = (e.clientY / window.innerHeight - 0.5) * 0.4;
        };
        window.addEventListener("mousemove", onMouse);

        let frame;
        const startTime = performance.now();
        const animate = () => {
            frame = requestAnimationFrame(animate);
            const t = (performance.now() - startTime) / 1000;
            points.rotation.y = t * 0.04 + mx;
            points.rotation.x = t * 0.02 - my;
            mat.opacity = 0.55 + Math.sin(t * 0.5) * 0.15;
            renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
            const nW = el.clientWidth,
                nH = el.clientHeight;
            camera.aspect = nW / nH;
            camera.updateProjectionMatrix();
            renderer.setSize(nW, nH);
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("mousemove", onMouse);
            window.removeEventListener("resize", onResize);
            renderer.dispose();
            geo.dispose();
            mat.dispose();
            if (el.contains(renderer.domElement))
                el.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "hidden",
            }}
        />
    );
}
