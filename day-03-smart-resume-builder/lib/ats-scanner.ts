import { ResumeData, ATSAnalysisResult } from '@/types';

// Stopwords to filter out non-essential terms
const STOPWORDS = new Set([
  'and', 'the', 'is', 'in', 'at', 'of', 'a', 'an', 'to', 'for', 'with', 'on', 'as', 'by', 'that',
  'this', 'it', 'from', 'or', 'be', 'are', 'was', 'were', 'will', 'have', 'has', 'had', 'do',
  'does', 'did', 'we', 'you', 'our', 'your', 'my', 'their', 'must', 'should', 'can', 'could',
  'experience', 'work', 'using', 'ability', 'proficient', 'knowledge', 'responsibilities'
]);

export function calculateATSScore(
  resumeData: ResumeData,
  jobDescription: string
): ATSAnalysisResult {
  if (!jobDescription.trim()) {
    return {
      score: 100,
      grade: 'A',
      summary: 'Paste a target job description to compute real-time ATS match % and gap analysis.',
      matchedKeywords: [],
      missingKeywords: [],
      suggestions: ['Add a target job description to get tailored ATS recommendations.'],
      keywordDensity: 0,
    };
  }

  // Combine full resume text
  const resumeTextParts: string[] = [
    resumeData.personalInfo.summary,
    resumeData.personalInfo.title,
    ...resumeData.experience.flatMap((e) => [e.company, e.role, ...e.bullets]),
    ...resumeData.skills.flatMap((s) => [s.category, ...s.skills]),
    ...resumeData.projects.flatMap((p) => [p.name, p.description, ...p.technologies]),
    ...resumeData.certifications,
  ];

  const fullResumeText = resumeTextParts.join(' ').toLowerCase();

  // Extract candidate keywords from Job Description
  const rawWords = jobDescription
    .replace(/[^\w\s\+\#\-\.]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

  // Count word frequencies in JD to find high-value skills & requirements
  const wordFreqMap = new Map<string, number>();
  rawWords.forEach((w) => {
    wordFreqMap.set(w, (wordFreqMap.get(w) || 0) + 1);
  });

  // Extract top target keywords (up to 25)
  const sortedKeywords = Array.from(wordFreqMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0])
    .slice(0, 20);

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  sortedKeywords.forEach((kw) => {
    if (fullResumeText.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const total = sortedKeywords.length || 1;
  const matchRatio = matchedKeywords.length / total;
  const baseScore = Math.round(matchRatio * 100);

  // Bonus for section completeness
  let bonus = 0;
  if (resumeData.personalInfo.summary.length > 50) bonus += 5;
  if (resumeData.experience.length >= 2) bonus += 5;
  if (resumeData.skills.length >= 2) bonus += 5;

  const score = Math.min(100, Math.max(20, baseScore + bonus));

  let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (score >= 85) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 55) grade = 'C';
  else if (score >= 40) grade = 'D';

  const suggestions: string[] = [];
  if (missingKeywords.length > 0) {
    suggestions.push(
      `Inject missing target keywords into experience bullets: ${missingKeywords.slice(0, 5).join(', ')}.`
    );
  }
  if (resumeData.personalInfo.summary.length < 80) {
    suggestions.push('Expand professional summary to at least 2-3 sentences with quantifiable metrics.');
  }
  if (matchedKeywords.length >= 5) {
    suggestions.push(`Great job! You have strong keyword overlap for: ${matchedKeywords.slice(0, 4).join(', ')}.`);
  }

  const wordCount = fullResumeText.split(/\s+/).length || 1;
  const keywordHits = matchedKeywords.length;
  const keywordDensity = Number(((keywordHits / wordCount) * 100).toFixed(1));

  return {
    score,
    grade,
    summary: `ATS Compatibility Score: ${score}/100 (${matchedKeywords.length} of ${sortedKeywords.length} target keywords matched).`,
    matchedKeywords,
    missingKeywords,
    suggestions,
    keywordDensity,
  };
}
