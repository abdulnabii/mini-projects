'use client';

import { useState } from 'react';
import { MeetingIntelligence } from "@/types";
import ActionItemsTable from "./ActionItemsTable";
import AttendeesGrid from "./AttendeesGrid";
import SentimentBadge from "./SentimentBadge";
import SpeakerStatsCard from "./SpeakerStatsCard";
import MeetingQAChat from "./MeetingQAChat";
import { AlertCircle, CheckCircle2, Download, Copy, Printer, Clock, Sparkles, Check, Hash } from "lucide-react";

interface Props {
  data: MeetingIntelligence;
  transcript: string;
}

export default function MeetingResults({ data, transcript }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const md = `# Meeting Executive Summary\n\n## Executive Summary\n${data.executiveSummary}\n\n## Key Decisions\n${data.decisions.map(d => `- **${d.decision}** (by ${d.decisionMaker || 'Team'}, ${d.timestamp || 'N/A'})`).join('\n')}\n\n## Action Items\n${data.actionItems.map(a => `- [ ] **${a.task}** (Assignee: @${a.assignee || 'Unassigned'}, Due: ${a.deadline || 'N/A'}) [Priority: ${a.priority}]`).join('\n')}\n\n## Blockers & Risks\n${data.blockers.map(b => `- ⚠️ ${b.description} (${b.severity})`).join('\n')}`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `meeting-intelligence-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
  };

  const handlePrint = () => window.print();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 font-mono text-xs text-slate-300">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
            Meeting Intelligence Dossier
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-outfit">
            Executive Synthesis &amp; Action Plan
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/40 transition-all font-bold"
            title="Copy as Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
            <span>{copied ? 'Copied MD' : 'Copy Markdown'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/40 transition-all font-bold"
            title="Download JSON Report"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/40 transition-all font-bold"
            title="Print to PDF"
          >
            <Printer className="w-3.5 h-3.5 text-purple-400" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* 1. Executive Summary & Sentiment Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/40 via-[#0e1424] to-[#0a0d14] border-2 border-purple-500/30 space-y-5 shadow-2xl shadow-purple-500/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider">
              Executive Summary &amp; Core Outcome
            </h3>
          </div>
          <SentimentBadge sentiment={data.sentiment} />
        </div>

        <p className="text-sm sm:text-base text-white leading-relaxed font-sans font-normal">
          {data.executiveSummary}
        </p>

        {/* Key Topics & Duration Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          {data.keyTopics && data.keyTopics.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-bold">Key Topics:</span>
              {data.keyTopics.map((topic, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold flex items-center gap-1"
                >
                  <Hash className="w-2.5 h-2.5" />
                  {topic}
                </span>
              ))}
            </div>
          )}

          {data.meetingDuration && (
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold ml-auto">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Duration: {data.meetingDuration}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Speaker Participation & Talk-Time Analytics */}
      <SpeakerStatsCard speakerStats={data.speakerStats} />

      {/* 3. Attendees & Key Decisions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendees */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-purple-500/20 space-y-4">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
            Identified Attendees ({data.attendees.length})
          </h3>
          <AttendeesGrid attendees={data.attendees} />
        </div>

        {/* Decisions */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-purple-500/20 space-y-4">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
            Key Decisions Approved ({data.decisions.length})
          </h3>
          <ul className="space-y-3">
            {data.decisions.map((d, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-white text-xs font-bold">{d.decision}</p>
                  {(d.decisionMaker || d.timestamp) && (
                    <p className="text-[10px] text-slate-400">
                      {d.decisionMaker && <span>Approved by <strong className="text-purple-300">{d.decisionMaker}</strong></span>}
                      {d.decisionMaker && d.timestamp && <span> • </span>}
                      {d.timestamp && <span>{d.timestamp}</span>}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Blockers & Risks */}
      {data.blockers.length > 0 && (
        <div className="p-6 rounded-3xl bg-rose-950/15 border-2 border-rose-500/30 space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertCircle className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Operational Blockers &amp; Delivery Risks ({data.blockers.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.blockers.map((b, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-slate-950 border border-rose-900/40 space-y-2 flex flex-col justify-between"
              >
                <p className="text-xs text-slate-200 font-medium">{b.description}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Raised by: <strong className="text-rose-300">{b.raisedBy || 'Team'}</strong></span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                      b.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : b.severity === 'MODERATE'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {b.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Action Items Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-purple-500/20 shadow-xl">
        <ActionItemsTable items={data.actionItems} />
      </div>

      {/* 6. AI Assistant Q&A Chat */}
      <MeetingQAChat transcript={transcript} intelligence={data} />
    </div>
  );
}
