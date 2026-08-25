'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GeoDataPoint, GeoArcConnection, ColorScheme } from '@/types';

interface Props {
  points?: GeoDataPoint[];
  arcs?: GeoArcConnection[];
  colorScheme: ColorScheme;
  isAutoRotate: boolean;
  onSelectPoint?: (point: GeoDataPoint) => void;
}

export default function Globe3D({
  points = [],
  arcs = [],
  colorScheme,
  isAutoRotate,
  onSelectPoint,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<GeoDataPoint | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 550;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 180;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.replaceChildren(renderer.domElement);

    // Primary Globe Sphere
    const globeRadius = 50;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    
    // Theme color palette
    const baseColor = colorScheme === 'HEAT' ? 0x1f140e : colorScheme === 'CYBERPUNK' ? 0x0a101f : 0x06140e;
    const wireColor = colorScheme === 'HEAT' ? 0xf97316 : colorScheme === 'CYBERPUNK' ? 0x06b6d4 : 0x10b981;
    const spikeColor = colorScheme === 'HEAT' ? 0xef4444 : colorScheme === 'CYBERPUNK' ? 0xa855f7 : 0x10b981;

    const globeMaterial = new THREE.MeshPhongMaterial({
      color: baseColor,
      emissive: 0x04080e,
      wireframe: false,
      shininess: 40,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Wireframe Grid Mesh Overlay
    const wireframeGeo = new THREE.SphereGeometry(globeRadius + 0.2, 32, 32);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: wireColor,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    scene.add(wireframeMesh);

    // Atmosphere Glow Shield
    const atmosGeo = new THREE.SphereGeometry(globeRadius * 1.15, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: wireColor,
      transparent: true,
      opacity: 0.06,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(atmosGeo, atmosMat));

    // Convert Lat/Lng to Vector3 on Sphere
    const latLngToVector = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    // Add Geographic Spike Beacons
    const spikeGroup = new THREE.Group();
    const pointMeshes: { mesh: THREE.Mesh; pointData: GeoDataPoint }[] = [];

    points.forEach((p) => {
      const pos = latLngToVector(p.lat, p.lng, globeRadius);
      const spikeHeight = Math.max(4, (p.value / 100) * 20);

      // Spike cylinder
      const cylinderGeo = new THREE.CylinderGeometry(0.5, 1.2, spikeHeight, 8);
      cylinderGeo.translate(0, spikeHeight / 2, 0);
      cylinderGeo.rotateX(Math.PI / 2);

      const cylinderMat = new THREE.MeshPhongMaterial({
        color: spikeColor,
        emissive: spikeColor,
        emissiveIntensity: 0.6,
        shininess: 60,
      });

      const spike = new THREE.Mesh(cylinderGeo, cylinderMat);
      spike.position.copy(pos);
      spike.lookAt(0, 0, 0);

      // Top glowing head sphere
      const headGeo = new THREE.SphereGeometry(1.6, 16, 16);
      const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.copy(latLngToVector(p.lat, p.lng, globeRadius + spikeHeight));

      spikeGroup.add(spike);
      spikeGroup.add(head);
      pointMeshes.push({ mesh: head, pointData: p });
    });

    scene.add(spikeGroup);

    // Add Flight Path Orbital Arcs
    const arcGroup = new THREE.Group();
    arcs.forEach((arc) => {
      const start = latLngToVector(arc.fromLat, arc.fromLng, globeRadius);
      const end = latLngToVector(arc.toLat, arc.toLng, globeRadius);

      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const dist = start.distanceTo(end);
      mid.setLength(globeRadius + dist * 0.4);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const curvePoints = curve.getPoints(32);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const curveMat = new THREE.LineBasicMaterial({
        color: wireColor,
        transparent: true,
        opacity: 0.6,
      });

      const line = new THREE.Line(curveGeo, curveMat);
      arcGroup.add(line);
    });

    scene.add(arcGroup);

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(100, 100, 100);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(wireColor, 1.5);
    dirLight2.position.set(-100, -50, -50);
    scene.add(dirLight2);

    // Mouse Interaction & Rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        globe.rotation.y += deltaX * 0.006;
        globe.rotation.x += deltaY * 0.006;
        wireframeMesh.rotation.y = globe.rotation.y;
        wireframeMesh.rotation.x = globe.rotation.x;
        spikeGroup.rotation.y = globe.rotation.y;
        spikeGroup.rotation.x = globe.rotation.x;
        arcGroup.rotation.y = globe.rotation.y;
        arcGroup.rotation.x = globe.rotation.x;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseUp = () => (isDragging = false);

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isAutoRotate && !isDragging) {
        globe.rotation.y += 0.003;
        wireframeMesh.rotation.y += 0.003;
        spikeGroup.rotation.y += 0.003;
        arcGroup.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [points, arcs, colorScheme, isAutoRotate]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl bg-[#04080e] overflow-hidden border border-slate-800 flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Orbit Hint & Legend Overlay */}
      <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-[#0d1117]/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Interactive 3D Earth Sphere • Drag to Orbit / Rotate</span>
        </div>
        <div className="text-slate-500">
          Spike Height = Metric Magnitude • Arcs = Global Flightpaths
        </div>
      </div>
    </div>
  );
}
