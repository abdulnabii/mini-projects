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

export type ServiceNodeType = 'edge' | 'gateway' | 'service' | 'database' | 'cache' | 'queue';
export type ServiceHealthStatus = 'healthy' | 'degraded' | 'critical';

export interface ServiceNode {
  id: string;
  name: string;
  type: ServiceNodeType;
  status: ServiceHealthStatus;
  latencyMs: number;
  throughputRps: number;
  errorRatePercent: number;
  podCount?: string;
  technology?: string;
}

export interface ServiceEdge {
  id: string;
  source: string;
  target: string;
  latencyMs: number;
  status: ServiceHealthStatus;
  protocol?: string;
}

export interface ServiceTopology {
  nodes: ServiceNode[];
  edges: ServiceEdge[];
}

export interface TelemetryPoint {
  timestamp: string;
  errorRate: number; // percentage, e.g. 98.4
  p95Latency: number; // ms, e.g. 2450
  p99Latency: number; // ms, e.g. 3820
  resourceSaturation: number; // percentage, e.g. 98.0
}

export interface ErrorBudget {
  targetSlo: number; // e.g. 99.9
  periodDays: number; // e.g. 30
  totalBudgetMinutes: number; // e.g. 43.2
  minutesBurned: number; // e.g. 18.0
  burnRateMultiplier: number; // e.g. 14.4x
  estimatedExhaustionHours: number; // e.g. 2.4
}

export interface WarRoomEvent {
  id: string;
  timestamp: string;
  author: string;
  role: string;
  type: 'alert' | 'ai' | 'action' | 'note' | 'resolution';
  message: string;
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
  topology?: ServiceTopology;
  telemetry?: TelemetryPoint[];
  errorBudget?: ErrorBudget;
  warRoomEvents?: WarRoomEvent[];
}
