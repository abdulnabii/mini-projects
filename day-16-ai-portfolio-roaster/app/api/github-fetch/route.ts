import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { githubInput }: { githubInput: string } = await req.json();

    if (!githubInput || !githubInput.trim()) {
      return NextResponse.json({ error: 'GitHub username or URL is required' }, { status: 400 });
    }

    // Parse username from URL or clean input
    let username = githubInput.trim();
    username = username.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/.*$/, '').replace(/^@/, '');

    if (!username) {
      return NextResponse.json({ error: 'Invalid GitHub profile identifier' }, { status: 400 });
    }

    // Fetch user profile from GitHub API
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'User-Agent': 'PortfolioRoaster-AI-App',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userRes.ok) {
      if (userRes.status === 404) {
        return NextResponse.json({ error: `GitHub user "${username}" was not found.` }, { status: 404 });
      }
      return NextResponse.json({ error: 'GitHub API rate limit reached or user unreachable.' }, { status: userRes.status });
    }

    const userData = await userRes.json();

    // Fetch top public repos
    let reposData = [];
    try {
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
        headers: {
          'User-Agent': 'PortfolioRoaster-AI-App',
          Accept: 'application/vnd.github.v3+json',
        },
      });
      if (reposRes.ok) {
        reposData = await reposRes.json();
      }
    } catch (e) {
      console.warn('Failed to fetch user repos:', e);
    }

    const topRepos = (Array.isArray(reposData) ? reposData : []).map((r: any) => ({
      name: r.name,
      description: r.description || 'No description provided.',
      language: r.language || 'Markdown / Other',
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
    }));

    const formattedProjects = topRepos
      .map(
        (r, i) =>
          `${i + 1}. ${r.name} (${r.language}) — ${r.description} [⭐ ${r.stars} stars, 🍴 ${r.forks} forks]`
      )
      .join('\n');

    return NextResponse.json({
      username: userData.login,
      name: userData.name || userData.login,
      avatarUrl: userData.avatar_url,
      bio: userData.bio || 'No GitHub bio set.',
      location: userData.location || 'Remote',
      company: userData.company || 'Independent',
      blog: userData.blog || `https://github.com/${userData.login}`,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      topRepos,
      formattedProjectsText: formattedProjects || 'No public repositories found.',
    });
  } catch (err) {
    console.error('GitHub fetch API error:', err);
    return NextResponse.json({ error: 'Internal error fetching GitHub profile' }, { status: 500 });
  }
}
