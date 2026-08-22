'use client';

import { useState, useEffect } from 'react';
import { TechSkill, DifficultyLevel, OpenSourceProject, ContributionTarget } from '@/types';
import { CURATED_PROJECTS } from '@/lib/curatedProjects';
import SkillFilterBar from '@/components/SkillFilterBar';
import ProjectCard from '@/components/ProjectCard';
import FirstContributionGuide from '@/components/FirstContributionGuide';
import UserSkillDetector from '@/components/UserSkillDetector';
import {
  Sparkles,
  GitPullRequest,
  Star,
  Activity,
  Compass,
  Zap,
  TrendingUp,
  BookmarkCheck,
} from 'lucide-react';

const ALL_SKILLS: TechSkill[] = [
  'TypeScript',
  'React',
  'Next.js',
  'Tailwind CSS',
  'Python',
  'Rust',
  'Go',
  'FastAPI',
  'AI / LLM',
  'Node.js',
  'Docker',
  'GraphQL',
];

const STORAGE_BOOKMARKS_KEY = 'gitmatch_bookmarked_targets';

export default function DiscoveryPage() {
  const [selectedSkills, setSelectedSkills] = useState<TechSkill[]>([
    'TypeScript',
    'React',
    'Next.js',
  ]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<OpenSourceProject[]>(CURATED_PROJECTS);
  const [bookmarkedTargets, setBookmarkedTargets] = useState<ContributionTarget[]>([]);

  const [activeGuideProject, setActiveGuideProject] = useState<OpenSourceProject | null>(null);
  const [isDetectorOpen, setIsDetectorOpen] = useState(false);

  // Load saved bookmarks from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
      if (raw) setBookmarkedTargets(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load bookmarks:', e);
    }
  }, []);

  // Filter & match calculation
  useEffect(() => {
    let filtered = CURATED_PROJECTS;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.topics.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter((p) => p.difficulty === selectedDifficulty);
    }

    // Match fit percent calculation
    const scored = filtered.map((project) => {
      if (selectedSkills.length === 0) {
        return { ...project, matchFitPercent: 95 };
      }
      const matchedCount = project.topics.filter((t) =>
        selectedSkills.includes(t as TechSkill)
      ).length;

      const matchFitPercent = Math.min(
        99,
        Math.max(50, Math.round((matchedCount / Math.max(1, selectedSkills.length)) * 50 + 50))
      );
      return { ...project, matchFitPercent };
    });

    // Sort by matchFitPercent desc, then starVelocityMonth desc
    scored.sort((a, b) => {
      const fitA = a.matchFitPercent || 0;
      const fitB = b.matchFitPercent || 0;
      if (fitB !== fitA) return fitB - fitA;
      return b.starVelocityMonth - a.starVelocityMonth;
    });

    setProjects(scored);
  }, [selectedSkills, selectedDifficulty, searchQuery]);

  const handleToggleSkill = (skill: TechSkill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleClearSkills = () => {
    setSelectedSkills([]);
  };

  const handleToggleBookmark = (project: OpenSourceProject) => {
    const isSaved = bookmarkedTargets.some((t) => t.projectFullName === project.fullName);
    let updated: ContributionTarget[];

    if (isSaved) {
      updated = bookmarkedTargets.filter((t) => t.projectFullName !== project.fullName);
    } else {
      const newTarget: ContributionTarget = {
        id: 'target_' + Date.now(),
        projectFullName: project.fullName,
        projectUrl: project.githubUrl,
        status: 'targeted',
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updated = [newTarget, ...bookmarkedTargets];
    }

    setBookmarkedTargets(updated);
    try {
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save bookmarks:', e);
    }
  };

  return (
    <div className="space-y-10 font-mono w-full min-w-0">
      {/* Centered Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-POWERED OPEN SOURCE MATCHMAKER &amp; FIRST-PR ACCELERATOR</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit">
          Discover &amp; Conquer Your First{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
            Open Source Contribution
          </span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-2xl mx-auto leading-relaxed">
          Match your exact tech skills with healthy, responsive repositories. Get plain-English explanations and step-by-step first PR blueprints generated by Gemini 1.5.
        </p>
      </div>

      {/* 4 Telemetry Strip Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-5xl mx-auto font-mono text-left">
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-emerald-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> Matching Repos
          </span>
          <div className="text-lg font-black text-white">{projects.length} Verified Projects</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-cyan-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Top Star Velocity
          </span>
          <div className="text-lg font-black text-cyan-300">+6.2k Stars / mo</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-amber-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Avg PR Review
          </span>
          <div className="text-lg font-black text-amber-300">~2.1 Days (Grade A+)</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-purple-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-purple-400 font-bold uppercase flex items-center gap-1.5">
            <BookmarkCheck className="w-3.5 h-3.5" /> PR Pipeline
          </span>
          <div className="text-lg font-black text-purple-300">
            {bookmarkedTargets.length} Saved Targets
          </div>
        </div>
      </div>

      {/* Skill Filter Matrix & Difficulty Selector */}
      <SkillFilterBar
        availableSkills={ALL_SKILLS}
        selectedSkills={selectedSkills}
        onToggleSkill={handleToggleSkill}
        onClearSkills={handleClearSkills}
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={(diff) => setSelectedDifficulty(diff)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onAutoDetectClick={() => setIsDetectorOpen(true)}
      />

      {/* Repository Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase">
              MATCH FEED
            </span>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Recommended Open Source Projects ({projects.length})
            </h3>
          </div>
          <span className="text-[10px] text-slate-500">
            Sorted by AI skill match &amp; maintainer responsiveness
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isBookmarked={bookmarkedTargets.some(
                (t) => t.projectFullName === project.fullName
              )}
              onToggleBookmark={handleToggleBookmark}
              onOpenGuide={(p) => setActiveGuideProject(p)}
            />
          ))}
        </div>
      </div>

      {/* First Contribution Guide Modal */}
      <FirstContributionGuide
        project={activeGuideProject}
        userSkills={selectedSkills}
        isOpen={!!activeGuideProject}
        onClose={() => setActiveGuideProject(null)}
      />

      {/* User Skill Auto-Detector Modal */}
      <UserSkillDetector
        isOpen={isDetectorOpen}
        onClose={() => setIsDetectorOpen(false)}
        onApplySkills={(detected) => setSelectedSkills(detected)}
      />
    </div>
  );
}
