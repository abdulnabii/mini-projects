'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GraphNode, GraphLink, ColorScheme } from '@/types';

interface Props {
  nodes?: GraphNode[];
  links?: GraphLink[];
  colorScheme: ColorScheme;
  isAutoRotate: boolean;
  zoomLevel: number;
  resetViewTrigger: number;
  onSelectNode?: (node: GraphNode) => void;
}

// Canvas-based crisp text sprite billboard generator
function createNodeLabelSprite(text: string, colorHex: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Frosted dark pill background
    ctx.fillStyle = 'rgba(6, 14, 20, 0.85)';
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(10, 8, canvas.width - 20, 48, 12);
    ctx.fill();
    ctx.stroke();

    // Crisp typography
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px monospace';
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
  sprite.scale.set(16, 3.4, 1);
  return sprite;
}

export default function NetworkGraph3D({
  nodes = [],
  links = [],
  colorScheme,
  isAutoRotate,
  zoomLevel,
  resetViewTrigger,
  onSelectNode,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const graphGroupRef = useRef<THREE.Group | null>(null);

  const [hoveredNode, setHoveredNode] = useState<{
    node: GraphNode;
    connectedNodes: string[];
    linkCount: number;
  } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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
    const groupColorMap: Record<string, { num: number; hex: string }> = {
      'VC': { num: 0x10b981, hex: '#10b981' }, // Emerald: Investors
      'AI Lab': { num: 0x06b6d4, hex: '#06b6d4' }, // Cyan: Core AI
      'Accelerator': { num: 0xa855f7, hex: '#a855f7' }, // Purple: Incubators
      'Data Infra': { num: 0xf59e0b, hex: '#f59e0b' }, // Amber: Infrastructure
      'Dev Platform': { num: 0xec4899, hex: '#ec4899' }, // Rose: Developer Platforms
      'Database': { num: 0x06b6d4, hex: '#06b6d4' },
      'DevTool': { num: 0xec4899, hex: '#ec4899' },
      'Agent Infra': { num: 0xa855f7, hex: '#a855f7' },
      'Search Engine': { num: 0x10b981, hex: '#10b981' },
    };

    // Map 3D positions for nodes in a clustered spherical lattice
    const nodePositions: Record<string, THREE.Vector3> = {};
    const nodeMeshes: THREE.Mesh[] = [];

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

      const nodeSize = Math.max(3.2, (n.val / 100) * 6.8);
      const nodeGeo = new THREE.SphereGeometry(nodeSize, 24, 24);
      const colorInfo = groupColorMap[n.group] || { num: 0x10b981, hex: '#10b981' };

      const nodeMat = new THREE.MeshPhongMaterial({
        color: colorInfo.num,
        emissive: colorInfo.num,
        emissiveIntensity: 0.5,
        shininess: 90,
      });

      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      mesh.position.copy(pos);
      mesh.userData = { node: n };
      nodeMeshes.push(mesh);
      graphGroup.add(mesh);

      // Outer glow halo wireframe
      const haloGeo = new THREE.SphereGeometry(nodeSize * 1.3, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: colorInfo.num,
        transparent: true,
        opacity: 0.28,
        wireframe: true,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(pos);
      graphGroup.add(halo);

      // 3D Text Label Sprite Billboard directly above the node
      const labelSprite = createNodeLabelSprite(n.label, colorInfo.hex);
      labelSprite.position.set(pos.x, pos.y + nodeSize + 3.8, pos.z);
      graphGroup.add(labelSprite);
    });

    // Render 3D connecting edge lines with line metadata
    const lineObjects: { line: THREE.Line; source: string; target: string }[] = [];

    links.forEach((l) => {
      const start = nodePositions[l.source];
      const end = nodePositions[l.target];
      if (start && end) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([start, end]);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x06b6d4,
          transparent: true,
          opacity: 0.55,
          linewidth: 2,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        lineObjects.push({ line, source: l.source, target: l.target });
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

    // Raycaster for Hover & Click Node Picking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let downX = 0;
    let downY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = dom.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes, false);

      if (intersects.length > 0) {
        dom.style.cursor = 'pointer';
        const hitNode = intersects[0].object.userData?.node as GraphNode;
        if (hitNode) {
          // Find connected partner nodes
          const connected = links
            .filter((l) => l.source === hitNode.id || l.target === hitNode.id)
            .map((l) => {
              const partnerId = l.source === hitNode.id ? l.target : l.source;
              const partnerNode = nodes.find((nd) => nd.id === partnerId);
              return partnerNode ? partnerNode.label : partnerId;
            });

          setHoveredNode({
            node: hitNode,
            connectedNodes: connected,
            linkCount: connected.length,
          });
          setTooltipPos({ x: e.clientX - rect.left + 15, y: e.clientY - rect.top - 15 });

          // Highlight connected edges
          lineObjects.forEach(({ line, source, target }) => {
            const isConnected = source === hitNode.id || target === hitNode.id;
            const mat = line.material as THREE.LineBasicMaterial;
            mat.color.setHex(isConnected ? 0x10b981 : 0x1e293b);
            mat.opacity = isConnected ? 1.0 : 0.2;
          });
        }
      } else {
        dom.style.cursor = isDragging ? 'grabbing' : 'grab';
        setHoveredNode(null);

        // Reset edge styling
        lineObjects.forEach(({ line }) => {
          const mat = line.material as THREE.LineBasicMaterial;
          mat.color.setHex(0x06b6d4);
          mat.opacity = 0.55;
        });
      }
    };

    const onClickCanvas = (e: MouseEvent) => {
      if (Math.abs(e.clientX - downX) > 5 || Math.abs(e.clientY - downY) > 5) return;
      const rect = dom.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes, false);
      if (intersects.length > 0) {
        const hitNode = intersects[0].object.userData?.node as GraphNode;
        if (hitNode && onSelectNode) {
          onSelectNode(hitNode);
        }
      }
    };

    // Orbit Drag Controls
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
    dom.addEventListener('click', onClickCanvas);
    dom.addEventListener('mousemove', onPointerMove);
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
      dom.removeEventListener('click', onClickCanvas);
      dom.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [nodes, links, colorScheme, isAutoRotate]);

  return (
    <div className="relative w-full h-[540px] rounded-2xl bg-[#04080e] overflow-hidden border border-[#1e293b] flex items-center justify-center font-mono">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Interactive Telemetry Tooltip for Network Graph */}
      {hoveredNode && (
        <div
          className="absolute pointer-events-none z-30 p-3 rounded-xl bg-[#0b0f19]/95 backdrop-blur-md border border-cyan-500/40 text-xs font-mono shadow-2xl space-y-1.5 transform -translate-y-full animate-in fade-in duration-100 max-w-xs"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-1">
            <span className="font-bold text-white text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              {hoveredNode.node.label}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[9px] font-bold">
              {hoveredNode.node.group}
            </span>
          </div>

          <div className="text-[10px] text-slate-300 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">AUM / Scale Score:</span>
              <strong className="text-emerald-300 font-bold">{hoveredNode.node.val}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Direct Connections:</span>
              <strong className="text-cyan-300 font-bold">{hoveredNode.linkCount} Syndicates</strong>
            </div>

            {/* Connected Partners List */}
            {hoveredNode.connectedNodes.length > 0 && (
              <div className="pt-1 border-t border-[#1e293b]/70 space-y-0.5">
                <span className="text-slate-400 text-[9px] block">Connected Nodes:</span>
                <div className="flex flex-wrap gap-1">
                  {hoveredNode.connectedNodes.slice(0, 4).map((name) => (
                    <span
                      key={name}
                      className="px-1.5 py-0.5 rounded bg-[#111827] text-slate-200 border border-[#1e293b] text-[9px]"
                    >
                      {name}
                    </span>
                  ))}
                  {hoveredNode.connectedNodes.length > 4 && (
                    <span className="text-[9px] text-slate-500">+{hoveredNode.connectedNodes.length - 4} more</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

