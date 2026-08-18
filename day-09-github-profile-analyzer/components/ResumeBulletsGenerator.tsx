'use client';

import { useState } from 'react';
import { GitHubProfileData } from '@/types';
import { Sparkles, FileText, Copy, Check, Briefcase, Share2, Download } from 'lucide-react';

interface Props {
  profile: GitHubProfileData;
}

interface ResumeData {
  linkedInHeadline: string;
  executiveSummary: string;
  bulletPoints: string[];
  recommendedRoles: string[];
}

export default function ResumeBulletsGenerator({ profile }: Props) {
  const [data, setData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/resume-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });
      const json: ResumeData = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error generating resume bullets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const copyAllMarkdown = () => {
    if (!data) return;
    const md = `# ${profile.name} (@${profile.username}) — Professional Summary

**Headline**: ${data.linkedInHeadline}

## Executive Summary
${data.executiveSummary}

## Quantified GitHub Repository Bullet Points
${data.bulletPoints.map((b) => `- ${b}`).join('\n')}

## Recommended Target Roles
${data.recommendedRoles.map((r) => `- ${r}`).join('\n')}
`;
    copyText(md, 'all');
  };

  return (
    <div className="bg-[#161b22] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs text-slate-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              AI Resume Bullets &amp; LinkedIn Headline Studio
            </h3>
            <p className="text-xs text-slate-400">
              Transform repository impact and git consistency into FAANG-ready resume bullet points
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-xs hover:opacity-95 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Synthesizing...' : data ? 'Regenerate Resume Bullets' : 'Generate ATS Bullets'}</span>
        </button>
      </div>

      {!data && !isLoading && (
        <div className="p-8 rounded-2xl bg-[#0d1117] border border-slate-800 text-center space-y-3">
          <Briefcase className="w-8 h-8 text-emerald-400/60 mx-auto" />
          <p className="text-slate-300 font-bold text-sm">Convert @{profile.username}&apos;s code into recruiter-ready accomplishments</p>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Click &quot;Generate ATS Bullets&quot; to synthesize quantified achievements, action verbs, and LinkedIn headers.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="p-8 rounded-2xl bg-[#0d1117] border border-slate-800 text-center space-y-2">
          <Sparkles className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
          <p className="font-bold text-white">Analyzing repository commits &amp; architecture metrics...</p>
        </div>
      )}

      {data && !isLoading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* LinkedIn Headline */}
          <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sky-400 uppercase flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                Suggested LinkedIn Headline
              </span>
              <button
                type="button"
                onClick={() => copyText(data.linkedInHeadline, 'headline')}
                className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 text-[10px] font-bold"
              >
                {copiedSection === 'headline' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'headline' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-white font-bold text-xs">{data.linkedInHeadline}</p>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Executive Bio / Summary</span>
              <button
                type="button"
                onClick={() => copyText(data.executiveSummary, 'summary')}
                className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 text-[10px] font-bold"
              >
                {copiedSection === 'summary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'summary' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">{data.executiveSummary}</p>
          </div>

          {/* Quantified Bullet Points */}
          <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">
                ATS-Optimized Project Bullet Points ({data.bulletPoints.length})
              </span>
              <button
                type="button"
                onClick={copyAllMarkdown}
                className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 text-[10px] font-bold"
              >
                {copiedSection === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'all' ? 'Copied Full Markdown' : 'Copy All as Markdown'}</span>
              </button>
            </div>

            <ul className="space-y-2">
              {data.bulletPoints.map((bp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-200">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span className="leading-relaxed">{bp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Target Roles */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Recommended Target Roles:</span>
            {data.recommendedRoles.map((role, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                {role}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
