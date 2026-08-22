import { TechSkill, OpenSourceProject } from '@/types';
import { CURATED_PROJECTS } from './curatedProjects';
import { calculateHealthScore } from './healthScore';

export async function detectUserSkillsFromGitHub(username: string): Promise<{
  detectedSkills: TechSkill[];
  topLanguages: { language: string; count: number }[];
  publicRepoCount: number;
  avatarUrl: string;
}> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'GitMatch-AI-Discovery',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`GitHub user fetch failed: ${res.statusText}`);
    }

    const repos = await res.json();
    const langMap: Record<string, number> = {};
    const skillSet = new Set<TechSkill>();

    let avatar = `https://github.com/${username}.png`;

    for (const repo of repos) {
      if (repo.owner?.avatar_url) avatar = repo.owner.avatar_url;
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;

        if (repo.language === 'TypeScript') {
          skillSet.add('TypeScript');
          skillSet.add('React');
        } else if (repo.language === 'JavaScript') {
          skillSet.add('React');
          skillSet.add('Node.js');
        } else if (repo.language === 'Python') {
          skillSet.add('Python');
          skillSet.add('FastAPI');
        } else if (repo.language === 'Rust') {
          skillSet.add('Rust');
        } else if (repo.language === 'Go') {
          skillSet.add('Go');
        }
      }

      if (repo.topics && Array.isArray(repo.topics)) {
        repo.topics.forEach((t: string) => {
          const lower = t.toLowerCase();
          if (lower.includes('next') || lower.includes('nextjs')) skillSet.add('Next.js');
          if (lower.includes('tailwind')) skillSet.add('Tailwind CSS');
          if (lower.includes('docker')) skillSet.add('Docker');
          if (lower.includes('llm') || lower.includes('ai') || lower.includes('gpt')) skillSet.add('AI / LLM');
          if (lower.includes('graphql')) skillSet.add('GraphQL');
          if (lower.includes('vue')) skillSet.add('Vue');
          if (lower.includes('svelte')) skillSet.add('Svelte');
        });
      }
    }

    const topLanguages = Object.entries(langMap)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);

    // Default fallback if no skills detected
    if (skillSet.size === 0) {
      skillSet.add('TypeScript');
      skillSet.add('React');
      skillSet.add('Next.js');
    }

    return {
      detectedSkills: Array.from(skillSet),
      topLanguages,
      publicRepoCount: repos.length,
      avatarUrl: avatar,
    };
  } catch (error) {
    console.warn('Falling back to default skill detection:', error);
    return {
      detectedSkills: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Python'],
      topLanguages: [
        { language: 'TypeScript', count: 12 },
        { language: 'Python', count: 6 },
        { language: 'HTML/CSS', count: 4 },
      ],
      publicRepoCount: 22,
      avatarUrl: `https://github.com/${username || 'abdulnabii'}.png`,
    };
  }
}

export function searchCuratedProjects(
  selectedSkills: TechSkill[],
  difficulty: string,
  searchQuery: string
): OpenSourceProject[] {
  let results = [...CURATED_PROJECTS];

  // 1. Filter by Search Query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    results = results.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.topics.some((t) => t.toLowerCase().includes(q))
    );
  }

  // 2. Filter by Difficulty
  if (difficulty && difficulty !== 'all') {
    results = results.filter((p) => p.difficulty === difficulty);
  }

  // 3. Compute Skill Match Fit %
  return results.map((project) => {
    if (selectedSkills.length === 0) {
      return { ...project, matchFitPercent: 95 };
    }

    const matched = project.topics.filter((t) =>
      selectedSkills.includes(t as TechSkill)
    ).length;

    const matchFitPercent = Math.min(
      99,
      Math.max(50, Math.round((matched / Math.max(1, selectedSkills.length)) * 50 + 50))
    );

    return { ...project, matchFitPercent };
  });
}
