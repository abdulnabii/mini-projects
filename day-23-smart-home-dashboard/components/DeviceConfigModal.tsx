'use client';

import { useState, useEffect } from 'react';
import { Device, Room, DeviceType } from '@/types';
import {
  Settings,
  X,
  Save,
  Trash2,
  Zap,
  Sliders,
  Home,
  CheckCircle2,
  Sparkles,
  Camera,
  Palette,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  device: Device | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Device>) => void;
  onDelete?: (id: string) => void;
}

const ROOM_OPTIONS: Exclude<Room, 'All Rooms'>[] = [
  'Living Room',
  'Master Bedroom',
  'Kitchen',
  'Home Office',
  'Security & Entry',
  'Patio & Outdoor',
];

const DEVICE_TYPES: { type: DeviceType; label: string }[] = [
  { type: 'light', label: 'Smart Dimmable / RGB Light' },
  { type: 'thermostat', label: 'Climate Thermostat' },
  { type: 'lock', label: 'Smart Deadbolt / Lock' },
  { type: 'camera', label: 'Security Camera' },
  { type: 'speaker', label: 'Smart Speaker / Soundbar' },
  { type: 'coffee', label: 'Smart Appliance (Espresso / Plug)' },
];

export default function DeviceConfigModal({
  device,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState<Exclude<Room, 'All Rooms'>>('Living Room');
  const [type, setType] = useState<DeviceType>('light');
  const [powerWatts, setPowerWatts] = useState(35);
  const [color, setColor] = useState('#06b6d4');
  const [cameraFeedUrl, setCameraFeedUrl] = useState('');

  useEffect(() => {
    if (device) {
      setName(device.name);
      setRoom(device.room);
      setType(device.type);
      setPowerWatts(device.powerWatts || 35);
      setColor(device.color || '#06b6d4');
      setCameraFeedUrl(device.cameraFeedUrl || '');
    }
  }, [device]);

  if (!isOpen || !device) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(device.id, {
      name: name.trim(),
      room,
      type,
      powerWatts,
      color: type === 'light' ? color : undefined,
      cameraFeedUrl: type === 'camera' ? cameraFeedUrl : undefined,
    });

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#10b981', '#38bdf8'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0d1117] border-2 border-cyan-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">
                Edit Device Configuration
              </h3>
              <p className="text-xs text-slate-400">
                Customize hardware parameters, room allocation &amp; telemetry
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Device Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase">
              Device Name (Voice AI Target)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Master Bedroom Chandelier"
              className="w-full p-3 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              required
            />
          </div>

          {/* Room & Type Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase">
                Assigned Room / Zone
              </label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white focus:outline-none cursor-pointer"
              >
                {ROOM_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase">
                Device Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white focus:outline-none cursor-pointer"
              >
                {DEVICE_TYPES.map((t) => (
                  <option key={t.type} value={t.type}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Power Draw Rating */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Rated Power Load (Watts)</span>
              </label>
              <span className="text-cyan-400 font-bold">{powerWatts} Watts</span>
            </div>
            <input
              type="number"
              min="0"
              max="4000"
              value={powerWatts}
              onChange={(e) => setPowerWatts(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white focus:outline-none"
            />
            <p className="text-[10px] text-slate-500">
              Used for live real-time wattage telemetry and monthly utility estimations.
            </p>
          </div>

          {/* Light Color Preset (If light) */}
          {type === 'light' && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                <Palette className="w-3 h-3 text-cyan-400" />
                <span>Default Ambient Color (Hex)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white uppercase focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Camera Feed URL (If camera) */}
          {type === 'camera' && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                <Camera className="w-3 h-3 text-cyan-400" />
                <span>RTSP / MJPEG Camera Stream URL</span>
              </label>
              <input
                type="text"
                value={cameraFeedUrl}
                onChange={(e) => setCameraFeedUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or rtsp://192.168.1.150/live"
                className="w-full p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 focus:outline-none"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(device.id);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Device</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-black font-extrabold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
