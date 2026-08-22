'use client';

import { useState, useEffect } from 'react';
import { Device, Scene, VoiceCommandAction } from '@/types';
import { getStoredDevices, saveDevicesToStorage, PRESET_SCENES } from '@/lib/deviceStore';
import VoiceCommandCenter from '@/components/VoiceCommandCenter';
import SceneBar from '@/components/SceneBar';
import DeviceGrid from '@/components/DeviceGrid';
import DeviceConfigModal from '@/components/DeviceConfigModal';
import {
  Zap,
  Mic,
  Shield,
  Activity,
  Sparkles,
  Sliders,
  Power,
  Layers,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SmartHomeDashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  useEffect(() => {
    setDevices(getStoredDevices());
  }, []);

  const handleUpdateDevice = (id: string, updates: Partial<Device>) => {
    const updated = devices.map((d) =>
      d.id === id ? { ...d, ...updates, lastUpdated: new Date().toISOString() } : d
    );
    setDevices(updated);
    saveDevicesToStorage(updated);
  };

  const handleSaveConfig = (id: string, updates: Partial<Device>) => {
    handleUpdateDevice(id, updates);
  };

  const handleDeleteDevice = (id: string) => {
    const updated = devices.filter((d) => d.id !== id);
    setDevices(updated);
    saveDevicesToStorage(updated);
  };

  const handleBulkUpdate = (bulkChanges: { id: string; changes: Partial<Device> }[]) => {
    const updated = devices.map((d) => {
      const match = bulkChanges.find((c) => c.id === d.id);
      return match ? { ...d, ...match.changes, lastUpdated: new Date().toISOString() } : d;
    });
    setDevices(updated);
    saveDevicesToStorage(updated);
  };

  const handleActivateScene = (scene: Scene) => {
    setActiveSceneId(scene.id);
    const updated = devices.map((d) => {
      const match = scene.deviceUpdates.find((u) => u.deviceId === d.id);
      return match ? { ...d, ...match.updates, lastUpdated: new Date().toISOString() } : d;
    });
    setDevices(updated);
    saveDevicesToStorage(updated);

    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#38bdf8', '#ffaa44'],
    });
  };

  const handleExecuteVoiceActions = (actions: VoiceCommandAction[]) => {
    const updated = devices.map((d) => {
      const action = actions.find((a) => a.deviceId === d.id);
      if (!action) return d;

      const changes: Partial<Device> = { lastUpdated: new Date().toISOString() };
      switch (action.action) {
        case 'TURN_ON':
          changes.isOn = true;
          changes.powerWatts = d.type === 'thermostat' ? 750 : d.type === 'coffee' ? 1200 : 45;
          break;
        case 'TURN_OFF':
          changes.isOn = false;
          changes.powerWatts = 0;
          break;
        case 'SET_BRIGHTNESS':
          changes.brightness = Number(action.value);
          changes.isOn = Number(action.value) > 0;
          break;
        case 'SET_COLOR':
          changes.color = String(action.value);
          break;
        case 'SET_TEMP':
          changes.targetTemperature = Number(action.value);
          break;
        case 'LOCK':
          changes.isLocked = true;
          break;
        case 'UNLOCK':
          changes.isLocked = false;
          break;
        case 'SET_VOLUME':
          changes.volume = Number(action.value);
          break;
      }
      return { ...d, ...changes };
    });

    setDevices(updated);
    saveDevicesToStorage(updated);
  };

  const activeDeviceCount = devices.filter((d) => d.isOn).length;
  const totalPowerDraw = devices.reduce((sum, d) => sum + (d.isOn ? d.powerWatts : 0), 0);

  return (
    <div className="space-y-10 font-mono w-full min-w-0">
      {/* Header Title (Project 9/10/21/22/23 Signature Style) */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VOICE-CONTROLLED SMART HOME ECOSYSTEM</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit">
          Voice-Controlled Smart Home &amp;{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-400">
            Energy Intelligence
          </span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-2xl mx-auto leading-relaxed">
          Speak natural language commands to control smart lights, thermostats, deadbolts, and entertainment zones. Customize hardware configurations and monitor real-time wattage draw.
        </p>
      </div>

      {/* 4 Telemetry Strip Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-5xl mx-auto font-mono text-left">
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-cyan-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1.5">
            <Power className="w-3.5 h-3.5" /> Active Devices
          </span>
          <div className="text-lg font-black text-white">
            {activeDeviceCount} <span className="text-xs font-normal text-slate-400">/ {devices.length} Online</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-amber-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Grid Load
          </span>
          <div className="text-lg font-black text-amber-300">
            {totalPowerDraw.toLocaleString()} <span className="text-xs font-normal text-slate-400">Watts</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-emerald-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Perimeter Lock
          </span>
          <div className="text-lg font-black text-emerald-300">
            {devices.find((d) => d.type === 'lock')?.isLocked ? 'SECURE' : 'UNLOCKED'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-purple-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-purple-400 font-bold uppercase flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5" /> Voice Engine
          </span>
          <div className="text-lg font-black text-purple-300">Gemini 1.5 STT/TTS</div>
        </div>
      </div>

      {/* Voice Command Studio */}
      <VoiceCommandCenter
        currentDevices={devices}
        onExecuteActions={handleExecuteVoiceActions}
      />

      {/* Scene Automation Bar */}
      <SceneBar
        activeSceneId={activeSceneId}
        onActivateScene={handleActivateScene}
      />

      {/* Device Management Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 uppercase">
              DEVICE CONTROLLER
            </span>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Room-by-Room Telemetry
            </h3>
          </div>
          <span className="text-[10px] text-slate-500">
            Click ⚙️ on any device card to edit hardware configuration
          </span>
        </div>

        <DeviceGrid
          devices={devices}
          onUpdateDevice={handleUpdateDevice}
          onBulkUpdate={handleBulkUpdate}
          onOpenConfig={(device) => setEditingDevice(device)}
        />
      </div>

      {/* Device Config Modal */}
      <DeviceConfigModal
        device={editingDevice}
        isOpen={!!editingDevice}
        onClose={() => setEditingDevice(null)}
        onSave={handleSaveConfig}
        onDelete={handleDeleteDevice}
      />
    </div>
  );
}
