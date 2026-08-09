'use client';

import React from 'react';
import { ResumeData } from '@/types';

interface TemplateProps {
  data: ResumeData;
}

export default function MinimalTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, projects, skills, certifications } = data;

  return (
    <div className="bg-white text-slate-900 font-serif p-8 sm:p-10 shadow-2xl rounded-sm min-h-[1050px] flex flex-col justify-between border border-slate-200" id="resume-canvas">
      <div className="space-y-6">
        {/* Minimal Clean Header */}
        <div className="text-center space-y-2 border-b border-slate-300 pb-5">
          <h1 className="text-3xl font-normal tracking-wide text-slate-900 uppercase">
            {personalInfo.fullName || 'Your Full Name'}
          </h1>
          <p className="text-sm font-sans tracking-widest text-slate-600 uppercase">
            {personalInfo.title || 'Professional Title'}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-3 text-xs font-sans text-slate-600 pt-1">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
            {personalInfo.website && <span>• {personalInfo.website}</span>}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div>
            <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "{personalInfo.summary}"
            </p>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-3">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-slate-900 font-sans">
                      {exp.company} — <span className="font-serif italic font-normal text-slate-800">{exp.role}</span>
                    </h3>
                    <span className="text-[11px] font-sans text-slate-500">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 pt-1 text-xs text-slate-700 leading-relaxed font-sans">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div>
            <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Projects
            </h2>
            <div className="space-y-2">
              {projects.map((proj) => (
                <div key={proj.id} className="text-xs font-sans">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{proj.name}</span>
                    {proj.link && <span className="text-[10px] text-slate-500">{proj.link}</span>}
                  </div>
                  <p className="text-slate-600 mt-0.5">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-sans">
          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <h3 className="font-bold text-slate-900">{edu.institution}</h3>
                  <p className="text-slate-600">{edu.degree} in {edu.fieldOfStudy} ({edu.startDate} – {edu.endDate})</p>
                </div>
              ))}
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Skills
              </h2>
              <div className="space-y-1 text-xs">
                {skills.map((cat, idx) => (
                  <div key={idx}>
                    <span className="font-bold text-slate-800">{cat.category}: </span>
                    <span className="text-slate-600">{cat.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 text-[10px] text-slate-400 font-sans text-center border-t border-slate-100">
        Minimalist Resume • 30 Days 30 AI Projects
      </div>
    </div>
  );
}
