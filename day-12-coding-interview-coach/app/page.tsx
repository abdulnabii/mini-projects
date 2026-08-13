'use client';

import { useState, useEffect } from 'react';
import { EvaluationReport, Hint, InterviewMessage, InterviewSession, Problem, ProgrammingLanguage } from '@/types';
import { getSessionHistory, saveSessionToHistory, deleteSessionFromHistory } from '@/lib/storage';
import InterviewSetup from '@/components/InterviewSetup';
import ProblemPanel from '@/components/ProblemPanel';
import InterviewerChat from '@/components/InterviewerChat';
import CodeEditorPanel from '@/components/CodeEditorPanel';
import AssessmentReport from '@/components/AssessmentReport';
import { Sparkles, Terminal, History, Trash2, Trophy, Clock, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [sessionState, setSessionState] = useState<'setup' | 'live' | 'report'>('setup');
  const [history, setHistory] = useState<InterviewSession[]>([]);

  const [code, setCode] = useState('');
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [hintsGiven, setHintsGiven] = useState<Hint[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(1800);

  const [isLoadingGreeting, setIsLoadingGreeting] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    setHistory(getSessionHistory());
  }, []);

  // Timer countdown during live interview
  useEffect(() => {
    if (sessionState !== 'live') return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionState]);

  const handleStartInterview = async (problem: Problem, language: ProgrammingLanguage) => {
    setIsLoadingGreeting(true);

    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: problem.id, language }),
      });

      const data = await res.json();

      const newSession: InterviewSession = {
        id: `session_${Date.now()}`,
        problem: data.problem,
        language: data.language,
        code: data.problem.starterCode[language] || '',
        messages: data.messages,
        hintsGiven: [],
        startTime: new Date().toISOString(),
      };

      setActiveSession(newSession);
      setCode(newSession.code);
      setMessages(newSession.messages);
      setHintsGiven([]);
      setTimeRemaining((data.problem.timeLimitMinutes || 30) * 60);
      setSessionState('live');
    } catch (err) {
      console.error('Error launching interview session:', err);
    } finally {
      setIsLoadingGreeting(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!activeSession) return;

    const userMsg: InterviewMessage = {
      id: `msg_${Date.now()}`,
      sender: 'candidate',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/interview/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: activeSession.problem.id,
          chatHistory: updatedMessages.map((m) => ({ sender: m.sender, text: m.text })),
          candidateMessage: text,
        }),
      });

      const data = await res.json();

      const aiMsg: InterviewMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'interviewer',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([...updatedMessages, aiMsg]);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleRequestHint = async () => {
    if (!activeSession) return;

    setIsHintLoading(true);

    try {
      const res = await fetch('/api/interview/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: activeSession.problem.id,
          currentCode: code,
          hintsGivenCount: hintsGiven.length,
        }),
      });

      const hint: Hint = await res.json();
      setHintsGiven([...hintsGiven, hint]);
    } catch (err) {
      console.error('Error requesting hint:', err);
    } finally {
      setIsHintLoading(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!activeSession) return;

    setIsEvaluating(true);

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: activeSession.problem.id,
          code,
          language: activeSession.language,
        }),
      });

      const evaluation: EvaluationReport = await res.json();

      const finishedSession: InterviewSession = {
        ...activeSession,
        code,
        messages,
        hintsGiven,
        endTime: new Date().toISOString(),
        evaluation,
      };

      setActiveSession(finishedSession);
      const updatedHistory = saveSessionToHistory(finishedSession);
      setHistory(updatedHistory);
      setSessionState('report');
    } catch (err) {
      console.error('Error evaluating solution:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteSessionFromHistory(id);
    setHistory(updated);
  };

  return (
    <div className="flex-1 space-y-8 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      {/* State 1: Interview Setup Screen */}
      {sessionState === 'setup' && (
        <div className="space-y-12">
          <section className="text-center space-y-4 max-w-3xl mx-auto pt-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STAFF ENGINEER INTERVIEW SIMULATOR</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-outfit">
              Master Technical Interviews with <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-purple-500 bg-clip-text text-transparent">
                Alex (AI Staff Engineer)
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
              Simulate real-time FAANG coding interviews: verbal approach discussions, progressive 3-tier hints, test suite runners, and Big-O assessment scorecards.
            </p>
          </section>

          <section className="rounded-3xl bg-[#0d1117] border border-emerald-500/20 p-6 sm:p-8 shadow-2xl shadow-emerald-500/5">
            <InterviewSetup onStartSession={handleStartInterview} isLoading={isLoadingGreeting} />
          </section>

          {/* Past History */}
          {history.length > 0 && (
            <section className="space-y-4 pt-6 font-mono border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-400" />
                  Past Interview History &amp; Score Progression
                </h3>
                <span className="text-[11px] text-slate-500">{history.length} sessions completed</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {history.map((sess) => (
                  <div
                    key={sess.id}
                    onClick={() => {
                      setActiveSession(sess);
                      setSessionState('report');
                    }}
                    className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 hover:border-emerald-500/50 text-left transition-all cursor-pointer group flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                          {sess.problem.difficulty} • {sess.language.toUpperCase()}
                        </span>
                        <button
                          onClick={(e) => handleDeleteHistory(sess.id, e)}
                          className="text-slate-600 hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 font-mono font-bold line-clamp-1">{sess.problem.title}</p>
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-2">
                      <span>{new Date(sess.startTime).toLocaleDateString()}</span>
                      <span className="text-emerald-400 font-bold">
                        Score: {sess.evaluation?.overallScore || 80}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* State 2: Live Interview Room */}
      {sessionState === 'live' && activeSession && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[750px]">
            {/* Left 4 Cols: Problem Statement Panel */}
            <div className="lg:col-span-4 h-full">
              <ProblemPanel problem={activeSession.problem} timeRemainingSeconds={timeRemaining} />
            </div>

            {/* Middle 4 Cols: Interviewer Chat */}
            <div className="lg:col-span-4 h-full">
              <InterviewerChat
                messages={messages}
                hintsGiven={hintsGiven}
                onSendMessage={handleSendMessage}
                onRequestHint={handleRequestHint}
                isLoading={isChatLoading}
                isHintLoading={isHintLoading}
              />
            </div>

            {/* Right 4 Cols: Code Editor Panel */}
            <div className="lg:col-span-4 h-full">
              <CodeEditorPanel
                problem={activeSession.problem}
                code={code}
                onChangeCode={setCode}
                language={activeSession.language}
                onChangeLanguage={(lang) => {
                  setActiveSession({ ...activeSession, language: lang });
                }}
                onSubmitSolution={handleSubmitSolution}
                isEvaluating={isEvaluating}
              />
            </div>
          </div>
        </div>
      )}

      {/* State 3: Post-Interview Evaluation Report */}
      {sessionState === 'report' && activeSession?.evaluation && (
        <div className="space-y-6">
          <AssessmentReport
            evaluation={activeSession.evaluation}
            onNewInterview={() => setSessionState('setup')}
          />
        </div>
      )}
    </div>
  );
}
