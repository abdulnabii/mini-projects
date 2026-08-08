'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, PatientContext, TriageAssessment, TriageSession } from '@/types';
import { saveSession } from '@/lib/storage';
import TriageCard from '@/components/TriageCard';
import PatientIntakeModal from '@/components/PatientIntakeModal';
import ExportModal from '@/components/ExportModal';
import {
  Send,
  User,
  Bot,
  RefreshCw,
  Sparkles,
  SlidersHorizontal,
  Download,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [patientContext, setPatientContext] = useState<PatientContext>({
    age: 30,
    gender: 'Prefer not to say',
    duration: '1-3 days',
    severity: 5,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<TriageSession | null>(null);
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSymptoms = [
    'Fever & Chills',
    'Severe Headache',
    'Persistent Cough',
    'Chest Pressure',
    'Shortness of Breath',
    'Stomach Pain',
    'Dizziness / Faintness',
  ];

  // Initialize session & check for initial query from landing page
  useEffect(() => {
    const sessionId = `session_${Date.now()}`;
    const newSession: TriageSession = {
      id: sessionId,
      title: 'New Symptom Assessment',
      createdAt: new Date().toISOString(),
      patientContext,
      messages: [],
    };
    setActiveSession(newSession);

    // Initial greeting from AI
    const initialAiMessage: ChatMessage = {
      id: `msg_0`,
      sender: 'assistant',
      content:
        "Hello! I am MediTriage AI. Please describe what symptoms you are experiencing and how long they have been present.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([initialAiMessage]);

    // Check if user came from quick start scenario
    if (typeof window !== 'undefined') {
      const initialQuery = sessionStorage.getItem('initial_symptom_query');
      if (initialQuery) {
        sessionStorage.removeItem('initial_symptom_query');
        handleSendMessage(initialQuery);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query || isLoading) return;

    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          patientContext,
        }),
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'assistant',
        content: data.message || "I have received your details.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUpQuestion: data.followUpQuestion || undefined,
        assessment: data.assessment || undefined,
      };

      const finalMessagesList = [...updatedMessages, aiMsg];
      setMessages(finalMessagesList);

      // Save session to local storage
      if (activeSession) {
        const updatedSession: TriageSession = {
          ...activeSession,
          title: query.slice(0, 35) + '...',
          patientContext,
          messages: finalMessagesList,
          finalAssessment: data.assessment || activeSession.finalAssessment,
        };
        setActiveSession(updatedSession);
        saveSession(updatedSession);
      }
    } catch (err) {
      console.error('Failed to get triage response:', err);
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'assistant',
        content: "I encountered a network issue during triage. Please try submitting again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = () => {
    const newSessionId = `session_${Date.now()}`;
    const newSession: TriageSession = {
      id: newSessionId,
      title: 'New Symptom Assessment',
      createdAt: new Date().toISOString(),
      patientContext,
      messages: [],
    };
    setActiveSession(newSession);
    setMessages([
      {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        content: "Session reset. Please describe your current symptoms.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Find latest assessment if generated
  const latestAssessment = [...messages].reverse().find((m) => m.assessment)?.assessment;

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
      {/* Left Chat Workspace */}
      <div className="flex-1 flex flex-col bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl h-[80vh] min-h-[550px]">
        {/* Chat Header Bar */}
        <div className="bg-slate-950/90 border-b border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Interactive Symptom Assessment</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h2>
              <p className="text-xs text-slate-400">
                Patient: Age {patientContext.age || 'N/A'} • {patientContext.gender} • Duration {patientContext.duration}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsIntakeOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Profile Details</span>
            </button>

            <button
              onClick={handleResetSession}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reset Conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {activeSession && latestAssessment && (
              <button
                onClick={() => setIsExportOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>
            )}
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950'
                    : 'bg-slate-800 border border-slate-700 text-cyan-400'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-3">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-tr-none shadow-lg'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p>{msg.content}</p>
                </div>

                {/* Follow-up question chip if active */}
                {msg.followUpQuestion && (
                  <div className="bg-cyan-950/40 border border-cyan-500/30 p-3 rounded-xl text-xs text-cyan-200 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-cyan-300 block mb-0.5">Clinical Follow-up Question:</span>
                      <p>{msg.followUpQuestion}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-slate-400 text-xs font-mono">
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Evaluating symptoms via WHO Triage Matrix...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Symptom Chips */}
        <div className="bg-slate-950/80 px-6 py-2 border-t border-slate-800/60 overflow-x-auto flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono text-slate-400 shrink-0">Quick Add:</span>
          {quickSymptoms.map((symptom, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(symptom)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors whitespace-nowrap"
            >
              + {symptom}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your symptoms here (e.g. I have a throbbing headache and fever since yesterday)..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500/80 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/25"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Right Column: Live Triage Card */}
      <div className="w-full lg:w-96 space-y-4">
        {latestAssessment ? (
          <TriageCard
            assessment={latestAssessment}
            onExport={() => setIsExportOpen(true)}
          />
        ) : (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center space-y-4 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 mx-auto flex items-center justify-center text-slate-400">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Live Triage Dashboard</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Describe your symptoms on the left to generate a real-time risk level assessment, condition breakdown, and emergency guidance.
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              ⚡ Safe • Confidential • WHO ETAT Guidelines Compliant
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <PatientIntakeModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        onSave={(data) => setPatientContext(data)}
        initialData={patientContext}
      />

      {activeSession && (
        <ExportModal
          session={activeSession}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
}
