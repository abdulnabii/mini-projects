'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GraphNode, GraphLink, ColorScheme } from '@/types';

interface Props {
  nodes?: GraphNode[];
  links?: GraphLink[];
  colorScheme: ColorScheme;
  isAutoRotate: boolean;
  zoomLevel: number;
  resetViewTrigger: number;
}

export default function NetworkGraph3D({
  nodes = [],
  links = [],
  colorScheme,
  isAutoRotate,
  zoomLevel,
  resetViewTrigger,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const graphGroupRef = useRef<THREE.Group | null>(null);

  // Handle Zoom
  useEffect(() => {
    if (cameraRef.current) {
      const baseDist = 160;
      cameraRef.current.position.z = baseDist / (zoomLevel / 100);
    }
  }, [zoomLevel]);

  // Handle Reset View
  useEffect(() => {
    if (graphGroupRef.current && cameraRef.current) {
      graphGroupRef.current.rotation.set(0, 0, 0);
      cameraRef.current.position.set(0, 0, 160);
    }
  }, [resetViewTrigger]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 540;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 160 / (zoomLevel / 100));
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.replaceChildren(renderer.domElement);

    const graphGroup = new THREE.Group();
    graphGroupRef.current = graphGroup;

    // Standardized Category Color Mapping
    const groupColorMap: Record<string, number> = {
      'VC': 0x10b981, // Emerald: Investors
      'AI Lab': 0x06b6d4, // Cyan: Core AI
      'Accelerator': 0xa855f7, // Purple: Incubators
      'Data Infra': 0xf59e0b, // Amber: Infrastructure
      'Dev Platform': 0xec4899, // Rose: Developer Platforms
      'Database': 0x06b6d4,
      'DevTool': 0xec4899,
      'Agent Infra': 0xa855f7,
      'Search Engine': 0x10b981,
    };

    // Map 3D positions for nodes in a clustered spherical lattice
    const nodePositions: Record<string, THREE.Vector3> = {};

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
      const nodeColor = groupColorMap[n.group] || 0x10b981;

      const nodeMat = new THREE.MeshPhongMaterial({
        color: nodeColor,
        emissive: nodeColor,
        emissiveIntensity: 0.45,
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
          opacity: 0.5,
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
      if (isDragging && graphGroup) {
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
      if (isAutoRotate && !isDragging && graphGroup) {
        graphGroup.rotation.y += 0.003;
        graphGroup.rotation.x += 0.001;
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
  }, [nodes, links, colorScheme, isAutoRotate]);

  return (
    <div className="relative w-full h-[540px] rounded-2xl bg-[#04080e] overflow-hidden border border-slate-800 flex items-center justify-center font-mono">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
