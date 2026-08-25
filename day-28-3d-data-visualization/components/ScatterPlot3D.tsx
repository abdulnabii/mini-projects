'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Scatter3DPoint, ColorScheme } from '@/types';

interface Props {
  points?: Scatter3DPoint[];
  colorScheme: ColorScheme;
  isAutoRotate: boolean;
}

export default function ScatterPlot3D({
  points = [],
  colorScheme,
  isAutoRotate,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 150);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.replaceChildren(renderer.domElement);

    const swarmGroup = new THREE.Group();

    // 3D Bounding Spatial Box
    const boxGeo = new THREE.BoxGeometry(80, 80, 80);
    const boxMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    scene.add(new THREE.Mesh(boxGeo, boxMat));

    // Particle Colors
    const palette = [0x10b981, 0x06b6d4, 0xa855f7, 0xf59e0b, 0xef4444];

    points.forEach((p, idx) => {
      const geo = new THREE.SphereGeometry(p.size * 0.45, 16, 16);
      const col = palette[idx % palette.length];

      const mat = new THREE.MeshPhongMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 0.5,
        shininess: 90,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(p.x, p.y, p.z);
      swarmGroup.add(mesh);

      // Trailing ring
      const ringGeo = new THREE.RingGeometry(p.size * 0.5, p.size * 0.7, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: col,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(p.x, p.y, p.z);
      swarmGroup.add(ring);
    });

    scene.add(swarmGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x10b981, 2, 200);
    pointLight.position.set(40, 40, 40);
    scene.add(pointLight);

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
        swarmGroup.rotation.y += dx * 0.007;
        swarmGroup.rotation.x += dy * 0.007;
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    const onMouseUp = () => (isDragging = false);

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId: number;
    let clock = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.02;

      if (isAutoRotate && !isDragging) {
        swarmGroup.rotation.y += 0.003;
        swarmGroup.rotation.z += 0.001;
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
  }, [points, colorScheme, isAutoRotate]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl bg-[#04080e] overflow-hidden border border-slate-800 flex items-center justify-center font-mono">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Orbit Hint */}
      <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-[#0d1117]/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span>3D Particle Scatter Swarm • {points.length} Multi-Axis Sensing Nodes</span>
        </div>
        <div className="text-slate-500">
          X/Y/Z = Spatial Coordinate Space • Particle Radius = Sensing Magnitude
        </div>
      </div>
    </div>
  );
}
