export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type LoadProfileType = 'constant' | 'ramping_spike' | 'stress' | 'soak';

export interface HttpHeader {
  key: string;
  value: string;
  enabled: boolean;
}

export interface TestConfig {
  id: string;
  title: string;
  url: string;
  method: HttpMethod;
  headers: HttpHeader[];
  bodyType: 'none' | 'json' | 'raw';
  bodyContent?: string;
  authType: 'none' | 'bearer' | 'api_key' | 'basic';
  authValue?: string;
  virtualUsers: number; // e.g. 50
  durationSeconds: number; // e.g. 20s
  rampUpSeconds: number; // e.g. 5s
  loadProfile: LoadProfileType;
  timeoutMs: number; // e.g. 5000
}

export interface MetricPoint {
  timestampSec: number;
  activeVus: number;
  rps: number; // requests per second
  p50Ms: number;
  p90Ms: number;
  p95Ms: number;
  p99Ms: number;
  errorRatePercent: number;
  bytesPerSec: number;
}

export interface StatusCodeCount {
  code: number;
  count: number;
  description: string;
  isError: boolean;
}

export interface ErrorSample {
  timestamp: string;
  statusCode: number;
  message: string;
  samplePayload?: string;
}

export interface LatencyPercentiles {
  min: number;
  p50: number; // median
  p75: number;
  p90: number;
  p95: number;
  p99: number;
  p999: number;
  max: number;
  mean: number;
}

export interface BottleneckIssue {
  id: string;
  type:
    | 'DATABASE_CONNECTION_POOL'
    | 'MISSING_CACHE_LAYER'
    | 'CPU_EVENT_LOOP_LAG'
    | 'RATE_LIMITER_TRIP'
    | 'MEMORY_ALLOCATION_LEAK'
    | 'NETWORK_SOCKET_SATURATION';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  evidence: string;
  rootCause: string;
  remediationStep: string;
  estimatedGain: string;
}

export interface PerformanceAnalysis {
  verdict: 'PASS' | 'WARNING' | 'CRITICAL_FAIL';
  performanceScore: number; // 0-100
  summary: string;
  bottlenecks: BottleneckIssue[];
  architecturalSuggestions: string[];
}

export interface TestResult {
  id: string;
  config: TestConfig;
  startedAt: string;
  completedAt: string;
  status: 'running' | 'completed' | 'aborted' | 'failed';
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  errorRate: number; // percentage
  avgRps: number;
  peakRps: number;
  totalDataTransferMb: number;
  percentiles: LatencyPercentiles;
  statusCodes: StatusCodeCount[];
  recentErrors: ErrorSample[];
  timeSeries: MetricPoint[];
  aiAnalysis?: PerformanceAnalysis;
}
