'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GraphNode, GraphLink, ColorScheme } from '@/types';

interface Props {
  nodes?: GraphNode[];
  links?: GraphLink[];
  colorScheme: ColorScheme;
  isAutoRotate: boolean;
}

export default function NetworkGraph3D({
  nodes = [],
  links = [],
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
    camera.position.set(0, 0, 160);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.replaceChildren(renderer.domElement);

    const graphGroup = new THREE.Group();

    // Map 3D positions for nodes in an organic spherical cluster
    const nodePositions: Record<string, THREE.Vector3> = {};
    const nodeColors = [0x10b981, 0x06b6d4, 0xa855f7, 0xf59e0b, 0xec4899];

    nodes.forEach((n, idx) => {
      const phi = Math.acos(-1 + (2 * idx) / nodes.length);
      const theta = Math.sqrt(nodes.length * Math.PI) * phi;
      const radius = 45 + (idx % 3) * 12;

      const pos = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
      nodePositions[n.id] = pos;

      const nodeSize = Math.max(3, (n.val / 100) * 6.5);
      const nodeGeo = new THREE.SphereGeometry(nodeSize, 24, 24);
      const nodeColor = nodeColors[idx % nodeColors.length];

      const nodeMat = new THREE.MeshPhongMaterial({
        color: nodeColor,
        emissive: nodeColor,
        emissiveIntensity: 0.4,
        shininess: 80,
      });

      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      mesh.position.copy(pos);
      graphGroup.add(mesh);

      // Outer glow halo
      const haloGeo = new THREE.SphereGeometry(nodeSize * 1.3, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        transparent: true,
        opacity: 0.25,
        wireframe: true,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(pos);
      graphGroup.add(halo);
    });

    // Render 3D connecting edge lines
    links.forEach((l) => {
      const start = nodePositions[l.source];
      const end = nodePositions[l.target];
      if (start && end) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([start, end]);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x06b6d4,
          transparent: true,
          opacity: 0.45,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        graphGroup.add(line);
      }
    });

    scene.add(graphGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 3, 300);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    // Orbit Drag Controls
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
        graphGroup.rotation.y += dx * 0.007;
        graphGroup.rotation.x += dy * 0.007;
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
      if (isAutoRotate && !isDragging) {
        graphGroup.rotation.y += 0.003;
        graphGroup.rotation.x += 0.001;
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
  }, [nodes, links, colorScheme, isAutoRotate]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl bg-[#04080e] overflow-hidden border border-slate-800 flex items-center justify-center font-mono">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Orbit Hint */}
      <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-[#0d1117]/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>3D Force-Directed Network Graph • {nodes.length} Nodes &amp; {links.length} Links</span>
        </div>
        <div className="text-slate-500">
          Node Radius = Valuation/AUM • Co-Investment Syndicate Edges
        </div>
      </div>
    </div>
  );
}
