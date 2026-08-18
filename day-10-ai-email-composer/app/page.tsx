'use client';

import { useEffect, useState } from 'react';
import {
  EmailConfig,
  EmailTone,
  EmailPurpose,
  GeneratedEmailResponse,
  EmailVariant,
  SavedEmail,
} from '@/types';
import { PRESET_DEMOS } from '@/lib/presets';
import { getSavedEmails, saveEmailToHistory, deleteSavedEmail } from '@/lib/storage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VariantDisplay from '@/components/VariantDisplay';
import SubjectOptimizer from '@/components/SubjectOptimizer';
import DeliverabilityAudit from '@/components/DeliverabilityAudit';
import { Mail, Sparkles, Wand2, Plus, Trash2, ArrowRight, Loader2, Bookmark, Check, Send } from 'lucide-react';

const TONES: EmailTone[] = ['Persuasive', 'Direct & Punchy', 'Formal Executive', 'Warm & Casual', 'Urgent / Deadline'];
const PURPOSES: EmailPurpose[] = [
  'Cold Outreach',
  'Job Application',
  'Follow-up',
  'Customer Complaint',
  'Networking',
  'Investor Pitch',
  'SaaS Sales Demo',
];

export default function Home() {
  const [tone, setTone] = useState<EmailTone>('Persuasive');
  const [purpose, setPurpose] = useState<EmailPurpose>('Cold Outreach');
  const [senderName, setSenderName] = useState('Abdul Nabi');
  const [recipientName, setRecipientName] = useState('Sarah Jenkins');
  const [recipientCompany, setRecipientCompany] = useState('MedFlow Health');
  const [bullets, setBullets] = useState<string[]>([
    'Built AI diagnostic triage tool deployed across 3 healthcare hospital networks',
    'Reduces clinical intake processing delays by 34% with zero workflow disruptions',
    'Want to propose a 15-minute live interactive demo this Thursday or Friday',
    'Can seamlessly connect with MedFlow HL7 & FHIR patient intake APIs',
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<GeneratedEmailResponse | null>(null);
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(0);
  const [selectedSubjectText, setSelectedSubjectText] = useState('');
  const [savedHistory, setSavedHistory] = useState<SavedEmail[]>([]);

  useEffect(() => {
    setSavedHistory(getSavedEmails());
  }, []);

  const handleApplyPreset = (demoConfig: EmailConfig) => {
    setTone(demoConfig.tone);
    setPurpose(demoConfig.purpose);
    setSenderName(demoConfig.senderName || 'Abdul Nabi');
    setRecipientName(demoConfig.recipientName || '');
    setRecipientCompany(demoConfig.recipientCompany || '');
    setBullets(demoConfig.bullets);
  };

  const handleAddBullet = () => {
    setBullets([...bullets, '']);
  };

  const handleUpdateBullet = (index: number, val: string) => {
    const updated = [...bullets];
    updated[index] = val;
    setBullets(updated);
  };

  const handleRemoveBullet = (index: number) => {
    if (bullets.length <= 1) return;
    setBullets(bullets.filter((_, i) => i !== index));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const validBullets = bullets.filter((b) => b.trim().length > 0);
    if (validBullets.length === 0) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    const config: EmailConfig = {
      tone,
      purpose,
      senderName: senderName.trim(),
      recipientName: recipientName.trim(),
      recipientCompany: recipientCompany.trim(),
      bullets: validBullets,
    };

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!res.ok) throw new Error('Failed to generate email package');

      const data: GeneratedEmailResponse = await res.json();
      setResult(data);
      setSelectedSubjectIndex(data.recommendedSubjectIndex || 0);
      setSelectedSubjectText(data.subjectLines[data.recommendedSubjectIndex || 0]?.subject || '');
    } catch (err: unknown) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong during generation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVariant = (variant: EmailVariant) => {
    const config: EmailConfig = { tone, purpose, senderName, recipientName, recipientCompany, bullets };
    const updated = saveEmailToHistory(config, variant);
    setSavedHistory(updated);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = deleteSavedEmail(id);
    setSavedHistory(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-200">
      <Navbar />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-10 font-mono text-xs text-slate-300">
        {/* Hero Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI COLD EMAIL &amp; SEQUENCE STUDIO</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-outfit">
            Transform Raw Bullets Into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
              High-Converting Emails
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Generate 4 tailored variants (Assertive, Balanced, Mobile, Sequence), 5 optimized subject lines with predicted open rates, and real-time deliverability scores.
          </p>
        </div>

        {/* 1-Click Preset Demos */}
        <div className="space-y-2 text-center">
          <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
            1-Click Preset Scenarios:
          </span>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {PRESET_DEMOS.map((demo) => (
              <button
                key={demo.name}
                type="button"
                onClick={() => handleApplyPreset(demo.config)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-500/20 bg-[#131b2e] text-xs text-slate-300 hover:text-white hover:border-indigo-500/50 transition-all hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-bold">{demo.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono">
                  {demo.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Composer Input Form */}
        <form
          onSubmit={handleGenerate}
          className="bg-[#131b2e] border border-indigo-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
        >
          {/* Tone & Purpose */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs uppercase text-slate-400 font-bold">Desired Writing Tone</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                      tone === t
                        ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 shadow-md'
                        : 'bg-[#0b0f19] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase text-slate-400 font-bold">Email Purpose</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as EmailPurpose)}
                className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
              >
                {PURPOSES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sender & Recipient Context Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[10px] uppercase text-slate-500 mb-1 font-bold">Your Name (Sender)</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Abdul Nabi"
                className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-slate-500 mb-1 font-bold">Recipient Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-slate-500 mb-1 font-bold">Company / Organization</label>
              <input
                type="text"
                value={recipientCompany}
                onChange={(e) => setRecipientCompany(e.target.value)}
                placeholder="e.g. MedFlow Health"
                className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>

          {/* Dynamic Bullet Points Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs uppercase text-slate-400 font-bold">
                Core Message Bullet Points (3–5 Points)
              </label>
              <button
                type="button"
                onClick={handleAddBullet}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-white font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Point</span>
              </button>
            </div>

            <div className="space-y-2">
              {bullets.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-indigo-400 font-bold w-4 text-right">{idx + 1}.</span>
                  <input
                    type="text"
                    required
                    value={b}
                    onChange={(e) => handleUpdateBullet(idx, e.target.value)}
                    placeholder={`Point #${idx + 1}...`}
                    className="flex-1 bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60"
                  />
                  {bullets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(idx)}
                      className="text-slate-600 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isLoading || bullets.every((b) => !b.trim())}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs font-outfit uppercase tracking-wider transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Copy &amp; Open Rate Predictions...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Complete Outreach Package</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-400 text-center text-xs">
            {error}
          </div>
        )}

        {/* Generated Package View */}
        {result && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Subject Line Optimizer */}
            <SubjectOptimizer
              candidates={result.subjectLines}
              selectedIndex={selectedSubjectIndex}
              onSelectSubject={(idx, subject) => {
                setSelectedSubjectIndex(idx);
                setSelectedSubjectText(subject);
              }}
            />

            {/* Deliverability & Spam Filter Audit */}
            <DeliverabilityAudit deliverability={result.deliverability} />

            {/* Email Variants & Client Simulator */}
            <VariantDisplay
              variants={result.variants}
              selectedSubject={selectedSubjectText}
              config={{ tone, purpose, senderName, recipientName, recipientCompany, bullets }}
              onSaveHistory={handleSaveVariant}
            />
          </div>
        )}

        {/* Saved Draft History */}
        {savedHistory.length > 0 && (
          <div className="bg-[#131b2e] border border-indigo-500/20 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-outfit">
                <Bookmark className="w-4 h-4 text-indigo-400" />
                Saved Email Draft History
              </h3>
              <span className="text-xs text-slate-400 tabular-nums">{savedHistory.length} Drafts</span>
            </div>

            <div className="space-y-3">
              {savedHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-indigo-500/40 transition-all text-xs"
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <span className="font-bold text-white block truncate font-outfit">{item.variant.subject}</span>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      <span>Tone: {item.config.tone}</span>
                      <span>• {item.config.purpose}</span>
                      <span>• {item.variant.wordCount} words</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const fullText = `Subject: ${item.variant.subject}\n\n${item.variant.body}`;
                        navigator.clipboard.writeText(fullText);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 text-[11px] font-bold"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteHistory(item.id)}
                      className="text-slate-600 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
