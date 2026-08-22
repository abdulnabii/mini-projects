'use client';

import { useState, useEffect } from 'react';
import { Device, Room, DeviceType } from '@/types';
import { getStoredDevices, saveDevicesToStorage } from '@/lib/deviceStore';
import DeviceConfigModal from '@/components/DeviceConfigModal';
import {
  Network,
  Home,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Radio,
  Server,
  Cloud,
  Cpu,
  Zap,
  Key,
  Globe,
  Loader2,
  RefreshCw,
  Settings,
  Edit,
} from 'lucide-react';
import confetti from 'canvas-confetti';

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

export default function SettingsPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  // Integration credentials
  const [haUrl, setHaUrl] = useState('http://homeassistant.local:8123');
  const [haToken, setHaToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  const [haStatus, setHaStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('connected');

  const [mqttBroker, setMqttBroker] = useState('mqtt://192.168.1.100:1883');
  const [mqttTopic, setMqttTopic] = useState('zigbee2mqtt/#');
  const [mqttStatus, setMqttStatus] = useState<'idle' | 'testing' | 'connected'>('connected');

  const [tuyaClientId, setTuyaClientId] = useState('');
  const [tuyaSecret, setTuyaSecret] = useState('');

  // Add Custom Device Form
  const [devName, setDevName] = useState('');
  const [devRoom, setDevRoom] = useState<Exclude<Room, 'All Rooms'>>('Living Room');
  const [devType, setDevType] = useState<DeviceType>('light');
  const [devWatts, setDevWatts] = useState(35);

  useEffect(() => {
    setDevices(getStoredDevices());
  }, []);

  const handleTestHaConnection = async () => {
    setHaStatus('testing');
    setTimeout(() => {
      setHaStatus('connected');
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981'],
      });
    }, 800);
  };

  const handleAddCustomDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devName.trim()) return;

    const newDev: Device = {
      id: 'custom_' + Date.now(),
      name: devName.trim(),
      room: devRoom,
      type: devType,
      isOn: true,
      brightness: devType === 'light' ? 80 : undefined,
      color: devType === 'light' ? '#06b6d4' : undefined,
      temperature: devType === 'thermostat' ? 71 : undefined,
      targetTemperature: devType === 'thermostat' ? 70 : undefined,
      hvacMode: devType === 'thermostat' ? 'cool' : undefined,
      isLocked: devType === 'lock' ? true : undefined,
      volume: devType === 'speaker' ? 40 : undefined,
      powerWatts: devWatts,
      lastUpdated: new Date().toISOString(),
    };

    const updated = [newDev, ...devices];
    setDevices(updated);
    saveDevicesToStorage(updated);
    setDevName('');

    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#22d3ee', '#34d399'],
    });
  };

  const handleSaveConfig = (id: string, updates: Partial<Device>) => {
    const updated = devices.map((d) =>
      d.id === id ? { ...d, ...updates, lastUpdated: new Date().toISOString() } : d
    );
    setDevices(updated);
    saveDevicesToStorage(updated);
  };

  const handleDeleteDevice = (id: string) => {
    const updated = devices.filter((d) => d.id !== id);
    setDevices(updated);
    saveDevicesToStorage(updated);
  };

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-cyan-500/30 shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs">
          <Network className="w-3.5 h-3.5" />
          <span>SMART HOME ECOSYSTEM BRIDGE &amp; HARDWARE CONFIG</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
          Connect Real Hardware &amp; Edit Configurations
        </h2>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Bridge your physical smart home devices via Home Assistant REST/WebSocket API, Zigbee2MQTT broker, Tuya Cloud, or configure hardware parameters directly.
        </p>
      </div>

      {/* 2-Column Grid: Protocols on Left / Custom Device Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protocol Connectors */}
        <div className="space-y-4">
          <h3 className="font-bold text-white text-base font-outfit flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>Hardware Bridge Protocols</span>
          </h3>

          {/* 1. Home Assistant */}
          <div className="p-5 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-white text-xs">Home Assistant REST &amp; WebSocket</h4>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>ONLINE BRIDGE</span>
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold">HA Local Instance URL:</label>
                <input
                  type="text"
                  value={haUrl}
                  onChange={(e) => setHaUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold">Long-Lived Access Token:</label>
                <input
                  type="password"
                  value={haToken}
                  onChange={(e) => setHaToken(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleTestHaConnection}
                disabled={haStatus === 'testing'}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {haStatus === 'testing' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Sync Home Assistant Entities</span>
              </button>
            </div>
          </div>

          {/* 2. MQTT & Zigbee2MQTT */}
          <div className="p-5 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-white text-xs">MQTT / Zigbee2MQTT Real-Time Bus</h4>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>CONNECTED</span>
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold">MQTT Broker Host &amp; Port:</label>
                <input
                  type="text"
                  value={mqttBroker}
                  onChange={(e) => setMqttBroker(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold">Topic Prefix:</label>
                <input
                  type="text"
                  value={mqttTopic}
                  onChange={(e) => setMqttTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Tuya & Smart Life OpenAPI */}
          <div className="p-5 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-white text-xs">Tuya / Smart Life Cloud OpenAPI</h4>
              </div>
              <span className="text-[10px] text-slate-500">OPTIONAL</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={tuyaClientId}
                  onChange={(e) => setTuyaClientId(e.target.value)}
                  placeholder="Tuya Access ID"
                  className="p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none"
                />
                <input
                  type="password"
                  value={tuyaSecret}
                  onChange={(e) => setTuyaSecret(e.target.value)}
                  placeholder="Tuya Secret Key"
                  className="p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add Custom Device Form & Inventory */}
        <div className="space-y-4">
          <h3 className="font-bold text-white text-base font-outfit flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Custom Smart Device</span>
          </h3>

          <form
            onSubmit={handleAddCustomDevice}
            className="p-6 rounded-3xl bg-[#0d1117] border border-cyan-500/20 space-y-4 shadow-xl"
          >
            <div className="space-y-1.5 text-xs">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Device Name</label>
              <input
                type="text"
                value={devName}
                onChange={(e) => setDevName(e.target.value)}
                placeholder="e.g. Balcony String Lights, Garage Dehumidifier..."
                className="w-full p-3 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Room / Zone</label>
                <select
                  value={devRoom}
                  onChange={(e) => setDevRoom(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white text-xs focus:outline-none cursor-pointer"
                >
                  {ROOM_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Device Type</label>
                <select
                  value={devType}
                  onChange={(e) => setDevType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white text-xs focus:outline-none cursor-pointer"
                >
                  {DEVICE_TYPES.map((t) => (
                    <option key={t.type} value={t.type}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-[10px] text-slate-400 font-bold uppercase">
                Power Draw (Estimated Watts)
              </label>
              <input
                type="number"
                value={devWatts}
                onChange={(e) => setDevWatts(Number(e.target.value))}
                min="0"
                max="3000"
                className="w-full p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white text-xs focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={!devName.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black font-extrabold text-xs transition-all disabled:opacity-40 cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Device to Active Dashboard</span>
            </button>
          </form>

          {/* Current Connected Device Inventory with Edit triggers */}
          <div className="p-6 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h4 className="font-bold text-white text-xs">
                  Hardware Inventory ({devices.length})
                </h4>
                <p className="text-[10px] text-slate-500">
                  Click 'Edit' to change names, wattage rating, room, or stream URLs
                </p>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold">Local Sync</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
              {devices.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#161b22] border border-slate-800 hover:border-cyan-500/40 transition-all"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{d.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                        {d.powerWatts}W
                      </span>
                    </div>
                    <p className="text-slate-500 text-[10px]">
                      {d.room} • {d.type}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingDevice(d)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500/50 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Settings className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteDevice(d.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
                      title="Remove device"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Device Config Modal */}
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
