'use client';

import React from 'react';
import { TriageSession } from '@/types';
import RiskBadge from './RiskBadge';
import { Printer, Download, X, Activity, FileText } from 'lucide-react';

interface ExportModalProps {
  session: TriageSession;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ session, isOpen, onClose }: ExportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const lines = [
      `==================================================`,
      `MEDITRIAGE AI - CLINICAL TRIAGE SUMMARY REPORT`,
      `==================================================`,
      `Date: ${new Date(session.createdAt).toLocaleString()}`,
      `Session ID: ${session.id}`,
      `Title: ${session.title}`,
      ``,
      `--- PATIENT DEMOGRAPHICS ---`,
      `Age: ${session.patientContext?.age || 'N/A'}`,
      `Gender: ${session.patientContext?.gender || 'N/A'}`,
      `Symptom Duration: ${session.patientContext?.duration || 'N/A'}`,
      `Self-Rated Severity: ${session.patientContext?.severity || 'N/A'}/10`,
      `Medical History: ${session.patientContext?.preExistingConditions || 'None reported'}`,
      ``,
      `--- TRIAGE ASSESSMENT ---`,
      `Risk Level: ${session.finalAssessment?.riskLevel || 'N/A'}`,
      `Urgency Guidance: ${session.finalAssessment?.urgency || 'N/A'}`,
      ``,
      `POSSIBLE CONDITIONS EVALUATED:`,
      ...(session.finalAssessment?.possibleConditions || []).map(
        (c) => ` - ${c.name} (${Math.round(c.confidence * 100)}% match)\n   Description: ${c.description}`
      ),
      ``,
      `RECOMMENDED NEXT ACTIONS:`,
      ...(session.finalAssessment?.nextSteps || []).map((s, idx) => ` ${idx + 1}. ${s}`),
      ``,
      `==================================================`,
      `DISCLAIMER: This automated report is for reference only and does not substitute professional medical care.`,
      `==================================================`,
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MediTriage-Report-${session.id.slice(0, 8)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Clinical Summary Report</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download TXT
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-6 bg-slate-950 p-6 rounded-xl border border-slate-800/80 font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" /> MediTriage AI Assessment Report
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Session ID: {session.id} • {new Date(session.createdAt).toLocaleString()}
              </p>
            </div>
            {session.finalAssessment?.riskLevel && (
              <RiskBadge level={session.finalAssessment.riskLevel} size="md" />
            )}
          </div>

          {session.patientContext && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 text-xs">
              <div>
                <span className="text-slate-400 block">Age:</span>
                <span className="font-semibold text-white">{session.patientContext.age || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Gender:</span>
                <span className="font-semibold text-white">{session.patientContext.gender || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Duration:</span>
                <span className="font-semibold text-white">{session.patientContext.duration || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Severity:</span>
                <span className="font-semibold text-white">{session.patientContext.severity || 'N/A'}/10</span>
              </div>
            </div>
          )}

          {session.finalAssessment && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Urgency Timeframe
                </h4>
                <p className="text-sm font-semibold text-cyan-400">{session.finalAssessment.urgency}</p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Evaluated Possible Conditions
                </h4>
                <ul className="space-y-2 text-xs">
                  {session.finalAssessment.possibleConditions.map((c, idx) => (
                    <li key={idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <div className="flex justify-between font-semibold text-slate-200">
                        <span>{c.name}</span>
                        <span className="text-cyan-400">{Math.round(c.confidence * 100)}%</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1">{c.description}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Action Steps
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
                  {session.finalAssessment.nextSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-3">
            Disclaimer: MediTriage AI provides preliminary automated clinical decision assistance. Always consult a qualified medical professional for health emergencies.
          </div>
        </div>
      </div>
    </div>
  );
}
