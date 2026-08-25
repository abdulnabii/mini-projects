'use client';

import { useState, useEffect } from 'react';
import { SavedVisualization } from '@/types';
import { getSavedVisualizations, deleteSavedVisualization } from '@/lib/storage';
import {
  Bookmark,
  Trash2,
  Globe,
  Share2,
  BarChart3,
  Sparkles,
  ArrowLeft,
  Search,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function GalleryPage() {
  const [savedList, setSavedList] = useState<SavedVisualization[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSavedList(getSavedVisualizations());
  }, []);

  const handleDelete = (id: string) => {
    const updated = deleteSavedVisualization(id);
    setSavedList(updated);
  };

  const filtered = savedList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.datasetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.chartType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChartIcon = (type: string) => {
    if (type.includes('GLOBE')) return <Globe className="w-4 h-4 text-emerald-400" />;
    if (type.includes('NETWORK')) return <Share2 className="w-4 h-4 text-cyan-400" />;
    if (type.includes('BAR')) return <BarChart3 className="w-4 h-4 text-purple-400" />;
    return <Sparkles className="w-4 h-4 text-amber-400" />;
  };

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0d1117] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white font-mono">
              3D Spatial Visualization Gallery ({savedList.length})
            </h1>
            <p className="text-xs text-slate-400 prose-text">
              Saved 3D WebGL projections and AI spatial narrative bookmarks
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="px-3.5 py-1.5 rounded-lg bg-[#161b22] border border-slate-800 text-xs text-slate-300 hover:text-white font-mono font-medium transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to 3D Studio</span>
        </Link>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search saved 3D projections..."
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0d1117] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 font-mono"
        />
      </div>

      {/* Saved Visualizations Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0d1117] border border-dashed border-slate-800 text-center space-y-3 font-mono">
          <Globe className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 prose-text">No saved 3D plots found.</p>
          <Link
            href="/"
            className="inline-block px-3.5 py-1.5 rounded-lg bg-emerald-500 text-black font-mono font-bold text-xs shadow-sm"
          >
            Create Your First 3D Projection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {getChartIcon(item.chartType)}
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-cyan-300 text-[9px] font-bold font-mono">
                      {item.chartType.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-white text-xs font-mono line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-400 prose-text line-clamp-3 leading-relaxed">
                  {item.narrative}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <Link
                  href="/"
                  className="px-2.5 py-1 rounded-lg bg-[#161b22] border border-slate-800 text-slate-300 hover:text-emerald-400 font-mono font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Open in 3D</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-[#161b22] border border-slate-800 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="Delete plot"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
