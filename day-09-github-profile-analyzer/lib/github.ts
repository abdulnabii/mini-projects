import { GitHubProfileData, LanguageStat, Repository } from '@/types';
import { calculateImpactScores } from './impact-score';
import { PRESET_PROFILES } from './mock-profiles';

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Java: '#b07219',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Dart: '#00B4AB',
};

export async function fetchRealGitHubProfile(username: string): Promise<GitHubProfileData | null> {
  const cleanUsername = username.trim().toLowerCase();

  // Check preset profiles first for instant demo loading if requested
  if (PRESET_PROFILES[cleanUsername]) {
    return PRESET_PROFILES[cleanUsername];
  }

  try {
    const headers: HeadersInit = {
      'User-Agent': 'GitPulse-AI-Analyzer',
      Accept: 'application/vnd.github.v3+json',
    };

    // 1. Fetch User Data
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!userRes.ok) {
      if (userRes.status === 404) return null;
      throw new Error(`GitHub API error: ${userRes.statusText}`);
    }

    const userData = await userRes.json();

    // 2. Fetch User Repositories
    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30`,
      { headers, next: { revalidate: 3600 } }
    );

    const reposData = reposRes.ok ? await reposRes.json() : [];

    // Parse Repositories
    const rawRepos: Repository[] = Array.isArray(reposData)
      ? reposData
          .filter((r: any) => !r.fork) // Focus on non-forked repos
          .map((r: any) => ({
            name: r.name,
            description: r.description || 'No description provided.',
            stars: r.stargazers_count || 0,
            forks: r.forks_count || 0,
            openIssues: r.open_issues_count || 0,
            primaryLanguage: r.language || 'Markdown',
            hasReadme: true,
            starGrowthRate: parseFloat(((r.stargazers_count || 0) / Math.max(1, (r.forks_count || 1) * 0.5)).toFixed(1)),
            url: r.html_url,
            updatedAt: r.updated_at ? r.updated_at.split('T')[0] : new Date().toISOString().split('T')[0],
          }))
      : [];

    const rankedRepos = calculateImpactScores(rawRepos.slice(0, 6));

    // Compute Language Statistics
    const langCounts: Record<string, number> = {};
    let totalLangCount = 0;

    rawRepos.forEach((r) => {
      if (r.primaryLanguage && r.primaryLanguage !== 'Markdown') {
        langCounts[r.primaryLanguage] = (langCounts[r.primaryLanguage] || 0) + 1;
        totalLangCount += 1;
      }
    });

    const languages: LanguageStat[] = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang, count]) => ({
        language: lang,
        percentage: totalLangCount > 0 ? Math.round((count / totalLangCount) * 100) : 20,
        color: LANGUAGE_COLORS[lang] || '#94a3b8',
        bytes: count * 50000,
      }));

    // Estimate commit stats & activity metrics based on real profile data
    const totalStars = rawRepos.reduce((acc, r) => acc + r.stars, 0);
    const estimatedCommits = Math.max(userData.public_repos * 25 + totalStars * 4, 150);

    // Generate pseudo contribution map (52 weeks x 7 days)
    const contributions = generateContributionMap(userData.login);

    return {
      username: userData.login,
      name: userData.name || userData.login,
      avatarUrl: userData.avatar_url,
      bio: userData.bio || `Developer profile for @${userData.login} on GitHub.`,
      company: userData.company || 'Independent Developer',
      location: userData.location || 'Global Citizen',
      publicRepos: userData.public_repos || 0,
      followers: userData.followers || 0,
      following: userData.following || 0,
      totalCommitsPastYear: estimatedCommits,
      currentStreakDays: Math.min(Math.floor(estimatedCommits / 25), 45),
      longestStreakDays: Math.min(Math.floor(estimatedCommits / 12), 120),
      nightOwlPercentage: 65,
      uniqueCollaborators: Math.max(Math.floor((userData.followers || 10) * 0.15), 5),
      languages: languages.length > 0 ? languages : [{ language: 'TypeScript', percentage: 100, color: '#3178c6', bytes: 100000 }],
      repos: rankedRepos,
      contributions,
      persona: {
        archetype: 'System Architect',
        summary: 'Synthesizing real-time developer metrics...',
        traits: ['Clean Code Advocate', 'Open Source Contributor'],
        funFact: 'Frequently pushes code during peak focus hours.',
        technicalStrength: 'Full-Stack Architecture & API Integration',
      },
    };
  } catch (err) {
    console.error('Error fetching real GitHub profile:', err);
    return null;
  }
}

function generateContributionMap(username: string) {
  const seed = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const days = [];
  const now = new Date();

  for (let i = 364; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const hash = (seed * (i + 1)) % 100;
    const count = hash > 75 ? Math.floor((hash - 75) / 5) : hash > 50 ? 1 : 0;
    const level = (count > 8 ? 4 : count > 5 ? 3 : count > 2 ? 2 : count > 0 ? 1 : 0) as 0 | 1 | 2 | 3 | 4;

    days.push({
      date: dateStr,
      count,
      level,
    });
  }

  return days;
}
