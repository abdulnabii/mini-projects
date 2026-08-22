'use client';

import { useState } from 'react';
import { DocType, SupportedLanguage } from '@/types';
import { SAMPLE_CONTRACTS, SampleContractPreset } from '@/lib/sampleContracts';
import {
  Upload,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Scale,
} from 'lucide-react';

interface Props {
  onAnalyze: (text: string, docType: DocType, title: string, language: SupportedLanguage, sampleId?: string) => void;
  isLoading?: boolean;
}

const DOC_TYPES: DocType[] = [
  'Employment Agreement',
  'Non-Disclosure Agreement (NDA)',
  'Commercial Lease Agreement',
  'Freelance / Master Services Agreement (MSA)',
  'Terms of Service & Privacy Policy',
  'General Legal Contract',
];

const LANGUAGES: SupportedLanguage[] = ['English', 'Arabic', 'Urdu', 'French', 'Spanish'];

export default function DocumentUpload({ onAnalyze, isLoading }: Props) {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<DocType>('Employment Agreement');
  const [language, setLanguage] = useState<SupportedLanguage>('English');
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleSelectSample = (sample: SampleContractPreset) => {
    setActiveSampleId(sample.id);
    setText(sample.rawText);
    setTitle(sample.title);
    setDocType(sample.docType);
    setFileName(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setTitle(file.name.replace(/\.[^/.]+$/, ''));
    setActiveSampleId(null);

    // Read text files or fallback
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* Sample Contract Presets Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30 uppercase">
              CONTRACT TEMPLATES
            </span>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              1-Click Benchmark Scenarios
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Instant Demo</span>
        </div>

        {/* 3 Contract Preset Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 min-w-0">
          {SAMPLE_CONTRACTS.map((preset) => {
            const isSelected = activeSampleId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectSample(preset)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between space-y-2 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-400 shadow-xl shadow-amber-500/15'
                    : 'bg-[#0d1117] border-slate-800 hover:border-amber-500/40 hover:bg-[#161b22]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{preset.icon}</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[9px] font-bold border border-amber-500/20">
                        {preset.category}
                      </span>
                    </div>
                    <span className="text-xs text-rose-400 font-black">{preset.riskPreview}</span>
                  </div>

                  <h4 className="font-bold text-white text-sm font-outfit group-hover:text-amber-300 transition-colors line-clamp-1">
                    {preset.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {preset.analysis.executiveSummary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-amber-400 font-bold">{preset.docType}</span>
                  <span className="text-slate-500">{preset.rawText.length} chars</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Upload & Text Input Card (Project 8/9/10 Signature Style) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-amber-500/20 shadow-2xl space-y-6 min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-outfit">
                Document Ingestion &amp; Legal Analyzer
              </h3>
              <p className="text-xs text-slate-400">
                Upload PDF/DOCX or paste contract text for instant plain-English risk diagnostics
              </p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-[#161b22] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Configuration Row: Title & Document Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold uppercase text-[10px]">
              Document Title / Reference
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Services Agreement v2"
              className="w-full bg-[#161b22] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold uppercase text-[10px]">
              Document Classification
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocType)}
              className="w-full bg-[#161b22] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              {DOC_TYPES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drag & Drop File Box or Raw Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Contract Body Text:</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span>{wordCount} words</span>
              <span className="text-slate-600">•</span>
              <span>{text.length} characters</span>
              {text.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setText('');
                    setActiveSampleId(null);
                    setFileName(null);
                  }}
                  className="text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setActiveSampleId(null);
            }}
            rows={10}
            placeholder="Paste any agreement, contract, NDA, lease, or employment terms here..."
            className="w-full bg-[#161b22] border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 font-mono leading-relaxed"
          />
        </div>

        {/* File Upload Trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#161b22] border border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-200 block">
                {fileName ? fileName : 'Upload PDF or TXT Document'}
              </span>
              <span className="text-[10px] text-slate-500">
                Client-side extraction preserves paragraph and clause structure
              </span>
            </div>
          </div>

          <label className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/40 text-slate-200 font-bold text-xs cursor-pointer transition-all shrink-0">
            <span>Browse Files</span>
            <input
              type="file"
              accept=".txt,.pdf,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onAnalyze(text, docType, title || `${docType} Review`, language, activeSampleId || undefined)}
            disabled={!text.trim() || isLoading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running Gemini 1.5 Legal Risk Assessment...</span>
              </>
            ) : (
              <>
                <Scale className="w-5 h-5 fill-black" />
                <span>Analyze Contract &amp; Generate Risk Diagnostic</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
