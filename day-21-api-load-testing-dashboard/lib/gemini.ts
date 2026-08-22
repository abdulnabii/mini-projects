import { GoogleGenerativeAI } from '@google/generative-ai';
import { TestResult, PerformanceAnalysis } from '@/types';
import { BENCHMARK_PRESETS } from './sampleBenchmarks';

const apiKey = process.env.GEMINI_API_KEY;

export async function analyzeTestResultsWithGemini(
  testResult: TestResult
): Promise<PerformanceAnalysis> {
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const p = testResult.percentiles;
      const statusSummary = testResult.statusCodes.map((s) => `${s.code}: ${s.count}`).join(', ');

      const prompt = `You are a Principal Site Reliability Engineer (SRE) and Performance Systems Architect.
Analyze these real-time API Load Test metrics and diagnose the system bottlenecks with precision engineering recommendations:

Target Endpoint: ${testResult.config.method} ${testResult.config.url}
Virtual Users: ${testResult.config.virtualUsers} VUs (Profile: ${testResult.config.loadProfile})
Duration: ${testResult.config.durationSeconds}s
Total Requests: ${testResult.totalRequests}
Throughput: ${testResult.avgRps} avg RPS (Peak: ${testResult.peakRps} RPS)
Error Rate: ${testResult.errorRate}%
Latency Distribution:
- Min: ${p.min}ms
- P50 (Median): ${p.p50}ms
- P75: ${p.p75}ms
- P90: ${p.p90}ms
- P95: ${p.p95}ms
- P99: ${p.p99}ms
- Max: ${p.max}ms
- Mean: ${p.mean}ms
Status Codes: ${statusSummary}
Recent Error Samples: ${JSON.stringify(testResult.recentErrors.slice(0, 3))}

Rules:
- Formulate a strict engineering verdict: "PASS" (score > 80, error < 1%), "WARNING" (score 50-80, high P99/P50 ratio > 4x or error 1-5%), "CRITICAL_FAIL" (score < 50 or errors > 5%).
- Identify 1 to 3 specific bottleneck issues with concrete evidence, root causes, actionable remediation steps, and estimated % gain.
- Give a crisp 2-sentence executive summary.

Return ONLY valid JSON matching this schema (no markdown formatting, no backticks):
{
  "verdict": "PASS",
  "performanceScore": 85,
  "summary": "Target endpoint sustained 189 RPS with solid median latency. Tail latency degradation observed at peak concurrency due to origin database query contention.",
  "bottlenecks": [
    {
      "id": "b1",
      "type": "DATABASE_CONNECTION_POOL",
      "severity": "HIGH",
      "title": "PostgreSQL Connection Pool Exhaustion",
      "evidence": "P99 latency of 1420ms is 7.7x higher than P50 (184ms) under 75 VUs load.",
      "rootCause": "Synchronous database pool max_connections saturated, causing request queue backlog.",
      "remediationStep": "Deploy PgBouncer in transaction pooling mode and increase max_pool from 10 to 40.",
      "estimatedGain": "60% reduction in P99 tail latency"
    }
  ],
  "architecturalSuggestions": [
    "Implement Edge CDN Cache-Control headers with 5-minute s-maxage for read queries",
    "Enable TCP keep-alive sockets to reduce TLS handshake negotiation overhead"
  ]
}`;

      const res = await model.generateContent(prompt);
      const text = res.response
        .text()
        .trim()
        .replace(/^```json\n?/, '')
        .replace(/\n?```$/, '')
        .replace(/^```\n?/, '');

      return JSON.parse(text);
    } catch (err) {
      console.warn('Gemini performance analysis error:', err);
    }
  }

  // Fallback performance analysis based on statistical heuristics
  const p = testResult.percentiles;
  const isHighTail = p.p99 > p.p50 * 5 && p.p99 > 500;
  const isHighError = testResult.errorRate > 3;

  if (isHighError || p.p99 > 3000) {
    return {
      verdict: 'CRITICAL_FAIL',
      performanceScore: 45,
      summary: `High error rate (${testResult.errorRate}%) and severe tail latency spikes observed. System is unable to sustain ${testResult.config.virtualUsers} concurrent virtual users.`,
      bottlenecks: [
        {
          id: 'b_err',
          type: 'DATABASE_CONNECTION_POOL',
          severity: 'CRITICAL',
          title: 'Upstream Service & Socket Starvation',
          evidence: `P99 reached ${p.p99}ms with ${testResult.failedRequests} dropped requests.`,
          rootCause: 'Connection timeouts and unhandled promise queue exhaustion on server event loop.',
          remediationStep: 'Increase upstream timeout limits and implement circuit breakers with exponential backoff.',
          estimatedGain: 'Eliminate 5xx dropped requests & stabilize P99',
        },
      ],
      architecturalSuggestions: [
        'Scale horizontal replicas in Kubernetes Deployment',
        'Add Redis caching layer to offload repetitive database lookups',
      ],
    };
  }

  if (isHighTail) {
    return {
      verdict: 'WARNING',
      performanceScore: 72,
      summary: `System handled ${testResult.totalRequests} requests, but exhibits noticeable tail latency variance (P99: ${p.p99}ms vs P50: ${p.p50}ms).`,
      bottlenecks: [
        {
          id: 'b_tail',
          type: 'MISSING_CACHE_LAYER',
          severity: 'HIGH',
          title: 'Missing Response Caching & Heavy Query Overhead',
          evidence: `P99 latency is ${Math.round(p.p99 / (p.p50 || 1))}x higher than median response time under concurrency.`,
          rootCause: 'Origin compute and database engine re-executing query pipelines for every request.',
          remediationStep: 'Implement in-memory cache (Redis / Valkey) with 60s TTL on high-volume GET routes.',
          estimatedGain: '70% P99 reduction & 3x throughput capacity',
        },
      ],
      architecturalSuggestions: [
        'Add compound database index on query filter parameters',
        'Enable HTTP/2 or HTTP/3 multiplexing',
      ],
    };
  }

  return {
    verdict: 'PASS',
    performanceScore: 92,
    summary: `Excellent performance profile! Target API sustained ${testResult.avgRps} RPS with tight latency bounds across all percentiles.`,
    bottlenecks: [],
    architecturalSuggestions: [
      'Enable gzip/brotli compression for payload payloads > 1KB',
      'Maintain continuous CI/CD load testing gates in GitHub Actions',
    ],
  };
}
