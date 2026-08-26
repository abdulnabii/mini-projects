export type Severity = 'P1' | 'P2' | 'P3' | 'P4';

export type IncidentStatus = 'investigating' | 'identified' | 'monitoring' | 'resolved';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'FATAL' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  service: string;
  message: string;
  pod?: string;
  traceId?: string;
}

export interface Deployment {
  id: string;
  version: string;
  service: string;
  deployedAt: string;
  deployedBy: string;
  commitHash: string;
  commitMessage: string;
  riskScore: 'HIGH' | 'MEDIUM' | 'LOW';
  prUrl?: string;
}

export interface RemediationStep {
  step: number;
  action: string;
  command: string;
  expectedOutcome: string;
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  isCompleted?: boolean;
}

export interface RootCauseDiagnosis {
  hypothesis: string;
  confidence: number; // e.g. 0.94
  evidenceFromLogs: string[];
  affectedService: string;
  failureMode:
    | 'CONNECTION_POOL_EXHAUSTION'
    | 'OOM_KILLED'
    | 'DATABASE_DEADLOCK'
    | 'DNS_TIMEOUT'
    | 'REDIS_MEMORY_SPIKE'
    | 'API_GATEWAY_THROTTLING'
    | 'CIRCUIT_BREAKER_OPEN'
    | 'UNHANDLED_EXCEPTION';
  blastRadius: {
    primaryImpact: string;
    secondaryImpact: string[];
    estimatedUsersAffected: number;
    estimatedRevenuePerMin: number;
  };
  remediationSteps: RemediationStep[];
  deploymentCorrelation?: {
    likelyCause: boolean;
    deployment: string;
    deployedAt: string;
    riskSignal: string;
  };
}

export interface StakeholderComms {
  slackMessage: string;
  executiveBrief: string;
  statusPageUpdate: string;
}

export interface PostMortem {
  incidentId: string;
  title: string;
  severity: Severity;
  durationMinutes: number;
  leadResponder: string;
  executiveSummary: string;
  fiveWhys: string[];
  timeline: { time: string; event: string }[];
  rootCauseDetails: string;
  contributingFactors: string[];
  actionItems: { task: string; owner: string; dueDate: string; status: 'TODO' | 'IN_PROGRESS' | 'DONE' }[];
  lessonsLearned: string[];
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  startedAt: string;
  durationMinutes: number;
  affectedUsers: number;
  revenueBurnRate: number; // in USD per min
  logs: LogEntry[];
  recentDeployments: Deployment[];
  diagnosis: RootCauseDiagnosis;
  comms: StakeholderComms;
  postMortem?: PostMortem;
}
