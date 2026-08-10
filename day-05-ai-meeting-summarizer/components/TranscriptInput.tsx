"use client";

import { useState } from 'react';
import { Upload, Loader2, BrainCircuit } from 'lucide-react';

interface Props {
  onAnalyze: (transcript: string) => void;
  isLoading: boolean;
}

const TEMPLATES = [
  { id: 'standup', name: 'Product Standup', content: "Alice: Yesterday I finished the API integration. Today I'll focus on the frontend UI. Bob: I reviewed Alice's PR, looks good. I am currently blocked on the database migration, waiting for devops. Charlie: Let's escalate the DB issue to infrastructure team. Action item: Bob to ping infra team by noon." },
  { id: 'design', name: 'Design Review', content: "Sarah: Let's review the new onboarding flow. The current drop-off rate is 40%. Tom: I think the contrast on the CTA button is too low. Let's change it to our primary purple. Sarah: Good call. Also, we decided to remove the phone number field for now. Action item: Tom to update Figma and hand off to dev by Friday." },
  { id: 'sprint', name: 'Sprint Planning', content: "Mike: We have 40 story points for this sprint. The main goal is releasing the auth module. Emma: I can take the login and signup pages. Dave: I will handle the backend auth logic. Risk: The third-party OAuth provider has been flaky in staging. We need a fallback." }
];

export default function TranscriptInput({ onAnalyze, isLoading }: Props) {
  const [transcript, setTranscript] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setTranscript(event.target?.result as string);
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => setTranscript(t.content)}
            className="px-4 py-2 text-sm rounded-full border border-purple-500/20 bg-[#111827] text-slate-300 hover:text-white hover:border-purple-500/50 transition-colors"
          >
            Demo: {t.name}
          </button>
        ))}
      </div>

      <div className="relative group">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript here..."
          className="w-full h-64 p-6 bg-[#111827] border border-purple-500/20 rounded-2xl text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent resize-none transition-all font-mono text-sm"
        />
        
        <div className="absolute bottom-4 right-4 flex items-center gap-4">
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors">
            <Upload className="w-4 h-4" />
            Upload .txt
            <input type="file" accept=".txt,.vtt" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => onAnalyze(transcript)}
          disabled={!transcript.trim() || isLoading}
          className="flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Transcript...
            </>
          ) : (
            <>
              <BrainCircuit className="w-5 h-5" />
              Extract Intelligence
            </>
          )}
        </button>
      </div>
    </div>
  );
}


