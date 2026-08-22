'use client';

import { Device } from '@/types';
import {
  Lightbulb,
  Thermometer,
  Lock,
  Unlock,
  Camera,
  Coffee,
  Volume2,
  Power,
  Zap,
  Flame,
  Snowflake,
  Leaf,
  Sliders,
  Radio,
} from 'lucide-react';

interface Props {
  device: Device;
  onUpdateDevice: (id: string, updates: Partial<Device>) => void;
}

const COLOR_PRESETS = [
  { name: 'Warm Amber', hex: '#ffaa44' },
  { name: 'Cyber Cyan', hex: '#06b6d4' },
  { name: 'Rose Glow', hex: '#f43f5e' },
  { name: 'Crisp Daylight', hex: '#ffffff' },
];

export default function DeviceCard({ device, onUpdateDevice }: Props) {
  const togglePower = () => {
    const nextOn = !device.isOn;
    onUpdateDevice(device.id, {
      isOn: nextOn,
      powerWatts: nextOn ? (device.type === 'thermostat' ? 750 : device.type === 'coffee' ? 1200 : 35) : 0,
    });
  };

  const toggleLock = () => {
    onUpdateDevice(device.id, {
      isLocked: !device.isLocked,
    });
  };

  const adjustTemp = (delta: number) => {
    const current = device.targetTemperature || 70;
    const nextTemp = Math.min(85, Math.max(60, current + delta));
    onUpdateDevice(device.id, { targetTemperature: nextTemp });
  };

  const getDeviceIcon = () => {
    switch (device.type) {
      case 'light':
        return Lightbulb;
      case 'thermostat':
        return Thermometer;
      case 'lock':
        return device.isLocked ? Lock : Unlock;
      case 'camera':
        return Camera;
      case 'coffee':
        return Coffee;
      case 'speaker':
        return Volume2;
      default:
        return Zap;
    }
  };

  const Icon = getDeviceIcon();

  return (
    <div
      className={`p-5 rounded-3xl border transition-all space-y-4 font-mono shadow-xl relative overflow-hidden ${
        device.isOn
          ? 'bg-[#0d1117] border-cyan-500/30 hover:border-cyan-500/60'
          : 'bg-[#080d14] border-slate-850 opacity-80 hover:opacity-100'
      }`}
    >
      {/* Top Bar: Icon + Room + Power Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
              device.isOn
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
            style={{
              color: device.type === 'light' && device.isOn ? device.color : undefined,
            }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">
              {device.room}
            </span>
            <h4 className="font-bold text-white text-xs font-outfit truncate max-w-[140px]">
              {device.name}
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={togglePower}
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            device.isOn
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-white'
          }`}
          title={device.isOn ? 'Turn Off' : 'Turn On'}
        >
          <Power className="w-4 h-4" />
        </button>
      </div>

      {/* Device-Specific Controls */}

      {/* 1. SMART LIGHT */}
      {device.type === 'light' && (
        <div className="space-y-3 pt-1">
          {/* Brightness Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Brightness</span>
              <span className="text-cyan-400 font-bold">{device.brightness || 0}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={device.brightness || 0}
              onChange={(e) =>
                onUpdateDevice(device.id, {
                  brightness: Number(e.target.value),
                  isOn: Number(e.target.value) > 0,
                  powerWatts: Math.round((Number(e.target.value) / 100) * 45),
                })
              }
            />
          </div>

          {/* Color Presets */}
          <div className="flex items-center gap-1.5 pt-1">
            {COLOR_PRESETS.map((col) => (
              <button
                key={col.hex}
                type="button"
                onClick={() => onUpdateDevice(device.id, { color: col.hex, isOn: true })}
                className="w-5 h-5 rounded-full border border-white/20 transition-transform hover:scale-110 cursor-pointer"
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. SMART THERMOSTAT */}
      {device.type === 'thermostat' && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between bg-[#161b22] p-3 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Current Temp</span>
              <span className="text-xl font-black text-white">{device.temperature}°F</span>
            </div>

            {/* Setpoint Stepper */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustTemp(-1)}
                className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-white font-black hover:border-cyan-500/50 cursor-pointer"
              >
                -
              </button>
              <div className="text-center px-1">
                <span className="text-xs font-bold text-cyan-400 block">{device.targetTemperature}°F</span>
                <span className="text-[8px] text-slate-500">Target</span>
              </div>
              <button
                type="button"
                onClick={() => adjustTemp(1)}
                className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-white font-black hover:border-cyan-500/50 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* HVAC Mode Switcher */}
          <div className="grid grid-cols-3 gap-1 text-[10px]">
            {(['cool', 'heat', 'eco'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onUpdateDevice(device.id, { hvacMode: mode, isOn: true })}
                className={`py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  device.hvacMode === mode
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. SMART LOCK */}
      {device.type === 'lock' && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#161b22] border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Deadbolt Status</span>
              <span className={`text-xs font-black ${device.isLocked ? 'text-emerald-400' : 'text-rose-400'}`}>
                {device.isLocked ? 'SECURELY LOCKED' : 'UNLOCKED / OPEN'}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleLock}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                device.isLocked
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-emerald-500 text-black shadow-md'
              }`}
            >
              {device.isLocked ? 'Unlock' : 'Lock Door'}
            </button>
          </div>
        </div>
      )}

      {/* 4. SMART CAMERA */}
      {device.type === 'camera' && (
        <div className="space-y-2 pt-1">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-24">
            {device.cameraFeedUrl && (
              <img
                src={device.cameraFeedUrl}
                alt={device.name}
                className="w-full h-full object-cover opacity-70"
              />
            )}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/70 text-[9px] text-emerald-400 font-bold border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE FEED</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. SMART SPEAKER / TV */}
      {device.type === 'speaker' && (
        <div className="space-y-2 pt-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Audio Volume</span>
            <span className="text-cyan-400 font-bold">{device.volume || 0}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={device.volume || 0}
            onChange={(e) => onUpdateDevice(device.id, { volume: Number(e.target.value) })}
          />
        </div>
      )}

      {/* 6. COFFEE MAKER */}
      {device.type === 'coffee' && (
        <div className="p-3 rounded-2xl bg-[#161b22] border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Brew State</span>
            <span className="text-white font-bold">{device.isOn ? 'Warming Boiler (93°C)' : 'Standby Mode'}</span>
          </div>
          <span className={`text-[10px] font-bold ${device.isOn ? 'text-emerald-400' : 'text-slate-500'}`}>
            {device.isOn ? 'READY' : 'OFF'}
          </span>
        </div>
      )}

      {/* Bottom Telemetry Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>{device.isOn ? `${device.powerWatts}W` : '0W Idle'}</span>
        </span>
        <span className="text-slate-500">Zigbee 3.0 / MQTT</span>
      </div>
    </div>
  );
}
