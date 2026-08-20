'use client';

import { useState } from 'react';
import { JobApplication, PipelineStage, WorkplaceType, JobPriority } from '@/types';
import { X, Plus, Sparkles, Building, Briefcase, MapPin, DollarSign, Tag, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: JobApplication) => void;
  initialStage?: PipelineStage;
}

export default function AddJobModal({ isOpen, onClose, onAddJob, initialStage = 'applied' }: Props) {
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [location, setLocation] = useState('Remote, US');
  const [workplaceType, setWorkplaceType] = useState<WorkplaceType>('Remote');
  const [salaryRange, setSalaryRange] = useState('$150,000 - $185,000');
  const [stage, setStage] = useState<PipelineStage>(initialStage);
  const [priority, setPriority] = useState<JobPriority>('HIGH');
  const [tagsInput, setTagsInput] = useState('React, TypeScript, Next.js');
  const [jobDescription, setJobDescription] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleTitle.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newJob: JobApplication = {
      id: `job_${Date.now()}`,
      companyName: companyName.trim(),
      roleTitle: roleTitle.trim(),
      location: location.trim() || 'Remote',
      workplaceType,
      salaryRange: salaryRange.trim(),
      stage,
      priority,
      tags,
      jobDescription: jobDescription.trim(),
      notes: notes.trim(),
      appliedDate: new Date().toISOString().split('T')[0],
    };

    onAddJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono text-xs text-slate-300">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b1220] border-2 border-emerald-500/40 p-6 sm:p-8 space-y-5 shadow-2xl shadow-emerald-500/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">Track New Job Application</h3>
              <p className="text-[11px] text-slate-400">Add company details, target role, and job description</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-emerald-400" />
                Company Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Stripe, OpenAI, Vercel"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Role */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                Role Title *
              </label>
              <input
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Location */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Workplace */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Workplace</label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value as WorkplaceType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            {/* Salary */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" />
                Salary Range
              </label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="$150,000 - $185,000"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Stage */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Initial Pipeline Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as PipelineStage)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              >
                <option value="wishlist">Wishlist</option>
                <option value="applied">Applied</option>
                <option value="screening">Phone Screen</option>
                <option value="technical">Technical Round</option>
                <option value="final">Final Round</option>
                <option value="offer">Offer Received</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as JobPriority)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              >
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Next.js, High Pay, FinTech"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Job Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Job Description (Enables AI Resume Match &amp; Cover Letter)
            </label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job requirements and role description here to enable AI matching..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all cursor-pointer font-outfit"
            >
              Add to Pipeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
