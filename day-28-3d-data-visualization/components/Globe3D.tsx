'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GeoDataPoint, GeoArcConnection, ColorScheme } from '@/types';

interface Props {
  points?: GeoDataPoint[];
  arcs?: GeoArcConnection[];
  colorScheme: ColorScheme;
  isAutoRotate: boolean;
  zoomLevel: number;
  resetViewTrigger: number;
  onSelectPoint?: (point: GeoDataPoint) => void;
}

// Procedural Earth Continents Canvas Texture Generator
function createEarthContinentTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Deep ocean base
    ctx.fillStyle = '#060e14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw continent landmass silhouettes (Approximated geo polygon contours)
    ctx.fillStyle = '#10b98126'; // Faint emerald continent fill
    ctx.strokeStyle = '#10b98180'; // Glowing land contour border
    ctx.lineWidth = 2;

    // North America
    ctx.beginPath();
    ctx.ellipse(280, 160, 110, 70, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // South America
    ctx.beginPath();
    ctx.ellipse(340, 320, 60, 100, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Europe
    ctx.beginPath();
    ctx.ellipse(540, 150, 65, 45, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Africa
    ctx.beginPath();
    ctx.ellipse(550, 270, 75, 95, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Asia
    ctx.beginPath();
    ctx.ellipse(730, 170, 140, 85, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Australia & Oceania
    ctx.beginPath();
    ctx.ellipse(840, 350, 60, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Continent Grid Dots Overlay
    ctx.fillStyle = '#10b98155';
    for (let x = 0; x < canvas.width; x += 16) {
      for (let y = 0; y < canvas.height; y += 16) {
        if (ctx.isPointInPath(x, y)) {
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export default function Globe3D({
  points = [],
  arcs = [],
  colorScheme,
  isAutoRotate,
  zoomLevel,
  resetViewTrigger,
  onSelectPoint,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);

  // Handle Zoom adjustments
  useEffect(() => {
    if (cameraRef.current) {
      const baseDistance = 180;
      cameraRef.current.position.z = baseDistance / (zoomLevel / 100);
    }
  }, [zoomLevel]);

  // Handle Reset View
  useEffect(() => {
    if (globeGroupRef.current && cameraRef.current) {
      globeGroupRef.current.rotation.set(0, 0, 0);
      cameraRef.current.position.set(0, 0, 180);
    }
  }, [resetViewTrigger]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 550;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 180 / (zoomLevel / 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.replaceChildren(renderer.domElement);

    const mainGlobeGroup = new THREE.Group();
    globeGroupRef.current = mainGlobeGroup;

    // Primary Globe Sphere with Procedural Earth Continents
    const globeRadius = 50;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    const continentTexture = createEarthContinentTexture();

    const wireColor = colorScheme === 'HEAT' ? 0xf97316 : colorScheme === 'CYBERPUNK' ? 0x06b6d4 : 0x10b981;
    const spikeColor = colorScheme === 'HEAT' ? 0xef4444 : colorScheme === 'CYBERPUNK' ? 0x06b6d4 : 0x10b981;

    const globeMaterial = new THREE.MeshPhongMaterial({
      map: continentTexture,
      color: 0x08131e,
      emissive: 0x04080e,
      wireframe: false,
      shininess: 50,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    mainGlobeGroup.add(globe);

    // Wireframe Latitude/Longitude Grid Mesh Overlay
    const wireframeGeo = new THREE.SphereGeometry(globeRadius + 0.25, 36, 36);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: wireColor,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    mainGlobeGroup.add(wireframeMesh);

    // Atmosphere Glow Shield
    const atmosGeo = new THREE.SphereGeometry(globeRadius * 1.14, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: wireColor,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    mainGlobeGroup.add(new THREE.Mesh(atmosGeo, atmosMat));

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

    // Category Color Mapping for Consistent Encoding
    const categoryColors: Record<string, number> = {
      'North America': 0x10b981,
      'Europe': 0x06b6d4,
      'Asia': 0xa855f7,
      'Middle East': 0xf59e0b,
      'South America': 0x10b981,
      'Oceania': 0xec4899,
      'Africa': 0xf59e0b,
    };

    // Add Geographic Spike Beacons
    points.forEach((p) => {
      const pos = latLngToVector(p.lat, p.lng, globeRadius);
      const spikeHeight = Math.max(4, (p.value / 100) * 22);
      const col = categoryColors[p.category || ''] || spikeColor;

      // Spike cylinder
      const cylinderGeo = new THREE.CylinderGeometry(0.4, 1.2, spikeHeight, 8);
      cylinderGeo.translate(0, spikeHeight / 2, 0);
      cylinderGeo.rotateX(Math.PI / 2);

      const cylinderMat = new THREE.MeshPhongMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 0.6,
        shininess: 80,
      });

      const spike = new THREE.Mesh(cylinderGeo, cylinderMat);
      spike.position.copy(pos);
      spike.lookAt(0, 0, 0);

      // Top glowing head sphere
      const headGeo = new THREE.SphereGeometry(1.6, 16, 16);
      const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.copy(latLngToVector(p.lat, p.lng, globeRadius + spikeHeight));

      mainGlobeGroup.add(spike);
      mainGlobeGroup.add(head);
    });

    // Add Flight Path Orbital Arcs
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
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.7,
      });

      const line = new THREE.Line(curveGeo, curveMat);
      mainGlobeGroup.add(line);
    });

    scene.add(mainGlobeGroup);

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
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
      if (isDragging && mainGlobeGroup) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        mainGlobeGroup.rotation.y += deltaX * 0.006;
        mainGlobeGroup.rotation.x += deltaY * 0.006;
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

      if (isAutoRotate && !isDragging && mainGlobeGroup) {
        mainGlobeGroup.rotation.y += 0.003;
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
    <div className="relative w-full h-[540px] rounded-2xl bg-[#04080e] overflow-hidden border border-slate-800 flex items-center justify-center font-mono">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
