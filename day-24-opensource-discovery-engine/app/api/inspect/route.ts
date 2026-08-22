import { NextRequest, NextResponse } from 'next/server';
import { calculateHealthScore } from '@/lib/healthScore';
import { generateFirstPrGuideWithGemini } from '@/lib/gemini';
import { OpenSourceProject, GoodFirstIssue } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { repoInput } = body;

    if (!repoInput || typeof repoInput !== 'string') {
      return NextResponse.json({ error: 'Repository name or URL is required' }, { status: 400 });
    }

    // Clean input: handle "https://github.com/owner/repo" or "owner/repo"
    let clean = repoInput.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
    const parts = clean.split('/');
    if (parts.length < 2) {
      return NextResponse.json({ error: 'Please enter in format "owner/repo" or full GitHub URL' }, { status: 400 });
    }

    const owner = parts[0];
    const repo = parts[1];
    const fullName = `${owner}/${repo}`;

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'GitMatch-AI-Inspector',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    // 1. Fetch Repository Details
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) {
      return NextResponse.json({ error: `GitHub repository "${fullName}" not found (${repoRes.statusText})` }, { status: 404 });
    }
    const repoData = await repoRes.json();

    // 2. Fetch Recent Commits for recency calculation
    let daysSinceLastCommit = 2;
    try {
      const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers });
      if (commitsRes.ok) {
        const commits = await commitsRes.json();
        if (commits[0]?.commit?.committer?.date) {
          const commitDate = new Date(commits[0].commit.committer.date);
          const diffMs = Date.now() - commitDate.getTime();
          daysSinceLastCommit = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        }
      }
    } catch (e) {
      console.warn('Commits fetch skipped:', e);
    }

    // 3. Fetch Good First Issues
    const openGoodFirstIssues: GoodFirstIssue[] = [];
    try {
      const issuesRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues?labels=good%20first%20issue,good-first-issue,help%20wanted&state=open&per_page=5`,
        { headers }
      );
      if (issuesRes.ok) {
        const issuesData = await issuesRes.json();
        issuesData.forEach((iss: any) => {
          if (!iss.pull_request) {
            openGoodFirstIssues.push({
              id: iss.id,
              number: iss.number,
              title: iss.title,
              url: iss.html_url,
              comments: iss.comments,
              createdAt: iss.created_at,
              labels: (iss.labels || []).map((l: any) => l.name),
            });
          }
        });
      }
    } catch (e) {
      console.warn('Issues fetch skipped:', e);
    }

    const health = calculateHealthScore(
      daysSinceLastCommit,
      Math.max(1, Math.min(10, Math.round(daysSinceLastCommit * 1.2) || 2)),
      90,
      95,
      repoData.open_issues_count || 10,
      openGoodFirstIssues.length
    );

    const project: OpenSourceProject = {
      id: `inspect_${owner}_${repo}`,
      owner,
      repo,
      fullName,
      description: repoData.description || 'Open-source project on GitHub',
      stars: repoData.stargazers_count || 0,
      starVelocityMonth: Math.round((repoData.stargazers_count || 1000) * 0.05),
      forks: repoData.forks_count || 0,
      language: repoData.language || 'TypeScript',
      topics: (repoData.topics && repoData.topics.length > 0) ? repoData.topics : [repoData.language || 'TypeScript', 'Open Source'],
      healthScore: health,
      aiSummary: repoData.description || 'A modern open-source repository designed for high performance and community extensibility.',
      difficulty: openGoodFirstIssues.length > 0 ? 'beginner' : 'intermediate',
      license: repoData.license?.spdx_id || 'MIT',
      githubUrl: repoData.html_url,
      homepageUrl: repoData.homepage || repoData.html_url,
      openGoodFirstIssues,
    };

    // Enrich with Gemini First PR blueprint
    try {
      const guide = await generateFirstPrGuideWithGemini(project, [project.language as any, 'React', 'TypeScript']);
      project.defaultGuide = guide;
    } catch (e) {
      console.warn('Guide generation error:', e);
    }

    return NextResponse.json({ project });
  } catch (error: any) {
    console.error('Inspect API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to inspect repository' }, { status: 500 });
  }
}
