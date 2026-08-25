'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Bar3DPoint, ColorScheme } from '@/types';

interface Props {
  bars?: Bar3DPoint[];
  colorScheme: ColorScheme;
  isAutoRotate: boolean;
}

export default function BarChart3D({
  bars = [],
  colorScheme,
  isAutoRotate,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(100, 110, 140);
    camera.lookAt(0, 15, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.replaceChildren(renderer.domElement);

    const barGroup = new THREE.Group();

    // 3D Floor Grid
    const gridHelper = new THREE.GridHelper(100, 10, 0x10b981, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Color mapper
    const barPrimaryColor =
      colorScheme === 'HEAT'
        ? 0xf97316
        : colorScheme === 'CYBERPUNK'
        ? 0x06b6d4
        : 0x10b981;

    // Render 3D Voxel Pillars
    const numCols = 5;
    const spacing = 16;
    const offset = ((numCols - 1) * spacing) / 2;

    bars.forEach((b, idx) => {
      const row = Math.floor(idx / numCols);
      const col = idx % numCols;

      const posX = col * spacing - offset;
      const posZ = row * spacing - offset;
      const barHeight = Math.max(4, (b.value / 110) * 50);

      const boxGeo = new THREE.BoxGeometry(10, barHeight, 10);
      boxGeo.translate(0, barHeight / 2, 0);

      const boxMat = new THREE.MeshPhongMaterial({
        color: barPrimaryColor,
        emissive: barPrimaryColor,
        emissiveIntensity: 0.35,
        shininess: 90,
      });

      const mesh = new THREE.Mesh(boxGeo, boxMat);
      mesh.position.set(posX, 0, posZ);
      barGroup.add(mesh);

      // Top Cap Neon Frame
      const capGeo = new THREE.BoxGeometry(10.2, 0.8, 10.2);
      capGeo.translate(0, barHeight + 0.4, 0);
      const capMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(posX, 0, posZ);
      barGroup.add(cap);
    });

    scene.add(barGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(80, 150, 100);
    scene.add(dirLight);

    // Drag Orbit Controls
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        barGroup.rotation.y += dx * 0.006;
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    const onMouseUp = () => (isDragging = false);

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (isAutoRotate && !isDragging) {
        barGroup.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [bars, colorScheme, isAutoRotate]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl bg-[#04080e] overflow-hidden border border-slate-800 flex items-center justify-center font-mono">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Orbit Hint */}
      <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-[#0d1117]/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>3D Isometric Voxel Bar Matrix • {bars.length} Voxel Columns</span>
        </div>
        <div className="text-slate-500">
          X = Cloud Region • Z = Fiscal Quarter • Y-Elevation = Recurring Revenue Density
        </div>
      </div>
    </div>
  );
}
