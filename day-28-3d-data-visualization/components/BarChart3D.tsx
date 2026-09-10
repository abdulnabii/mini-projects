'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Bar3DPoint, ColorScheme } from '@/types';

interface Props {
  bars?: Bar3DPoint[];
  colorScheme: ColorScheme;
  isAutoRotate: boolean;
  zoomLevel: number;
  resetViewTrigger: number;
  onSelectBar?: (bar: Bar3DPoint) => void;
}

// Canvas-based crisp text billboard sprite
function createBarLabelSprite(text: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 240;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(11, 15, 25, 0.85)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(8, 8, canvas.width - 16, 48, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, 32);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(12, 3.2, 1);
  return sprite;
}

export default function BarChart3D({
  bars = [],
  colorScheme,
  isAutoRotate,
  zoomLevel,
  resetViewTrigger,
  onSelectBar,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const barGroupRef = useRef<THREE.Group | null>(null);

  const [hoveredBar, setHoveredBar] = useState<Bar3DPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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

    // Render 3D Voxel Pillars with raycast userData
    const numCols = 5;
    const spacing = 16;
    const offset = ((numCols - 1) * spacing) / 2;
    const barMeshes: THREE.Mesh[] = [];

    const maxVal = Math.max(...bars.map((b) => b.value || 0), 1);

    bars.forEach((b, idx) => {
      const row = Math.floor(idx / numCols);
      const col = idx % numCols;

      const posX = col * spacing - offset;
      const posZ = row * spacing - offset;
      const normalizedRatio = Math.min(1, Math.max(0.08, (b.value || 0) / maxVal));
      const barHeight = 6 + normalizedRatio * 54;
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
      mesh.userData = { bar: b };
      barMeshes.push(mesh);
      barGroup.add(mesh);

      // Top Cap Neon Frame
      const capGeo = new THREE.BoxGeometry(10.2, 0.8, 10.2);
      capGeo.translate(0, barHeight + 0.4, 0);
      const capMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(posX, 0, posZ);
      cap.userData = { bar: b };
      barMeshes.push(cap);
      barGroup.add(cap);

      // Add 3D text label above peak bars
      if (idx % 2 === 0 || b.value > 80) {
        const sprite = createBarLabelSprite(`${b.zLabel}: $${b.value}k`);
        sprite.position.set(posX, barHeight + 4.5, posZ);
        barGroup.add(sprite);
      }
    });

    scene.add(barGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(80, 150, 100);
    scene.add(dirLight);

    // Raycaster for Voxel Hover & Tooltip Picking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let downX = 0;
    let downY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = dom.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(barMeshes, false);

      if (intersects.length > 0) {
        dom.style.cursor = 'pointer';
        const hitBar = intersects[0].object.userData?.bar as Bar3DPoint;
        if (hitBar) {
          setHoveredBar(hitBar);
          setTooltipPos({ x: e.clientX - rect.left + 15, y: e.clientY - rect.top - 15 });
        }
      } else {
        dom.style.cursor = isDragging ? 'grabbing' : 'grab';
        setHoveredBar(null);
      }
    };

    const onClickCanvas = (e: MouseEvent) => {
      if (Math.abs(e.clientX - downX) > 5 || Math.abs(e.clientY - downY) > 5) return;
      const rect = dom.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(barMeshes, false);
      if (intersects.length > 0) {
        const hitBar = intersects[0].object.userData?.bar as Bar3DPoint;
        if (hitBar && onSelectBar) {
          onSelectBar(hitBar);
        }
      }
    };

    // Drag Orbit Controls
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      downX = e.clientX;
      downY = e.clientY;
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
    dom.addEventListener('click', onClickCanvas);
    dom.addEventListener('mousemove', onPointerMove);
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
      dom.removeEventListener('click', onClickCanvas);
      dom.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [bars, colorScheme, isAutoRotate]);

  return (
    <div className="relative w-full h-[540px] rounded-2xl bg-[#04080e] overflow-hidden border border-[#1e293b] flex items-center justify-center font-mono">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Telemetry Tooltip for Voxel Bar */}
      {hoveredBar && (
        <div
          className="absolute pointer-events-none z-30 p-3 rounded-xl bg-[#0b0f19]/95 backdrop-blur-md border border-emerald-500/40 text-xs font-mono shadow-2xl space-y-1 transform -translate-y-full animate-in fade-in duration-100 max-w-xs"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-1">
            <span className="font-bold text-white text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {hoveredBar.xLabel}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
              {hoveredBar.zLabel}
            </span>
          </div>

          <div className="text-[10px] text-slate-300 space-y-0.5">
            <div>Column (Region): <strong className="text-white font-mono">{hoveredBar.xLabel}</strong></div>
            <div>Row (Quarter): <strong className="text-cyan-300 font-mono">{hoveredBar.zLabel}</strong></div>
            <div>MRR / Metric Value: <strong className="text-emerald-300 font-bold">${hoveredBar.value.toLocaleString()}k</strong></div>
            {hoveredBar.category && (
              <div className="text-slate-500 text-[9px] uppercase tracking-wider">{hoveredBar.category} Region</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

