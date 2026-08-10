import Link from 'next/link';
import { BrainCircuit, Clock } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-purple-500/20 bg-[#0a0d14]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight">MeetingMind.AI</h1>
            <p className="text-[10px] text-purple-400 font-medium uppercase tracking-wider">AI-Powered Meeting Intelligence</p>
          </div>
        </Link>
        <Link href="/history" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800">
          <Clock className="w-4 h-4" />
          History
        </Link>
      </div>
    </nav>
  );
}
