import { TestConfig, LatencyPercentiles, StatusCodeCount, MetricPoint, TestResult } from '@/types';

// Calculate Accurate Statistical Percentiles
export function calculatePercentiles(latenciesMs: number[]): LatencyPercentiles {
  if (!latenciesMs || latenciesMs.length === 0) {
    return { min: 0, p50: 0, p75: 0, p90: 0, p95: 0, p99: 0, p999: 0, max: 0, mean: 0 };
  }

  const sorted = [...latenciesMs].sort((a, b) => a - b);
  const len = sorted.length;

  const getP = (p: number) => {
    const idx = Math.min(len - 1, Math.max(0, Math.floor((p / 100) * len)));
    return Math.round(sorted[idx]);
  };

  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = Math.round((sum / len) * 10) / 10;

  return {
    min: Math.round(sorted[0]),
    p50: getP(50),
    p75: getP(75),
    p90: getP(90),
    p95: getP(95),
    p99: getP(99),
    p999: getP(99.9),
    max: Math.round(sorted[len - 1]),
    mean,
  };
}

// Generate k6 JavaScript Test Script
export function generateK6Script(config: TestConfig): string {
  const headersObj: Record<string, string> = {};
  config.headers.forEach((h) => {
    if (h.enabled && h.key) headersObj[h.key] = h.value;
  });

  if (config.authType === 'bearer' && config.authValue) {
    headersObj['Authorization'] = `Bearer ${config.authValue}`;
  } else if (config.authType === 'api_key' && config.authValue) {
    headersObj['X-API-Key'] = config.authValue;
  }

  const payload = config.bodyContent ? JSON.stringify(config.bodyContent) : 'null';

  return `// LoadPulse.AI generated k6 Benchmark Script
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '${config.rampUpSeconds}s', target: ${config.virtualUsers} },
    { duration: '${config.durationSeconds - config.rampUpSeconds}s', target: ${config.virtualUsers} },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000', 'p(99)<4000'],
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  const url = '${config.url}';
  const params = {
    headers: ${JSON.stringify(headersObj, null, 4)},
    timeout: '${config.timeoutMs}ms',
  };

  ${
    config.method === 'GET'
      ? `const res = http.get(url, params);`
      : `const payload = ${payload};
  const res = http.${config.method.toLowerCase()}(url, payload, params);`
  }

  check(res, {
    'status is 200/201': (r) => r.status >= 200 && r.status < 300,
    'latency < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(0.1);
}
`;
}

// Generate cURL Benchmark Command
export function generateCurlCommand(config: TestConfig): string {
  let cmd = `curl -X ${config.method} "${config.url}" \\\n`;
  config.headers.forEach((h) => {
    if (h.enabled && h.key) cmd += `  -H "${h.key}: ${h.value}" \\\n`;
  });
  if (config.authType === 'bearer' && config.authValue) {
    cmd += `  -H "Authorization: Bearer ${config.authValue}" \\\n`;
  }
  if (config.bodyContent && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
    cmd += `  -d '${config.bodyContent}' \\\n`;
  }
  cmd += `  --max-time ${(config.timeoutMs / 1000).toFixed(1)}`;
  return cmd;
}

// Default Base Test Config
export const DEFAULT_TEST_CONFIG: TestConfig = {
  id: 'test_' + Date.now(),
  title: 'Products API Benchmark & Concurrency Stress Test',
  url: 'https://dummyjson.com/products',
  method: 'GET',
  headers: [
    { key: 'Accept', value: 'application/json', enabled: true },
    { key: 'User-Agent', value: 'LoadPulse-Engine/2.0', enabled: true },
  ],
  bodyType: 'none',
  authType: 'none',
  virtualUsers: 50,
  durationSeconds: 15,
  rampUpSeconds: 3,
  loadProfile: 'ramping_spike',
  timeoutMs: 5000,
};
