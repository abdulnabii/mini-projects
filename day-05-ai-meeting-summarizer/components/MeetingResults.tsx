import { MeetingIntelligence } from "@/types";
import ActionItemsTable from "./ActionItemsTable";
import AttendeesGrid from "./AttendeesGrid";
import SentimentBadge from "./SentimentBadge";
import { AlertCircle, CheckCircle2, Download, Copy, Printer, Clock } from "lucide-react";

export default function MeetingResults({ data }: { data: MeetingIntelligence }) {
  
  const handleCopy = () => {
    const md = `# Meeting Summary\n\n## Executive Summary\n${data.executiveSummary}\n\n## Action Items\n${data.actionItems.map(a => `- [ ] ${a.task} (@${a.assignee || 'unassigned'}, Due: ${a.deadline || 'no date'}) [${a.priority}]`).join('\n')}`;
    navigator.clipboard.writeText(md);
    alert('Copied to clipboard as Markdown');
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(data, null, 2)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "meeting-intelligence.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handlePrint = () => window.print();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-white bg-[#111827] hover:bg-slate-800 rounded-lg border border-purple-500/20" title="Copy Markdown">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={handleDownload} className="p-2 text-slate-400 hover:text-white bg-[#111827] hover:bg-slate-800 rounded-lg border border-purple-500/20" title="Download Text">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={handlePrint} className="p-2 text-slate-400 hover:text-white bg-[#111827] hover:bg-slate-800 rounded-lg border border-purple-500/20" title="Print to PDF">
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-[#111827] border border-purple-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <SentimentBadge sentiment={data.sentiment} />
        </div>
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Executive Summary</h3>
        <p className="text-lg text-white leading-relaxed">{data.executiveSummary}</p>
        {data.meetingDuration && (
          <p className="text-sm text-slate-400 mt-4 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Duration: {data.meetingDuration}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#111827] border border-purple-500/20">
          <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">Attendees</h3>
          <AttendeesGrid attendees={data.attendees} />
        </div>

        <div className="p-6 rounded-2xl bg-[#111827] border border-purple-500/20">
          <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">Key Decisions</h3>
          <ul className="space-y-4">
            {data.decisions.map((d, i) => (
              <li key={i} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm">{d.decision}</p>
                  {(d.decisionMaker || d.timestamp) && (
                    <p className="text-xs text-slate-400 mt-1">
                      {d.decisionMaker && <span>By {d.decisionMaker}</span>}
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

      {data.blockers.length > 0 && (
        <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/20">
          <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Risks & Blockers
          </h3>
          <ul className="space-y-3">
            {data.blockers.map((b, i) => (
              <li key={i} className="text-sm text-slate-300 bg-red-950/40 p-3 rounded-lg border border-red-900/50 flex justify-between items-start gap-4">
                <span>{b.description}</span>
                <span className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded-full whitespace-nowrap">
                  {b.severity}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-[#111827] border border-purple-500/20 overflow-x-auto">
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">Action Items</h3>
        <ActionItemsTable items={data.actionItems} />
      </div>
    </div>
  );
}


