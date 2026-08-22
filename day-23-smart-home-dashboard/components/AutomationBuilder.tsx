'use client';

import { useState } from 'react';
import { AutomationRule, Device } from '@/types';
import { INITIAL_AUTOMATIONS } from '@/lib/deviceStore';
import {
  Sliders,
  Plus,
  Power,
  Clock,
  Flame,
  Shield,
  Zap,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface Props {
  devices: Device[];
  onTriggerRule?: (rule: AutomationRule) => void;
}

export default function AutomationBuilder({ devices, onTriggerRule }: Props) {
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_AUTOMATIONS);
  const [isCreating, setIsCreating] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [triggerType, setTriggerType] = useState<'time' | 'motion' | 'temperature' | 'door_open'>('time');
  const [triggerValue, setTriggerValue] = useState('22:00');
  const [selectedDevice, setSelectedDevice] = useState(devices[0]?.id || 'lr_light_main');
  const [actionTurnOn, setActionTurnOn] = useState(false);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const targetDev = devices.find((d) => d.id === selectedDevice);
    const newRule: AutomationRule = {
      id: 'rule_' + Date.now(),
      title: newTitle.trim(),
      enabled: true,
      icon: triggerType === 'time' ? '⏰' : triggerType === 'motion' ? '🚶' : triggerType === 'temperature' ? '🌡️' : '🚪',
      triggerDescription: `When ${triggerType} reaches ${triggerValue}`,
      actionDescription: `Set ${targetDev?.name || 'Device'} power to ${actionTurnOn ? 'ON' : 'OFF'}`,
      trigger: { type: triggerType, value: triggerValue },
      deviceUpdates: [
        {
          deviceId: selectedDevice,
          updates: { isOn: actionTurnOn, powerWatts: actionTurnOn ? 45 : 0 },
        },
      ],
    };

    setRules([newRule, ...rules]);
    setIsCreating(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* Top Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-cyan-500/30 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs">
            <Sliders className="w-3.5 h-3.5" />
            <span>IF/THEN AUTOMATION ENGINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
            Smart Home Automation Rules
          </h2>
          <p className="text-xs text-slate-400">
            Define automated event-driven triggers based on time schedules, sensor telemetry, and energy thresholds
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Rule</span>
        </button>
      </div>

      {/* New Rule Creation Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateRule}
          className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border-2 border-cyan-500/40 space-y-4 shadow-2xl animate-in fade-in duration-200"
        >
          <h3 className="text-base font-bold text-white font-outfit">
            Configure IF/THEN Automation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase text-[10px]">Rule Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Office Auto-Shutdown at 7 PM"
                className="w-full p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase text-[10px]">Trigger Condition (IF)</label>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white focus:outline-none cursor-pointer"
              >
                <option value="time">Time Schedule</option>
                <option value="motion">Motion Sensor</option>
                <option value="temperature">Temperature Threshold</option>
                <option value="door_open">Door State</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase text-[10px]">Trigger Parameter (Value)</label>
              <input
                type="text"
                value={triggerValue}
                onChange={(e) => setTriggerValue(e.target.value)}
                placeholder="e.g. 21:30 or 75°F"
                className="w-full p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase text-[10px]">Target Device (THEN)</label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-white focus:outline-none cursor-pointer"
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.room})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={actionTurnOn}
                  onChange={(e) => setActionTurnOn(e.target.checked)}
                  className="accent-cyan-400 w-4 h-4 cursor-pointer"
                />
                <span>Turn Device ON (uncheck for OFF)</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 cursor-pointer shadow-md"
              >
                Save Automation
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl ${
              rule.enabled
                ? 'bg-[#0d1117] border-cyan-500/20 hover:border-cyan-500/50'
                : 'bg-[#080d14] border-slate-850 opacity-60'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{rule.icon}</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm font-outfit">{rule.title}</h4>
                  <span
                    className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase ${
                      rule.enabled
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {rule.enabled ? 'ACTIVE' : 'PAUSED'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-0.5">
                  <p>
                    <span className="text-cyan-400 font-bold">IF:</span> {rule.triggerDescription}
                  </p>
                  <p>
                    <span className="text-emerald-400 font-bold">THEN:</span> {rule.actionDescription}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => toggleRule(rule.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  rule.enabled
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}
              >
                {rule.enabled ? 'Enabled' : 'Disabled'}
              </button>

              <button
                type="button"
                onClick={() => deleteRule(rule.id)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                title="Delete rule"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
