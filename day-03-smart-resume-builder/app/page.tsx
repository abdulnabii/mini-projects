'use client';

import React, { useState, useMemo } from 'react';
import { SAMPLE_PRESETS, SamplePreset } from '@/lib/sample-presets';
import { ResumeData, TemplateType, ExperienceItem, EducationItem, ProjectItem, SkillCategory } from '@/types';
import { calculateATSScore } from '@/lib/ats-scanner';
import { saveSession } from '@/lib/storage';
import ModernTemplate from '@/components/templates/ModernTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import TechTemplate from '@/components/templates/TechTemplate';
import ATSScoreGauge from '@/components/ATSScoreGauge';
import BulletRewriterModal from '@/components/BulletRewriterModal';
import {
  FileText,
  Sparkles,
  Printer,
  Save,
  Check,
  Plus,
  Trash2,
  Wand2,
  Zap,
  Target,
  Layout,
} from 'lucide-react';

export default function HomePage() {
  const [activePreset, setActivePreset] = useState<SamplePreset>(SAMPLE_PRESETS[0]);
  const [resumeData, setResumeData] = useState<ResumeData>(SAMPLE_PRESETS[0].data);
  const [targetJobDescription, setTargetJobDescription] = useState<string>(SAMPLE_PRESETS[0].targetJobDescription);
  const [template, setTemplate] = useState<TemplateType>('modern');

  // Form Navigation Tab
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'job'>('personal');

  // AI Bullet Rewriter Modal State
  const [rewritingBullet, setRewritingBullet] = useState<{ expId: string; bulletIdx: number; text: string } | null>(null);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Compute real-time ATS match analysis
  const atsResult = useMemo(() => {
    return calculateATSScore(resumeData, targetJobDescription);
  }, [resumeData, targetJobDescription]);

  const handleSelectPreset = (preset: SamplePreset) => {
    setActivePreset(preset);
    setResumeData(JSON.parse(JSON.stringify(preset.data)));
    setTargetJobDescription(preset.targetJobDescription);
  };

  const handleSave = () => {
    saveSession({
      id: `resume_${Date.now()}`,
      title: `${resumeData.personalInfo.fullName || 'Untitled'} - ${resumeData.personalInfo.title || 'Resume'}`,
      createdAt: new Date().toISOString(),
      template,
      resumeData,
      atsResult,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper functions to mutate ResumeData
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }));
  };

  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp_${Date.now()}`,
      company: 'Company Name',
      role: 'Role Title',
      location: 'City, State',
      startDate: '2023-01',
      endDate: 'Present',
      isCurrent: true,
      bullets: ['Achieved X metric by leading Y initiative...'],
    };
    setResumeData((prev) => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const updateBullet = (expId: string, bulletIdx: number, newText: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => {
        if (exp.id !== expId) return exp;
        const newBullets = [...exp.bullets];
        newBullets[bulletIdx] = newText;
        return { ...exp, bullets: newBullets };
      }),
    }));
  };

  const addBullet = (expId: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => {
        if (exp.id !== expId) return exp;
        return { ...exp, bullets: [...exp.bullets, 'New impact bullet statement...'] };
      }),
    }));
  };

  const removeBullet = (expId: string, bulletIdx: number) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => {
        if (exp.id !== expId) return exp;
        return { ...exp, bullets: exp.bullets.filter((_, idx) => idx !== bulletIdx) };
      }),
    }));
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-500/20 pb-6 no-print">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Executive Resume Builder & ATS Scanner</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Smart Resume Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build ATS-proof executive resumes, rewrite bullets with STAR impact, and preview live A4 output.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start md:self-auto font-mono">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-400 text-xs font-bold border border-slate-800 transition-all shadow-lg"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Saved Draft!' : 'Save Version'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-indigo-500/25 hover:scale-[1.02] transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Export / Print PDF</span>
          </button>
        </div>
      </div>

      {/* Preset Loader Chips */}
      <div className="bg-[#0d1117] p-3 rounded-2xl border border-indigo-500/20 overflow-x-auto flex items-center gap-2.5 no-print">
        <span className="text-xs font-mono font-bold text-amber-400 shrink-0 flex items-center gap-1.5 px-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick Load Profile:
        </span>
        {SAMPLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleSelectPreset(preset)}
            className={`text-xs px-3 py-1.5 rounded-xl font-mono transition-all border ${
              activePreset.id === preset.id
                ? 'bg-indigo-950 text-indigo-300 border-indigo-500/60 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            + {preset.title}
          </button>
        ))}
      </div>

      {/* ATS Score Header Display */}
      <div className="no-print">
        <ATSScoreGauge result={atsResult} />
      </div>

      {/* Main Split-Screen Grid: Left Editor (6 Cols), Right A4 Canvas (6 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Editor (6 Cols) */}
        <div className="lg:col-span-6 space-y-5 no-print">
          {/* Form Tabs */}
          <div className="flex bg-[#0d1117] p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-mono">
            {[
              { id: 'personal', label: 'Personal' },
              { id: 'experience', label: 'Experience' },
              { id: 'education', label: 'Edu & Projects' },
              { id: 'skills', label: 'Skills' },
              { id: 'job', label: 'Target Job Description' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Personal Info */}
          {activeTab === 'personal' && (
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-mono uppercase font-bold text-indigo-400">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 font-mono text-[11px]">Full Name</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono text-[11px]">Professional Title</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.title}
                    onChange={(e) => updatePersonalInfo('title', e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono text-[11px]">Email Address</label>
                  <input
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono text-[11px]">Phone Number</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono text-[11px]">Location (City, State)</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono text-[11px]">LinkedIn URL / Handle</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-mono text-[11px]">Professional Summary</label>
                <textarea
                  rows={3}
                  value={resumeData.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Work Experience */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase font-bold text-indigo-400">Work Experience Entries</h3>
                <button
                  type="button"
                  onClick={addExperience}
                  className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-xl border border-emerald-800/60"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Experience
                </button>
              </div>

              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-300">{exp.role} @ {exp.company}</span>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Role Title"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>

                  {/* Bullet Points List with AI STAR Button */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[11px] font-mono text-slate-400">Achievement Bullets (STAR Method)</label>
                    {exp.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => updateBullet(exp.id, bIdx, e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 font-sans"
                        />

                        <button
                          type="button"
                          onClick={() => setRewritingBullet({ expId: exp.id, bulletIdx: bIdx, text: bullet })}
                          className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-mono flex items-center gap-1 shadow hover:scale-105 shrink-0"
                          title="Rewrite with AI STAR method"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">AI Fix</span>
                        </button>

                        <button
                          onClick={() => removeBullet(exp.id, bIdx)}
                          className="p-2.5 text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addBullet(exp.id)}
                      className="text-xs font-mono text-indigo-400 hover:underline flex items-center gap-1 pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Bullet Point
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Education & Projects */}
          {activeTab === 'education' && (
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-mono uppercase font-bold text-indigo-400">Education Details</h3>
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item) => (item.id === edu.id ? { ...item, institution: e.target.value } : item)),
                      }))
                    }
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item) => (item.id === edu.id ? { ...item, degree: e.target.value } : item)),
                      }))
                    }
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Skills */}
          {activeTab === 'skills' && (
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-mono uppercase font-bold text-indigo-400">Skills Categories</h3>
              {resumeData.skills.map((cat, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <label className="text-slate-400 font-mono text-[11px]">{cat.category}</label>
                  <input
                    type="text"
                    value={cat.skills.join(', ')}
                    onChange={(e) => {
                      const newSkills = e.target.value.split(',').map((s) => s.trim());
                      setResumeData((prev) => ({
                        ...prev,
                        skills: prev.skills.map((c, i) => (i === idx ? { ...c, skills: newSkills } : c)),
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tab 5: Target Job Description */}
          {activeTab === 'job' && (
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                <Target className="w-4 h-4" />
                <span>Target Job Description Scanner</span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Paste the job description of the role you are applying for to recalculate ATS match percentage and missing keywords.
              </p>
              <textarea
                rows={8}
                value={targetJobDescription}
                onChange={(e) => setTargetJobDescription(e.target.value)}
                placeholder="Paste job description keywords, requirements, and qualifications..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 font-sans leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Right Column: Live A4 Document Canvas & Template Switcher (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Template Switcher Bar */}
          <div className="bg-[#0d1117] p-2 rounded-2xl border border-indigo-500/20 flex items-center justify-between gap-2 no-print">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pl-2">
              <Layout className="w-4 h-4 text-indigo-400" />
              <span>Template:</span>
            </div>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setTemplate('modern')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  template === 'modern' ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-800' : 'text-slate-400'
                }`}
              >
                Modern Accent
              </button>
              <button
                onClick={() => setTemplate('minimal')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  template === 'minimal' ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-800' : 'text-slate-400'
                }`}
              >
                Minimalist
              </button>
              <button
                onClick={() => setTemplate('tech')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  template === 'tech' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800' : 'text-slate-400'
                }`}
              >
                Tech Monospace
              </button>
            </div>
          </div>

          {/* Live Rendered Canvas */}
          <div className="overflow-x-auto">
            {template === 'modern' && <ModernTemplate data={resumeData} />}
            {template === 'minimal' && <MinimalTemplate data={resumeData} />}
            {template === 'tech' && <TechTemplate data={resumeData} />}
          </div>
        </div>
      </div>

      {/* Per-Bullet AI Rewriter Modal */}
      {rewritingBullet && (
        <BulletRewriterModal
          originalBullet={rewritingBullet.text}
          role={resumeData.personalInfo.title}
          targetJobDescription={targetJobDescription}
          onApply={(newText) => updateBullet(rewritingBullet.expId, rewritingBullet.bulletIdx, newText)}
          onClose={() => setRewritingBullet(null)}
        />
      )}
    </div>
  );
}
