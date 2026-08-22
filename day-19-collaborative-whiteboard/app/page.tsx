'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PenTool, Users, Zap, Layout, ArrowRight, Share2, Download, Sparkles,
  MousePointer, Square, Circle, Type, StickyNote, Layers, Clock, Globe
} from 'lucide-react';

function generateRoomId(): string {
  const words = ['canvas', 'flow', 'board', 'team', 'collab', 'design', 'idea', 'brainstorm', 'sketch', 'create'];
  const w1 = words[Math.floor(Math.random() * words.length)];
  const w2 = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${w1}-${w2}-${num}`;
}

const FEATURES = [
  { icon: PenTool, title: 'Infinite Canvas', desc: 'Pan and zoom a boundless workspace. Your ideas have no limits.', color: 'text-indigo-400' },
  { icon: Users, title: 'Live Collaboration', desc: 'See teammate cursors in real-time. Build together, simultaneously.', color: 'text-cyan-400' },
  { icon: Sparkles, title: 'AI Diagram Generator', desc: 'Type "Draw a microservices architecture" — watch it appear.', color: 'text-violet-400' },
  { icon: Square, title: 'Smart Shapes & Tools', desc: 'Rectangle, ellipse, arrows, sticky notes, freehand drawing — all in one.', color: 'text-emerald-400' },
  { icon: Layout, title: 'Structured Templates', desc: 'System design, ERD, flowchart, and org chart starters.', color: 'text-amber-400' },
  { icon: Download, title: 'Export Anywhere', desc: 'Export your canvas as PNG, SVG, or PDF with one click.', color: 'text-rose-400' },
];

const TOOLS = [
  { icon: MousePointer, label: 'Select' },
  { icon: PenTool, label: 'Draw' },
  { icon: Square, label: 'Shapes' },
  { icon: Circle, label: 'Ellipse' },
  { icon: Type, label: 'Text' },
  { icon: StickyNote, label: 'Notes' },
  { icon: Zap, label: 'Arrow' },
  { icon: Sparkles, label: 'AI Diagram' },
];

export default function LandingPage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [newRoomId] = useState(generateRoomId);
  const [recentRooms, setRecentRooms] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('canvasflow_recent_rooms');
    if (stored) {
      try { setRecentRooms(JSON.parse(stored).slice(0, 3)); } catch {}
    }
  }, []);

  const createBoard = () => {
    const id = generateRoomId();
    const recent = [id, ...recentRooms].slice(0, 5);
    localStorage.setItem('canvasflow_recent_rooms', JSON.stringify(recent));
    router.push(`/board/${id}`);
  };

  const joinBoard = () => {
    const id = joinCode.trim().replace(/^.*\/board\//, '');
    if (!id) return;
    const recent = [id, ...recentRooms].slice(0, 5);
    localStorage.setItem('canvasflow_recent_rooms', JSON.stringify(recent));
    router.push(`/board/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#080c14]/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <PenTool className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg tracking-tight">CanvasFlow<span className="text-indigo-400">.AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400"><Globe className="w-3.5 h-3.5" /> Real-Time Collaborative</span>
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-indigo-400" /> AI-Powered</span>
        </div>
        <button
          onClick={createBoard}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>New Board</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-cyan-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI-Powered Infinite Canvas — Now Live</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
            Infinite Canvas.{' '}
            <span className="gradient-text">Real-Time</span>
            <br />
            Intelligence.
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Sketch ideas, build system diagrams, and collaborate with your team — all on a single infinite canvas. 
            Just describe your architecture and watch AI draw it for you.
          </p>

          {/* CTA Block */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <button
              onClick={createBoard}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-lg transition-all shadow-2xl shadow-indigo-500/30 hover:scale-105 cursor-pointer neon-glow"
            >
              <Layers className="w-5 h-5" />
              <span>Create a Board</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && joinBoard()}
                placeholder="Paste board link or code..."
                className="flex-1 px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all font-mono"
              />
              <button
                onClick={joinBoard}
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white transition-all cursor-pointer shrink-0"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Recent Rooms */}
          {recentRooms.length > 0 && (
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Recent:</span>
              {recentRooms.map((room) => (
                <button
                  key={room}
                  onClick={() => router.push(`/board/${room}`)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all font-mono cursor-pointer"
                >
                  {room}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Canvas Preview Card */}
        <div className="relative z-10 mt-16 w-full max-w-5xl mx-auto px-4">
          <div className="rounded-3xl border border-white/10 bg-[#0d1424] overflow-hidden shadow-2xl shadow-indigo-500/10">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#111827] border-b border-white/5">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/60" />
                <span className="w-3 h-3 rounded-full bg-amber-500/60" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-slate-500 font-mono">canvasflow.ai/board/{newRoomId}</span>
              </div>
              <div className="flex gap-1">
                {TOOLS.slice(0, 6).map((t, i) => (
                  <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 ${i === 1 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5'}`}>
                    <t.icon className="w-3.5 h-3.5" />
                  </div>
                ))}
              </div>
            </div>
            {/* Canvas simulation */}
            <div className="h-72 bg-[#0a0f1c] dot-grid relative overflow-hidden">
              {/* Fake diagram nodes */}
              <div className="absolute left-[8%] top-[35%] px-5 py-3 rounded-xl bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 text-xs font-bold shadow-lg shadow-indigo-500/10">Web Client</div>
              <div className="absolute left-[28%] top-[35%] px-5 py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-bold shadow-lg">API Gateway</div>
              <div className="absolute left-[50%] top-[15%] px-5 py-3 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold shadow-lg">Auth Service</div>
              <div className="absolute left-[50%] top-[55%] px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-lg">User Service</div>
              <div className="absolute left-[72%] top-[55%] px-5 py-3 rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-300 text-xs font-bold shadow-lg">PostgreSQL</div>
              {/* Arrows */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 900 288">
                <defs>
                  <marker id="arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="rgba(99,102,241,0.6)" />
                  </marker>
                </defs>
                <line x1="180" y1="144" x2="252" y2="144" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray="4 2" />
                <line x1="400" y1="130" x2="450" y2="90" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray="4 2" />
                <line x1="400" y1="155" x2="450" y2="170" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray="4 2" />
                <line x1="640" y1="170" x2="648" y2="170" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray="4 2" />
              </svg>
              {/* Live cursor */}
              <div className="absolute left-[65%] top-[30%] flex items-start gap-1">
                <div className="text-indigo-400">
                  <svg width="16" height="20" viewBox="0 0 16 20">
                    <path d="M0 0 L0 16 L4 12 L8 20 L10 19 L6 11 L12 11 Z" fill="#6366f1" stroke="#080c14" strokeWidth="1" />
                  </svg>
                </div>
                <span className="bg-indigo-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Fatima</span>
              </div>
              {/* Sticky note */}
              <div className="absolute right-[4%] top-[8%] w-32 p-3 bg-yellow-200 rounded-xl text-[10px] text-gray-700 shadow-xl rotate-1 font-medium">
                API rate limiting — add Redis cache!
              </div>
              {/* AI badge */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600/90 text-white text-[10px] font-bold shadow-lg">
                <Sparkles className="w-3 h-3" />
                AI generated diagram from: "microservices architecture"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Everything you need to{' '}
            <span className="gradient-text">think visually</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            A professional whiteboard that grows with your team — from solo sketching to enterprise collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#0d1424] border border-white/8 hover:border-indigo-500/30 transition-all group hover:-translate-y-1 space-y-3">
              <div className={`w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform ${f.color}`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-black">Ready to build something together?</h2>
          <p className="text-slate-400">Create a board in seconds — no sign-up required.</p>
          <button
            onClick={createBoard}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-lg transition-all shadow-2xl shadow-indigo-500/30 hover:scale-105 cursor-pointer"
          >
            Launch Your Canvas →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-sm text-slate-500">
          Built by{' '}
          <a href="https://github.com/abdulnabii" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Abdul Nabi
          </a>
          {' '}· CanvasFlow.AI — Infinite Canvas. Real-Time Intelligence.
        </p>
      </footer>
    </div>
  );
}
