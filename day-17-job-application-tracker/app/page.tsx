'use client';

import { useState, useEffect } from 'react';
import { JobApplication, PipelineStage, ResumeProfile, JobMatchResult, InterviewQuestion } from '@/types';
import { getStoredJobs, saveJobsToStorage, getStoredResume, saveResumeToStorage } from '@/lib/storage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import KanbanBoard from '@/components/KanbanBoard';
import AddJobModal from '@/components/AddJobModal';
import MatchScoreModal from '@/components/MatchScoreModal';
import CoverLetterModal from '@/components/CoverLetterModal';
import InterviewPrepModal from '@/components/InterviewPrepModal';
import ResumeManagerModal from '@/components/ResumeManagerModal';
import confetti from 'canvas-confetti';
import { Briefcase, Sparkles, Plus, Award, CheckCircle2, TrendingUp, Filter } from 'lucide-react';

export default function HomePage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [resume, setResume] = useState<ResumeProfile>(getStoredResume());

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalDefaultStage, setAddModalDefaultStage] = useState<PipelineStage>('applied');
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const [activeJobForMatch, setActiveJobForMatch] = useState<JobApplication | null>(null);
  const [activeJobForCover, setActiveJobForCover] = useState<JobApplication | null>(null);
  const [activeJobForInterview, setActiveJobForInterview] = useState<JobApplication | null>(null);

  useEffect(() => {
    setJobs(getStoredJobs());
  }, []);

  const handleAddJob = (newJob: JobApplication) => {
    const updated = [newJob, ...jobs];
    setJobs(updated);
    saveJobsToStorage(updated);
  };

  const handleMoveStage = (jobId: string, targetStage: PipelineStage) => {
    const updated = jobs.map((job) => {
      if (job.id === jobId) {
        if (targetStage === 'offer') {
          try {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          } catch (e) {}
        }
        return { ...job, stage: targetStage, lastContactDate: new Date().toISOString().split('T')[0] };
      }
      return job;
    });

    setJobs(updated);
    saveJobsToStorage(updated);
  };

  const handleDeleteJob = (jobId: string) => {
    const updated = jobs.filter((j) => j.id !== jobId);
    setJobs(updated);
    saveJobsToStorage(updated);
  };

  const handleSaveMatchResult = (jobId: string, result: JobMatchResult) => {
    const updated = jobs.map((j) => (j.id === jobId ? { ...j, matchResult: result } : j));
    setJobs(updated);
    saveJobsToStorage(updated);
    if (result.matchScore >= 90) {
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
      } catch (e) {}
    }
  };

  const handleSaveCoverLetter = (jobId: string, letter: string) => {
    const updated = jobs.map((j) => (j.id === jobId ? { ...j, coverLetter: letter } : j));
    setJobs(updated);
    saveJobsToStorage(updated);
  };

  const handleSaveInterviewPrep = (jobId: string, questions: InterviewQuestion[]) => {
    const updated = jobs.map((j) => (j.id === jobId ? { ...j, interviewPrep: questions } : j));
    setJobs(updated);
    saveJobsToStorage(updated);
  };

  const handleSaveResume = (updatedResume: ResumeProfile) => {
    setResume(updatedResume);
    saveResumeToStorage(updatedResume);
  };

  const openAddModal = (defaultStage: PipelineStage = 'applied') => {
    setAddModalDefaultStage(defaultStage);
    setIsAddModalOpen(true);
  };

  // KPIs
  const activeInterviews = jobs.filter((j) => ['screening', 'technical', 'final'].includes(j.stage)).length;
  const offersCount = jobs.filter((j) => j.stage === 'offer').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#060a12] text-slate-200 selection:bg-emerald-500/30 selection:text-white">
      <Navbar
        onOpenAddModal={() => openAddModal('applied')}
        onOpenResumeModal={() => setIsResumeModalOpen(true)}
        totalJobsCount={jobs.length}
      />

      <main className="flex-1 space-y-8 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Top Header & Overview */}
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <Briefcase className="w-3.5 h-3.5" />
              <span>CANDIDATE PIPELINE WORKBENCH</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-outfit">
              Job Application Pipeline &amp; Career Hub
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Track applications, calculate instant AI resume match percentages, and prepare for interviews.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-2.5 flex-wrap font-mono text-xs">
            <div className="p-3 rounded-2xl bg-[#0b1220] border border-slate-800 text-center min-w-[90px]">
              <span className="text-xl font-black text-white font-outfit">{jobs.length}</span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase">Total Apps</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#0b1220] border border-purple-500/30 text-center min-w-[90px]">
              <span className="text-xl font-black text-purple-400 font-outfit">{activeInterviews}</span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase">Interviewing</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#0b1220] border border-emerald-500/30 text-center min-w-[90px]">
              <span className="text-xl font-black text-emerald-400 font-outfit">{offersCount}</span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase">Offers</span>
            </div>

            <button
              type="button"
              onClick={() => openAddModal('applied')}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all cursor-pointer font-outfit"
            >
              <Plus className="w-4 h-4" />
              <span>Track Application</span>
            </button>
          </div>
        </section>

        {/* 7-Stage Kanban Board */}
        <section>
          <KanbanBoard
            jobs={jobs}
            onOpenMatch={(j) => setActiveJobForMatch(j)}
            onOpenCoverLetter={(j) => setActiveJobForCover(j)}
            onOpenInterviewPrep={(j) => setActiveJobForInterview(j)}
            onMoveStage={handleMoveStage}
            onDeleteJob={handleDeleteJob}
            onOpenAddModal={(stage) => openAddModal(stage || 'applied')}
          />
        </section>
      </main>

      {/* Add Job Modal */}
      <AddJobModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddJob={handleAddJob}
        initialStage={addModalDefaultStage}
      />

      {/* Match Score Modal */}
      {activeJobForMatch && (
        <MatchScoreModal
          isOpen={!!activeJobForMatch}
          onClose={() => setActiveJobForMatch(null)}
          job={activeJobForMatch}
          resume={resume}
          onSaveMatchResult={handleSaveMatchResult}
        />
      )}

      {/* Cover Letter Modal */}
      {activeJobForCover && (
        <CoverLetterModal
          isOpen={!!activeJobForCover}
          onClose={() => setActiveJobForCover(null)}
          job={activeJobForCover}
          resume={resume}
          onSaveCoverLetter={handleSaveCoverLetter}
        />
      )}

      {/* Interview Prep Modal */}
      {activeJobForInterview && (
        <InterviewPrepModal
          isOpen={!!activeJobForInterview}
          onClose={() => setActiveJobForInterview(null)}
          job={activeJobForInterview}
          onSaveInterviewPrep={handleSaveInterviewPrep}
        />
      )}

      {/* Resume Manager Modal */}
      <ResumeManagerModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        resume={resume}
        onSaveResume={handleSaveResume}
      />

      <Footer />
    </div>
  );
}
