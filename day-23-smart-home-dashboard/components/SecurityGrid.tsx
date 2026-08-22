'use client';

import { useState } from 'react';
import { Device } from '@/types';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Camera,
  AlertTriangle,
  Radio,
  Eye,
  BellRing,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  devices: Device[];
  onUpdateDevice: (id: string, updates: Partial<Device>) => void;
}

const CAMERA_FEEDS = [
  {
    id: 'cam_porch',
    name: 'Front Porch Entryway',
    resolution: '4K Ultra HD',
    fps: '30 FPS',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    motion: false,
  },
  {
    id: 'cam_backyard',
    name: 'Backyard Lawn & Pool',
    resolution: '2K QHD',
    fps: '24 FPS',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    motion: false,
  },
  {
    id: 'cam_driveway',
    name: 'Driveway & Garage',
    resolution: '4K Ultra HD',
    fps: '30 FPS',
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80',
    motion: true,
  },
  {
    id: 'cam_living',
    name: 'Living Room Indoor',
    resolution: '1080p Privacy Guard',
    fps: '30 FPS',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    motion: false,
  },
];

export default function SecurityGrid({ devices, onUpdateDevice }: Props) {
  const [isArmed, setIsArmed] = useState(true);

  const lockDevice = devices.find((d) => d.type === 'lock');

  const handlePanicLockdown = () => {
    setIsArmed(true);
    devices
      .filter((d) => d.type === 'lock')
      .forEach((d) => onUpdateDevice(d.id, { isLocked: true }));

    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f97316'],
    });
  };

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* Header & Master Arm Toggle */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-cyan-500/30 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>PERIMETER DEFENSE &amp; SURVEILLANCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
            Security Control Panel
          </h2>
          <p className="text-xs text-slate-400">
            Multi-stream visual surveillance, motion telemetry, and perimeter lock control
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsArmed(!isArmed)}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              isArmed
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isArmed ? 'SYSTEM ARMED' : 'DISARMED'}</span>
          </button>

          <button
            type="button"
            onClick={handlePanicLockdown}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-rose-500/30 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Panic Lockdown</span>
          </button>
        </div>
      </div>

      {/* 4 Camera Video Feeds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CAMERA_FEEDS.map((cam) => (
          <div
            key={cam.id}
            className="rounded-3xl bg-[#0d1117] border border-slate-800 overflow-hidden shadow-xl space-y-3 p-4 hover:border-cyan-500/40 transition-all"
          >
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video border border-slate-800">
              <img
                src={cam.imageUrl}
                alt={cam.name}
                className="w-full h-full object-cover opacity-80"
              />

              {/* Top Stream Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 text-[10px] text-emerald-400 font-bold border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>LIVE</span>
                </span>
                <span className="px-2 py-1 rounded-md bg-black/80 text-[10px] text-slate-300 font-bold border border-white/10">
                  {cam.resolution}
                </span>
              </div>

              {/* Motion Detector Tag */}
              {cam.motion && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/90 text-[10px] text-white font-black animate-pulse shadow-lg">
                  <BellRing className="w-3.5 h-3.5" />
                  <span>MOTION DETECTED</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-1">
              <div>
                <h4 className="font-bold text-white text-sm font-outfit">{cam.name}</h4>
                <span className="text-[10px] text-slate-500">{cam.fps} • Encrypted Stream</span>
              </div>

              <span className="text-xs text-cyan-400 font-bold flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>Monitoring</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
