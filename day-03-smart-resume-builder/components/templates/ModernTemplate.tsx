'use client';

import React from 'react';
import { ResumeData } from '@/types';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

export default function ModernTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, projects, skills, certifications } = data;

  return (
    <div className="bg-white text-slate-900 font-sans p-8 sm:p-10 shadow-2xl rounded-sm min-h-[1050px] flex flex-col justify-between border border-slate-200" id="resume-canvas">
      <div className="space-y-6">
        {/* Modern Indigo Executive Header */}
        <div className="border-b-2 border-indigo-600 pb-5">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {personalInfo.fullName || 'Your Full Name'}
          </h1>
          <p className="text-base font-semibold text-indigo-600 uppercase tracking-wide mt-1">
            {personalInfo.title || 'Professional Title'}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-600">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-indigo-600" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 text-indigo-600" />
                {personalInfo.linkedin}
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-indigo-600" />
                {personalInfo.github}
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                {personalInfo.website}
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 border-b border-slate-200 pb-1">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-slate-900">
                      {exp.role} <span className="font-normal text-slate-600">at {exp.company}</span>
                    </h3>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.location && <p className="text-[11px] text-slate-500 italic">{exp.location}</p>}

                  <ul className="list-disc list-inside space-y-1 pt-1 text-xs text-slate-700 leading-relaxed">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className="pl-1">{bullet}</li>
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 border-b border-slate-200 pb-1">
              Key Projects
            </h2>
            <div className="space-y-2">
              {projects.map((proj) => (
                <div key={proj.id} className="text-xs">
                  <div className="flex justify-between items-baseline font-semibold text-slate-900">
                    <span>{proj.name}</span>
                    {proj.link && <span className="text-[10px] text-indigo-600 font-mono">{proj.link}</span>}
                  </div>
                  <p className="text-slate-600 mt-0.5">{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.technologies.map((tech, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 border-b border-slate-200 pb-1">
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <h3 className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</h3>
                    <p className="text-slate-600">{edu.institution} ({edu.startDate} – {edu.endDate})</p>
                    {edu.gpa && <p className="text-[11px] text-slate-500">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 border-b border-slate-200 pb-1">
                Technical Skills
              </h2>
              <div className="space-y-1.5 text-xs">
                {skills.map((cat, idx) => (
                  <div key={idx}>
                    <span className="font-semibold text-slate-800">{cat.category}: </span>
                    <span className="text-slate-600">{cat.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1.5 border-b border-slate-200 pb-1">
              Certifications
            </h2>
            <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
              {certifications.map((cert, idx) => (
                <li key={idx}>{cert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="pt-6 text-[10px] text-slate-400 font-mono text-center border-t border-slate-100">
        Generated via Smart Resume Builder • resume-builder.aiwithab.site
      </div>
    </div>
  );
}
