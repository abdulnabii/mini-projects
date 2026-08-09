'use client';

import React from 'react';
import { ResumeData } from '@/types';
import { Terminal, Code, Cpu, Shield, ExternalLink } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

export default function TechTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, projects, skills, certifications } = data;

  return (
    <div className="bg-[#0b0f19] text-slate-100 font-mono p-8 sm:p-10 shadow-2xl rounded-sm min-h-[1050px] flex flex-col justify-between border border-emerald-500/20" id="resume-canvas">
      <div className="space-y-6">
        {/* Terminal Header */}
        <div className="border-b border-emerald-500/30 pb-5 space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-emerald-400 tracking-tight">
              &gt; {personalInfo.fullName || 'Developer Name'}
            </h1>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
              DEV_ID: 0x3F82
            </span>
          </div>

          <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
            // {personalInfo.title || 'Full Stack Engineer'}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
            {personalInfo.email && <span>email: {personalInfo.email}</span>}
            {personalInfo.github && <span className="text-emerald-400">github: {personalInfo.github}</span>}
            {personalInfo.website && <span className="text-purple-400">web: {personalInfo.website}</span>}
            {personalInfo.location && <span>loc: {personalInfo.location}</span>}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-emerald-400 font-bold">$ cat summary.txt</span>
            <p className="text-slate-300 leading-relaxed mt-1 font-sans">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2 border-b border-slate-800 pb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>Experience Log</span>
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline text-xs">
                    <h3 className="font-bold text-white">
                      {exp.role} <span className="text-emerald-400">@{exp.company}</span>
                    </h3>
                    <span className="text-[10px] text-slate-500">
                      [{exp.startDate} :: {exp.isCurrent ? 'NOW' : exp.endDate}]
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 pt-1 text-xs text-slate-300 leading-relaxed font-sans">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Matrix */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-2 border-b border-slate-800 pb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>Technical Stack & Skills Matrix</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {skills.map((cat, idx) => (
                <div key={idx} className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                  <span className="text-emerald-400 font-bold">{cat.category}:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cat.skills.map((sk, sIdx) => (
                      <span key={sIdx} className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded text-[10px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects & Education */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {projects && projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 border-b border-slate-800 pb-1">
                // Projects
              </h2>
              {projects.map((proj) => (
                <div key={proj.id} className="bg-slate-900/40 p-2 rounded border border-slate-800 mb-2">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>{proj.name}</span>
                    {proj.link && <ExternalLink className="w-3 h-3 text-emerald-400" />}
                  </div>
                  <p className="text-slate-400 text-[11px] font-sans mt-0.5">{proj.description}</p>
                </div>
              ))}
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 border-b border-slate-800 pb-1">
                // Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <h3 className="font-bold text-white">{edu.degree}</h3>
                  <p className="text-slate-400">{edu.institution} ({edu.startDate} – {edu.endDate})</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 text-[10px] text-slate-500 font-mono text-center border-t border-slate-900">
        Tech Developer Monospace Resume • 30 Days 30 AI Projects
      </div>
    </div>
  );
}
