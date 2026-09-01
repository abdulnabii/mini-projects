'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PenTool,
  Users,
  Zap,
  Layout,
  ArrowRight,
  Share2,
  Download,
  Sparkles,
  MousePointer,
  Square,
  Circle,
  Type,
  StickyNote,
  Layers,
  Clock,
  Globe,
  Database,
  Cpu,
  Shield,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import { STARTER_TEMPLATES } from '@/lib/shapes';
import AEOFAQSection from '@/components/AEOFAQSection';

function generateCreativeRoomId(): string {
  const adjectives = ['quantum', 'stellar', 'hyper', 'cyber', 'nexus', 'vertex', 'aurora', 'pulse', 'matrix', 'zenith'];
  const nouns = ['architecture', 'flow', 'canvas', 'board', 'pipeline', 'cluster', 'sprint', 'diagram', 'studio'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${adj}-${noun}-${num}`;
}

export default function LandingPage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [recentRooms, setRecentRooms] = useState<string[]>([]);
  const [createdRoomName, setCreatedRoomName] = useState('quantum-architecture-2026');

  useEffect(() => {
    setCreatedRoomName(generateCreativeRoomId());
    const stored = localStorage.getItem('canvasflow_recent_rooms');
    if (stored) {
      try {
        setRecentRooms(JSON.parse(stored).slice(0, 4));
      } catch {}
    }
  }, []);

  const handleCreateBoard = () => {
    const id = generateCreativeRoomId();
    const recent = [id, ...recentRooms.filter((r) => r !== id)].slice(0, 5);
    localStorage.setItem('canvasflow_recent_rooms', JSON.stringify(recent));
    router.push(`/board/${id}`);
  };

  const handleJoinBoard = () => {
    const id = joinCode.trim().replace(/^.*\/board\//, '');
    if (!id) return;
    const recent = [id, ...recentRooms.filter((r) => r !== id)].slice(0, 5);
    localStorage.setItem('canvasflow_recent_rooms', JSON.stringify(recent));
    router.push(`/board/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-white overflow-x-hidden font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Floating Glass Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-[#060911]/85 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <PenTool className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">
            CanvasFlow<span className="text-cyan-400">.AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Real-Time Live Sync
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            Gemini Diagram Engine
          </span>
          <span className="flex items-center gap-1.5 text-indigo-400">
            <Globe className="w-3.5 h-3.5" />
            Infinite Vector Canvas
          </span>
        </div>

        <button
          onClick={handleCreateBoard}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Launch Canvas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-28 pb-12 px-6 overflow-hidden">
        {/* Glow ambient meshes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>AI Architecture Generator • Live Collaborative Infinite Canvas</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
            Infinite Visual Canvas.{' '}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">Real-Time Intelligence.</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Design cloud architectures, map user journeys, sketch UI wireframes, and collaborate with your engineering team simultaneously. Type your system specs — Gemini AI draws it for you.
          </p>

          {/* Action Launch Container */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto pt-2">
            <button
              onClick={handleCreateBoard}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-black font-black text-base shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all cursor-pointer"
            >
              <Layers className="w-5 h-5" />
              <span>Create New Board</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJoinBoard()}
                placeholder="Paste room code or URL..."
                className="flex-1 px-4 py-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
              />
              <button
                onClick={handleJoinBoard}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 transition-all cursor-pointer shrink-0"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Recent Rooms Quick Jump */}
          {recentRooms.length > 0 && (
            <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
              <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Recent:
              </span>
              {recentRooms.map((room) => (
                <button
                  key={room}
                  onClick={() => router.push(`/board/${room}`)}
                  className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs hover:border-cyan-500/50 hover:text-cyan-300 transition-all font-mono cursor-pointer"
                >
                  {room}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Interactive Simulator Preview Box */}
        <div className="relative z-10 mt-16 w-full max-w-5xl mx-auto">
          <div className="rounded-3xl border-2 border-cyan-500/40 bg-[#090e1c] overflow-hidden shadow-2xl shadow-cyan-500/20">
            {/* Top Toolbar Chrome */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-400 font-mono ml-2">
                  canvasflow.ai/board/{createdRoomName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
                  🟢 3 Collaborators Active
                </span>
              </div>
            </div>

            {/* Canvas Scene Simulation */}
            <div className="h-80 relative overflow-hidden flex items-center justify-center p-6 bg-[#070b16]">
              {/* Simulated Nodes */}
              <div className="absolute left-[8%] top-[38%] px-5 py-3 rounded-2xl bg-slate-950/90 border-2 border-sky-400 text-white text-xs font-bold shadow-xl">
                <span className="block text-[10px] text-sky-400 font-mono">EDGE GATEWAY</span>
                Cloudflare CDN
              </div>

              <div className="absolute left-[38%] top-[38%] px-5 py-3 rounded-2xl bg-slate-950/90 border-2 border-indigo-500 text-white text-xs font-bold shadow-xl">
                <span className="block text-[10px] text-indigo-400 font-mono">KUBERNETES POD</span>
                Auth &amp; IAM Cluster
              </div>

              <div className="absolute left-[70%] top-[38%] px-5 py-3 rounded-2xl bg-slate-950/90 border-2 border-blue-500 text-white text-xs font-bold shadow-xl">
                <span className="block text-[10px] text-blue-400 font-mono">STORAGE POOL</span>
                PostgreSQL Primary
              </div>

              {/* Connecting Arrows */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 900 320">
                <line x1="200" y1="160" x2="340" y2="160" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 3" />
                <polygon points="340,160 330,154 330,166" fill="#38bdf8" />
                <line x1="530" y1="160" x2="630" y2="160" stroke="#818cf8" strokeWidth="2.5" strokeDasharray="4 3" />
                <polygon points="630,160 620,154 620,166" fill="#818cf8" />
              </svg>

              {/* Collaborator Cursor: Fatima */}
              <div className="absolute left-[54%] top-[25%] flex items-start gap-1.5 pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5.5 3.2L18.8 12.5L12.5 13.8L9.2 20.2L5.5 3.2Z" fill="#ec4899" stroke="#080c14" strokeWidth="1.5" />
                </svg>
                <span className="px-2 py-0.5 rounded-lg bg-pink-600 text-white text-[10px] font-bold shadow-lg">
                  Fatima R. (Drawing)
                </span>
              </div>

              {/* Collaborator Cursor: Ali */}
              <div className="absolute left-[26%] top-[60%] flex items-start gap-1.5 pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5.5 3.2L18.8 12.5L12.5 13.8L9.2 20.2L5.5 3.2Z" fill="#06b6d4" stroke="#080c14" strokeWidth="1.5" />
                </svg>
                <span className="px-2 py-0.5 rounded-lg bg-cyan-600 text-black font-bold text-[10px] shadow-lg">
                  Ali K. (Sticky Note)
                </span>
              </div>

              {/* Floating Sticky Note */}
              <div className="absolute right-[6%] top-[12%] w-44 p-3.5 bg-[#fef08a] text-slate-900 rounded-2xl shadow-2xl text-[11px] font-medium rotate-2">
                <div className="text-[9px] font-bold uppercase text-slate-600 mb-1">💡 Latency Note</div>
                Enable Redis cache on JWT auth queries to reduce DB hits.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Starter Templates Gallery */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black">
            Architect Faster with <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">Starter Blueprints</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Kickstart your brainstorm with battle-tested system design and agile templates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STARTER_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={handleCreateBoard}
              className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all group hover:-translate-y-1 cursor-pointer space-y-4 shadow-xl shadow-black/60"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                  {tmpl.icon}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 text-cyan-400 text-[10px] font-mono font-bold">
                  {tmpl.category}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-white text-base group-hover:text-cyan-300 transition-colors">
                  {tmpl.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tmpl.desc}</p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-cyan-400">
                <span>Launch Template</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Crawlable AEO & SEO Knowledge Hub Section */}
      <AEOFAQSection />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-10 px-6 text-center text-xs text-slate-500 space-y-2 mt-12">
        <p>
          Built by{' '}
          <a
            href="https://github.com/abdulnabii"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 font-bold underline transition-colors"
          >
            Abdul Nabi
          </a>
          {' '}• CanvasFlow.AI — Infinite Visual Collaboration &amp; AI Architecture Studio
        </p>
      </footer>
    </div>
  );
}
