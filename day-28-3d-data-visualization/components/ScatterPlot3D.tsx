'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Scatter3DPoint, ColorScheme } from '@/types';

interface Props {
  points?: Scatter3DPoint[];
  colorScheme: ColorScheme;
  isAutoRotate: boolean;
  zoomLevel: number;
  resetViewTrigger: number;
}

export default function ScatterPlot3D({
  points = [],
  colorScheme,
  isAutoRotate,
  zoomLevel,
  resetViewTrigger,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const swarmGroupRef = useRef<THREE.Group | null>(null);

  // Handle Zoom
  useEffect(() => {
    if (cameraRef.current) {
      const baseDist = 150;
      cameraRef.current.position.z = baseDist / (zoomLevel / 100);
    }
  }, [zoomLevel]);

  // Handle Reset View
  useEffect(() => {
    if (swarmGroupRef.current && cameraRef.current) {
      swarmGroupRef.current.rotation.set(0, 0, 0);
      cameraRef.current.position.set(0, 0, 150);
    }
  }, [resetViewTrigger]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 540;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 150 / (zoomLevel / 100));
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.replaceChildren(renderer.domElement);

    const swarmGroup = new THREE.Group();
    swarmGroupRef.current = swarmGroup;

    // 3D Bounding Spatial Box
    const boxGeo = new THREE.BoxGeometry(80, 80, 80);
    const boxMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    scene.add(new THREE.Mesh(boxGeo, boxMat));

    // Standardized Layer Color Map
    const layerColors: Record<string, number> = {
      'Troposphere': 0x10b981, // Emerald: Low altitude
      'Stratosphere': 0x06b6d4, // Cyan: Mid altitude
      'Mesosphere': 0xa855f7, // Purple: High altitude
    };

    points.forEach((p) => {
      const geo = new THREE.SphereGeometry(p.size * 0.45, 16, 16);
      const col = layerColors[p.category] || 0x10b981;

      const mat = new THREE.MeshPhongMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 0.5,
        shininess: 90,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(p.x, p.y, p.z);
      swarmGroup.add(mesh);

      // Trailing halo ring
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
      if (isDragging && swarmGroup) {
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
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isAutoRotate && !isDragging && swarmGroup) {
        swarmGroup.rotation.y += 0.003;
        swarmGroup.rotation.z += 0.001;
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
  }, [points, colorScheme, isAutoRotate]);

  return (
    <div className="relative w-full h-[540px] rounded-2xl bg-[#04080e] overflow-hidden border border-slate-800 flex items-center justify-center font-mono">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
