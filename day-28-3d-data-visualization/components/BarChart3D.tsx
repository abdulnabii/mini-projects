'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Bar3DPoint, ColorScheme } from '@/types';

interface Props {
  bars?: Bar3DPoint[];
  colorScheme: ColorScheme;
  isAutoRotate: boolean;
  zoomLevel: number;
  resetViewTrigger: number;
}

export default function BarChart3D({
  bars = [],
  colorScheme,
  isAutoRotate,
  zoomLevel,
  resetViewTrigger,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const barGroupRef = useRef<THREE.Group | null>(null);

  // Handle Zoom
  useEffect(() => {
    if (cameraRef.current) {
      const scale = zoomLevel / 100;
      cameraRef.current.position.set(100 / scale, 110 / scale, 140 / scale);
    }
  }, [zoomLevel]);

  // Handle Reset View
  useEffect(() => {
    if (barGroupRef.current && cameraRef.current) {
      barGroupRef.current.rotation.set(0, 0, 0);
      cameraRef.current.position.set(100, 110, 140);
      cameraRef.current.lookAt(0, 15, 0);
    }
  }, [resetViewTrigger]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 540;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const scale = zoomLevel / 100;
    camera.position.set(100 / scale, 110 / scale, 140 / scale);
    camera.lookAt(0, 15, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.replaceChildren(renderer.domElement);

    const barGroup = new THREE.Group();
    barGroupRef.current = barGroup;

    // 3D Floor Grid
    const gridHelper = new THREE.GridHelper(100, 10, 0x10b981, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Standardized Category Color Mapping
    const regionColors: Record<string, number> = {
      'Americas': 0x10b981,
      'Europe': 0x06b6d4,
      'Asia': 0xa855f7,
      'Middle East': 0xf59e0b,
    };

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
      const barColor = regionColors[b.category || ''] || 0x10b981;

      const boxGeo = new THREE.BoxGeometry(10, barHeight, 10);
      boxGeo.translate(0, barHeight / 2, 0);

      const boxMat = new THREE.MeshPhongMaterial({
        color: barColor,
        emissive: barColor,
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
      if (isDragging && barGroup) {
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
      if (isAutoRotate && !isDragging && barGroup) {
        barGroup.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 540;
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
    <div className="relative w-full h-[540px] rounded-2xl bg-[#04080e] overflow-hidden border border-slate-800 flex items-center justify-center font-mono">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
