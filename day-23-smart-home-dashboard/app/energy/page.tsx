'use client';

import { useState, useEffect } from 'react';
import { getStoredDevices } from '@/lib/deviceStore';
import { SAMPLE_ENERGY_OVERVIEW } from '@/lib/sampleEnergyData';
import { Device } from '@/types';
import EnergyChart from '@/components/EnergyChart';
import { Zap } from 'lucide-react';

export default function EnergyPage() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    setDevices(getStoredDevices());
  }, []);

  const totalLiveWatts = devices.reduce((sum, d) => sum + (d.isOn ? d.powerWatts : 0), 0);

  const dynamicOverview = {
    ...SAMPLE_ENERGY_OVERVIEW,
    currentDrawWatts: totalLiveWatts > 0 ? totalLiveWatts : SAMPLE_ENERGY_OVERVIEW.currentDrawWatts,
  };

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-cyan-500/30 shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs">
          <Zap className="w-3.5 h-3.5" />
          <span>REAL-TIME ENERGY &amp; POWER RADAR</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
          Smart Grid Power Telemetry
        </h2>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Monitor real-time wattage draw across active appliances, inspect 24-hour load profiles, and review Gemini 1.5 Flash efficiency recommendations.
        </p>
      </div>

      <EnergyChart overview={dynamicOverview} devices={devices} />
    </div>
  );
}
