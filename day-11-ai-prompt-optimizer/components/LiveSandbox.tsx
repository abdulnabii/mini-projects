'use client';

import { useState } from 'react';
import { PromptVariant } from '@/types';
import { X, Play, Loader2, Cpu, CheckCircle2, Sparkles } from 'lucide-react';

interface Props {
  variant: PromptVariant;
  onClose: () => void;
}

export default function LiveSandbox({ variant, onClose }: Props) {
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [userPromptText, setUserPromptText] = useState(variant.userPrompt);
  const [systemInstructionText, setSystemInstructionText] = useState(variant.systemInstruction || '');
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleVariableChange = (key: string, val: string) => {
    const updated = { ...variableValues, [key]: val };
    setVariableValues(updated);

    // Replace {{key}} in prompt text
    let filledPrompt = variant.userPrompt;
    Object.entries(updated).forEach(([k, v]) => {
      filledPrompt = filledPrompt.replaceAll(`{{${k}}}`, v || `{{${k}}}`);
    });
    setUserPromptText(filledPrompt);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(null);

    try {
      const res = await fetch('/api/test-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: systemInstructionText,
          userPrompt: userPromptText,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOutput(data.output);
      } else {
        setOutput(`Error: ${data.error || 'Failed to run test prompt'}`);
      }
    } catch (err: any) {
      setOutput(`Error executing request: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#090c14] border border-amber-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6 shadow-2xl shadow-amber-500/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-lg font-bold text-white font-outfit">Live Prompt Execution Sandbox</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Variable Inputs */}
        {variant.extractedVariables && variant.extractedVariables.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Dynamic Variable Input Form ({variant.extractedVariables.length} detected)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {variant.extractedVariables.map((vKey) => (
                <div key={vKey}>
                  <label className="text-[11px] text-slate-300 mb-1 block">
                    Parameter: <strong className="text-amber-300 font-bold font-mono">{`{{${vKey}}}`}</strong>
                  </label>
                  <input
                    type="text"
                    value={variableValues[vKey] || ''}
                    onChange={(e) => handleVariableChange(vKey, e.target.value)}
                    placeholder={`Enter value for ${vKey}...`}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Instruction (Editable) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            System Instruction
          </label>
          <textarea
            value={systemInstructionText}
            onChange={(e) => setSystemInstructionText(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-2xl bg-slate-950 border border-emerald-500/20 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* User Prompt (Editable) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            User Prompt
          </label>
          <textarea
            value={userPromptText}
            onChange={(e) => setUserPromptText(e.target.value)}
            rows={5}
            className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Execution Output */}
        {output !== null && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Gemini Execution Response Output
            </label>
            <pre className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-xs text-slate-200 whitespace-pre-wrap max-h-[250px] overflow-y-auto leading-relaxed">
              {output}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold"
          >
            Close Sandbox
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-black text-xs font-extrabold hover:opacity-95 shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Running Gemini AI Model...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black text-black" />
                <span>Run Test Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
