'use client';

import { StatusCodeCount, ErrorSample } from '@/types';
import { ShieldAlert, CheckCircle2, AlertCircle, Terminal, XCircle } from 'lucide-react';

interface Props {
  statusCodes: StatusCodeCount[];
  recentErrors: ErrorSample[];
  errorRate: number;
  totalRequests: number;
}

export default function StatusCodeDonut({
  statusCodes,
  recentErrors,
  errorRate,
  totalRequests,
}: Props) {
  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (code >= 300 && code < 400) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (code >= 400 && code < 500) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl glass-card space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-white text-base font-outfit">
              Status Code Breakdown &amp; Error Rate
            </h3>
            <p className="text-xs text-slate-400">HTTP response distribution</p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-slate-950 border border-white/10 font-mono text-xs text-right">
          <span className="text-slate-400">Error Rate: </span>
          <span
            className={`font-black ${
              errorRate > 5 ? 'text-rose-400' : errorRate > 1 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {errorRate}%
          </span>
        </div>
      </div>

      {/* Status Codes List */}
      <div className="space-y-2.5 font-mono">
        {statusCodes.map((sc) => {
          const percent = totalRequests > 0 ? Math.round((sc.count / totalRequests) * 100) : 0;
          return (
            <div
              key={sc.code}
              className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${getStatusColor(sc.code)}`}>
                  {sc.code}
                </span>
                <span className="text-slate-300 font-sans">{sc.description}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-24 sm:w-32 h-2 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                  <div
                    className={`h-full rounded-full ${
                      sc.code >= 400 ? 'bg-rose-500' : sc.code >= 300 ? 'bg-cyan-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-white font-bold min-w-[70px] text-right">
                  {sc.count.toLocaleString()} ({percent}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Error Samples Log */}
      {recentErrors.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-rose-400" />
            Recent Error Samples
          </span>

          <div className="space-y-1.5">
            {recentErrors.map((err, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs font-mono text-rose-300 flex items-start gap-2"
              >
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-400">[{err.statusCode}]</span>
                    <span className="text-slate-400 text-[10px]">{err.timestamp}</span>
                  </div>
                  <p className="text-slate-300">{err.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
