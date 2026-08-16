'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2, Sparkles, Mic, MicOff, FileText } from 'lucide-react';

interface Props {
  onAnalyze: (transcript: string) => void;
  isLoading: boolean;
}

const TEMPLATES = [
  {
    id: 'standup',
    name: 'Sprint Standup & Blocker Sync',
    icon: '⚡',
    content: `Alice (Frontend Lead): Yesterday I finished the GraphQL client integration and tested the responsive dashboard. Today I am implementing the user analytics charts.
Bob (Backend Dev): I reviewed Alice's PR, merged it into staging. I am currently blocked on the database migration because the devops access token expired.
Charlie (Engineering Manager): Thanks team. Let's escalate the database token issue to the infrastructure team immediately so Bob isn't idling.
Bob: Got it, I will ping devops on Slack right after standup.
Charlie: Action item: Bob to ping infrastructure team by noon and post an update on Jira.`
  },
  {
    id: 'design',
    name: 'Product Design & Funnel Review',
    icon: '🎨',
    content: `Sarah (Product Manager): Let's review the onboarding checkout funnel. Our mobile drop-off rate is high at 40% between steps 2 and 3.
Tom (Lead UI/UX Designer): I audited the flow. The CTA button contrast is too low against the dark background, and asking for a phone number creates too much friction.
Sarah: Agreed. Let's elevate the CTA contrast to primary purple #7c3aed and make the phone number completely optional.
Tom: Perfect. Action item: Tom to update Figma components and hand off updated assets to engineering by Friday 4 PM.`
  },
  {
    id: 'retro',
    name: 'Incident Post-Mortem & Retrospective',
    icon: '🛡️',
    content: `Dave (Site Reliability Engineer): Yesterday at 14:20 UTC, our API gateway experienced a 12-minute outage due to an unhandled Redis connection pool exhaustion during traffic spike.
Emma (Staff Architect): The automated failover took 8 minutes to kick in because health check timeouts were set to 30 seconds.
Dave: We patched the connection pooling configuration immediately.
Emma: We should reduce the health check interval from 30s to 5s and add circuit breakers for downstream services.
Dave: Action item: Dave to deploy circuit breaker middleware and update health check intervals by Wednesday.`
  }
];

export default function TranscriptInput({ onAnalyze, isLoading }: Props) {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<unknown>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setTranscript((event.target?.result as string) || '');
      reader.readAsText(file);
    }
  };

  const toggleRecording = () => {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isRecording) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (recognitionRef.current) (recognitionRef.current as any).stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => (prev ? prev + '\n' + finalTranscript.trim() : finalTranscript.trim()));
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onerror = (e: any) => {
        console.warn('Speech rec error:', e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
      rec.start();
    }
  };

  const wordCount = transcript.split(/\s+/).filter(Boolean).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 font-mono text-xs">
      {/* Demo Preset Selector */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
          Load Pre-Configured Multi-Speaker Transcripts
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTranscript(t.content)}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 text-left transition-all group flex items-center gap-2.5"
            >
              <span className="text-lg">{t.icon}</span>
              <div>
                <span className="font-bold text-white text-xs font-outfit block group-hover:text-purple-300">
                  {t.name}
                </span>
                <span className="text-[10px] text-slate-500">1-click demo</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea Container */}
      <div className="relative rounded-3xl bg-slate-950 border-2 border-purple-500/30 p-4 sm:p-6 shadow-2xl shadow-purple-500/5 focus-within:border-purple-500 transition-all">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-white text-xs">Meeting Audio / Text Transcript</span>
          </div>

          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-slate-400 font-bold">{wordCount} words</span>
            {isRecording && (
              <span className="flex items-center gap-1.5 text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Live Transcribing...
              </span>
            )}
          </div>
        </div>

        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={10}
          placeholder="Paste meeting transcript here with Speaker labels (e.g. Alice: update, Bob: blocker...) or use Live Mic Recording..."
          className="w-full bg-transparent border-none text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none font-mono text-xs leading-relaxed"
        />

        {/* Bottom Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleRecording}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/40'
              }`}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-purple-400" />}
              <span>{isRecording ? 'Stop Mic' : 'Live Voice Dictation'}</span>
            </button>

            <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/40 font-bold transition-all">
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              <span>Upload .txt / .vtt</span>
              <input type="file" accept=".txt,.vtt" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          {transcript && (
            <button
              type="button"
              onClick={() => setTranscript('')}
              className="text-slate-500 hover:text-rose-400 text-[10px] transition-colors"
            >
              Clear Text
            </button>
          )}
        </div>
      </div>

      {/* Extract CTA Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => onAnalyze(transcript)}
          disabled={!transcript.trim() || isLoading}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-600 text-white font-extrabold text-xs font-outfit uppercase tracking-wider hover:opacity-95 transition-all shadow-xl shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Extracting Executive Intelligence...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Extract Intelligence &amp; Action Plan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
