"use client";

import { useEffect, useState } from "react";
import { MeetingSession } from "@/types";
import { getSessions, deleteSession } from "@/lib/storage";
import MeetingResults from "@/components/MeetingResults";
import { Trash2, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const [sessions, setSessions] = useState<MeetingSession[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSession, setSelectedSession] = useState<MeetingSession | null>(null);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(id);
    setSessions(getSessions());
    if (selectedSession?.id === id) setSelectedSession(null);
  };

  const filtered = sessions.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.transcriptSnippet.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedSession) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <button onClick={() => setSelectedSession(null)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to History
        </button>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">{selectedSession.title}</h2>
          <p className="text-sm text-slate-500">{new Date(selectedSession.createdAt).toLocaleString()}</p>
        </div>
        <MeetingResults data={selectedSession.intelligence} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Meeting History</h2>
          <p className="text-slate-400">Past extracted intelligence reports.</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search meetings..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 pl-9 pr-4 py-2 bg-[#111827] border border-purple-500/20 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
      </div>

      {!sessions.length ? (
        <div className="text-center py-20 text-slate-500">
          <p>No meeting history found.</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300 mt-2 inline-block">Analyze your first transcript</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(session => (
            <div 
              key={session.id} 
              onClick={() => setSelectedSession(session)}
              className="p-4 rounded-xl bg-[#111827] border border-purple-500/10 hover:border-purple-500/30 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="space-y-1">
                <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">{session.title}</h3>
                <p className="text-xs text-slate-500">{new Date(session.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-slate-400 line-clamp-1">{session.transcriptSnippet}</p>
              </div>
              <button 
                onClick={(e) => handleDelete(session.id, e)}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
