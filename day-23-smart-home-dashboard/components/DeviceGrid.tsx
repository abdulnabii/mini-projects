'use client';

import { useState } from 'react';
import { Device, Room } from '@/types';
import DeviceCard from './DeviceCard';
import {
  SlidersHorizontal,
  Home,
  Tv,
  Bed,
  Utensils,
  Briefcase,
  Shield,
  Sun,
  Power,
  Lock,
} from 'lucide-react';

interface Props {
  devices: Device[];
  onUpdateDevice: (id: string, updates: Partial<Device>) => void;
  onBulkUpdate: (updates: { id: string; changes: Partial<Device> }[]) => void;
  onOpenConfig?: (device: Device) => void;
}

const ROOM_FILTERS: { room: Room; icon: any }[] = [
  { room: 'All Rooms', icon: Home },
  { room: 'Living Room', icon: Tv },
  { room: 'Master Bedroom', icon: Bed },
  { room: 'Kitchen', icon: Utensils },
  { room: 'Home Office', icon: Briefcase },
  { room: 'Security & Entry', icon: Shield },
  { room: 'Patio & Outdoor', icon: Sun },
];

export default function DeviceGrid({
  devices,
  onUpdateDevice,
  onBulkUpdate,
  onOpenConfig,
}: Props) {
  const [selectedRoom, setSelectedRoom] = useState<Room>('All Rooms');

  const filteredDevices =
    selectedRoom === 'All Rooms'
      ? devices
      : devices.filter((d) => d.room === selectedRoom);

  const handleTurnOffAllLights = () => {
    const lightUpdates = devices
      .filter((d) => d.type === 'light')
      .map((d) => ({ id: d.id, changes: { isOn: false, powerWatts: 0 } }));
    onBulkUpdate(lightUpdates);
  };

  const handleLockAllDoors = () => {
    const lockUpdates = devices
      .filter((d) => d.type === 'lock')
      .map((d) => ({ id: d.id, changes: { isLocked: true } }));
    onBulkUpdate(lockUpdates);
  };

  return (
    <div className="space-y-6 font-mono w-full min-w-0">
      {/* Top Filter Bar & Bulk Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Room Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {ROOM_FILTERS.map((f) => {
            const Icon = f.icon;
            const isSelected = selectedRoom === f.room;
            const count =
              f.room === 'All Rooms'
                ? devices.length
                : devices.filter((d) => d.room === f.room).length;

            return (
              <button
                key={f.room}
                type="button"
                onClick={() => setSelectedRoom(f.room)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-black font-black shadow-md shadow-cyan-500/20'
                    : 'bg-[#0d1117] border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{f.room}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Bulk Control Buttons */}
        <div className="flex items-center gap-2 shrink-0 text-xs">
          <button
            type="button"
            onClick={handleTurnOffAllLights}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Power className="w-3 h-3 text-rose-400" />
            <span>All Lights Off</span>
          </button>

          <button
            type="button"
            onClick={handleLockAllDoors}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Lock Doors</span>
          </button>
        </div>
      </div>

      {/* Grid of Devices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDevices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onUpdateDevice={onUpdateDevice}
            onOpenConfig={onOpenConfig}
          />
        ))}
      </div>
    </div>
  );
}
