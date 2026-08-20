export type PipelineStage =
  | 'wishlist'
  | 'applied'
  | 'screening'
  | 'technical'
  | 'final'
  | 'offer'
  | 'archived';

export type WorkplaceType = 'Remote' | 'Hybrid' | 'Onsite';
export type JobPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface JobMatchResult {
  matchScore: number; // 0-100
  verdict: string;
  matchedSkills: string[];
  missingSkills: string[];
  resumeStrengths: string[];
  gapRecommendations: string[];
  tailoredSummary: string;
}

export interface InterviewQuestion {
  id: string;
  type: 'Technical' | 'System Design' | 'Behavioral' | 'Company Specific';
  question: string;
  whyTheyAsk: string;
  starOutline: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export interface JobApplication {
  id: string;
  companyName: string;
  roleTitle: string;
  location: string;
  workplaceType: WorkplaceType;
  salaryRange: string; // e.g. "$140k - $175k"
  jobDescription: string;
  url?: string;
  stage: PipelineStage;
  appliedDate: string;
  lastContactDate?: string;
  notes?: string;
  priority: JobPriority;
  tags: string[];
  matchResult?: JobMatchResult;
  interviewPrep?: InterviewQuestion[];
  coverLetter?: string;
}

export interface ResumeProfile {
  name: string;
  email: string;
  targetRole: string;
  yearsExperience: string;
  skills: string[];
  resumeText: string;
}

export type CoverLetterTone = 'executive' | 'enthusiastic' | 'metric' | 'creative';
