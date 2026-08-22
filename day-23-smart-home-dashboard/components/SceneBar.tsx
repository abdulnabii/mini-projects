'use client';

import { Scene } from '@/types';
import { PRESET_SCENES } from '@/lib/deviceStore';
import { Sparkles, Layers, Zap } from 'lucide-react';

interface Props {
  activeSceneId: string | null;
  onActivateScene: (scene: Scene) => void;
}

export default function SceneBar({ activeSceneId, onActivateScene }: Props) {
  return (
    <div className="space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 uppercase">
            SCENE AUTOMATION
          </span>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            1-Click Multi-Device Scenarios
          </h3>
        </div>
        <span className="text-[11px] text-slate-500">6 Presets</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {PRESET_SCENES.map((scene) => {
          const isActive = activeSceneId === scene.id;
          return (
            <button
              key={scene.id}
              type="button"
              onClick={() => onActivateScene(scene)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer group ${
                isActive
                  ? 'bg-cyan-500/15 border-cyan-400 shadow-xl shadow-cyan-500/15 text-white scale-[1.02]'
                  : 'bg-[#0d1117] border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:bg-[#161b22]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {scene.icon}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {scene.badge}
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs font-outfit line-clamp-1">
                  {scene.name}
                </h4>
              </div>

              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                {scene.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
