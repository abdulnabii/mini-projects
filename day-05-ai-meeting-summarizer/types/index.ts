export interface Attendee {
  name: string;
  role: string | null;
}

export interface Decision {
  decision: string;
  timestamp: string | null;
  decisionMaker: string | null;
}

export interface ActionItem {
  id: string;
  task: string;
  assignee: string | null;
  deadline: string | null;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Blocker {
  description: string;
  raisedBy: string | null;
  severity: 'CRITICAL' | 'MODERATE' | 'MINOR';
}

export type MeetingSentiment = 'positive' | 'neutral' | 'tense' | 'mixed';

export interface MeetingIntelligence {
  attendees: Attendee[];
  decisions: Decision[];
  actionItems: ActionItem[];
  blockers: Blocker[];
  executiveSummary: string;
  meetingDuration: string | null;
  sentiment: MeetingSentiment;
}

export interface MeetingSession {
  id: string;
  title: string;
  createdAt: string;
  transcriptSnippet: string;
  intelligence: MeetingIntelligence;
}
