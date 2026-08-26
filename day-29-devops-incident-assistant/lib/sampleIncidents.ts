import { Incident } from '@/types';

export const SAMPLE_INCIDENTS: Incident[] = [
  {
    id: 'inc-9481',
    title: 'P1: PostgreSQL Connection Pool Exhaustion on payment-service',
    service: 'payment-service',
    severity: 'P1',
    status: 'investigating',
    startedAt: '2026-08-26T08:31:00Z',
    durationMinutes: 18,
    affectedUsers: 14200,
    revenueBurnRate: 4850,
    logs: [
      {
        id: 'l1',
        timestamp: '08:31:12.104',
        level: 'WARN',
        service: 'payment-service',
        pod: 'payment-service-7f89d4b-q9x12',
        message: 'DB pool checkout latency exceeded 2500ms (active: 98/100 connections)',
      },
      {
        id: 'l2',
        timestamp: '08:31:22.441',
        level: 'ERROR',
        service: 'payment-service',
        pod: 'payment-service-7f89d4b-q9x12',
        message: 'ERROR: remaining connection slots are reserved for non-replication superuser connections',
      },
      {
        id: 'l3',
        timestamp: '08:31:24.019',
        level: 'FATAL',
        service: 'payment-service',
        pod: 'payment-service-7f89d4b-mnk44',
        message: 'FATAL: sorry, too many clients already (current: 100, max_connections: 100)',
      },
      {
        id: 'l4',
        timestamp: '08:31:45.892',
        level: 'ERROR',
        service: 'payment-service',
        pod: 'payment-service-7f89d4b-q9x12',
        message: 'UnhandledPromiseRejection in processRefundBatch(): client connection acquired from pool was not released in finally block',
      },
      {
        id: 'l5',
        timestamp: '08:32:01.320',
        level: 'FATAL',
        service: 'checkout-api',
        pod: 'checkout-api-5c91f-8412a',
        message: 'HTTP 503 Service Unavailable upstream response from payment-service /v2/charge (100% failure rate on cart checkout)',
      },
      {
        id: 'l6',
        timestamp: '08:33:10.155',
        level: 'ERROR',
        service: 'payment-service',
        pod: 'payment-service-7f89d4b-k82p1',
        message: 'HikariCP-1 - Connection is not available, request timed out after 30000ms. Total: 100, Active: 100, Idle: 0, Waiting: 842',
      },
      {
        id: 'l7',
        timestamp: '08:34:05.719',
        level: 'WARN',
        service: 'ingress-nginx',
        pod: 'ingress-nginx-controller-74b88',
        message: 'upstream timed out (110: Connection timed out) while connecting to upstream payment-service:8080',
      },
    ],
    recentDeployments: [
      {
        id: 'dep-401',
        version: 'v2.4.1',
        service: 'payment-service',
        deployedAt: '2026-08-26T08:15:00Z',
        deployedBy: 'alex.sre@company.internal',
        commitHash: '7c89b14',
        commitMessage: 'feat(payments): add asynchronous bulk refund processing loop with automatic retry',
        riskScore: 'HIGH',
        prUrl: 'https://github.com/company/payment-service/pull/482',
      },
      {
        id: 'dep-400',
        version: 'v1.18.0',
        service: 'auth-service',
        deployedAt: '2026-08-26T06:00:00Z',
        deployedBy: 'ci-bot',
        commitHash: '1a2b3c4',
        commitMessage: 'chore: bump dependencies and nodejs runtime patch',
        riskScore: 'LOW',
      },
    ],
    diagnosis: {
      hypothesis:
        'PostgreSQL connection pool exhaustion in payment-service caused by an unclosed database client handle inside the newly deployed processRefundBatch() loop in v2.4.1.',
      confidence: 0.94,
      affectedService: 'payment-service',
      failureMode: 'CONNECTION_POOL_EXHAUSTION',
      evidenceFromLogs: [
        'FATAL: sorry, too many clients already (current: 100, max_connections: 100)',
        'UnhandledPromiseRejection in processRefundBatch(): client connection acquired from pool was not released in finally block',
        'HikariCP-1 - Connection is not available, request timed out after 30000ms. Waiting: 842',
      ],
      blastRadius: {
        primaryImpact: '100% of e-commerce checkout charges failing with HTTP 503 upstream timeout',
        secondaryImpact: [
          'Order processing worker queue accumulating backpressure',
          'Customer automated receipt emails stalled in RabbitMQ dead-letter exchange',
        ],
        estimatedUsersAffected: 14200,
        estimatedRevenuePerMin: 4850,
      },
      remediationSteps: [
        {
          step: 1,
          action: 'Rollback payment-service container deployment to stable v2.4.0',
          command: 'kubectl rollout undo deploy/payment-service -n production',
          expectedOutcome: 'Replaces leaking pods with stable release within 45 seconds',
          risk: 'LOW',
        },
        {
          step: 2,
          action: 'Terminate orphaned idle PostgreSQL client backend connections',
          command:
            "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction' AND application_name LIKE 'payment-service%';",
          expectedOutcome: 'Instantly frees up 80+ connection slots on PostgreSQL primary instance',
          risk: 'MEDIUM',
        },
        {
          step: 3,
          action: 'Verify payment-service health and checkout API success rate',
          command: 'curl -s https://api.internal/health/payment-service | jq .status',
          expectedOutcome: 'Returns HTTP 200 OK with active pool connections < 25%',
          risk: 'LOW',
        },
      ],
      deploymentCorrelation: {
        likelyCause: true,
        deployment: 'v2.4.1 (payment-service)',
        deployedAt: '08:15:00 UTC (16 mins prior to outage)',
        riskSignal: 'Introduced unhandled database client acquisition loop without finally { client.release() }',
      },
    },
    comms: {
      slackMessage:
        '🚨 *INCIDENT ALERT — P1 CRITICAL*\n*Service:* `payment-service`\n*Impact:* 100% checkout failure rate (~14.2k users affected, $4,850/min burn)\n*Root Cause Hypothesis:* HikariCP connection pool exhaustion in v2.4.1 `processRefundBatch`\n*Action in Progress:* Rolling back to `v2.4.0` and terminating stuck idle transactions.\n*War Room:* https://meet.google.com/sre-incident-p1',
      executiveBrief:
        'Executive Briefing: We are actively resolving a P1 outage affecting payment processing. Total estimated revenue impacted is ~$4,850/min. SRE team has initiated a code rollback to the previous stable release. Full recovery expected within 5 minutes.',
      statusPageUpdate:
        'Investigating: We are currently investigating an issue affecting customer checkout and payment processing. Our engineering team has identified the cause and is applying a fix. Next update in 10 minutes.',
    },
  },
  {
    id: 'inc-9482',
    title: 'P2: Kubernetes OOMKilled CrashLoopBackOff on auth-service',
    service: 'auth-service',
    severity: 'P2',
    status: 'investigating',
    startedAt: '2026-08-26T07:45:00Z',
    durationMinutes: 32,
    affectedUsers: 8900,
    revenueBurnRate: 1650,
    logs: [
      {
        id: 'l10',
        timestamp: '07:45:10.220',
        level: 'WARN',
        service: 'auth-service',
        pod: 'auth-service-684b-01',
        message: 'Node cgroup memory pressure warning: container memory usage at 96.8% (508Mi / 512Mi)',
      },
      {
        id: 'l11',
        timestamp: '07:45:14.881',
        level: 'FATAL',
        service: 'kubelet',
        pod: 'auth-service-684b-01',
        message: 'Container auth-service in pod auth-service-684b-01 was OOMKilled (exit code 137). Restart count: 4',
      },
      {
        id: 'l12',
        timestamp: '07:45:30.400',
        level: 'ERROR',
        service: 'gateway',
        pod: 'api-gateway-11a',
        message: '502 Bad Gateway while proxying /v1/oauth/token — upstream pod restarting in CrashLoopBackOff',
      },
      {
        id: 'l13',
        timestamp: '07:46:01.012',
        level: 'ERROR',
        service: 'auth-service',
        pod: 'auth-service-684b-02',
        message: 'FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory',
      },
    ],
    recentDeployments: [
      {
        id: 'dep-395',
        version: 'v3.1.0',
        service: 'auth-service',
        deployedAt: '2026-08-26T07:20:00Z',
        deployedBy: 'sarah.dev@company.internal',
        commitHash: '8e4f1a2',
        commitMessage: 'feat(jwt): cache in-memory JWKS public keys without TTL eviction limit',
        riskScore: 'HIGH',
        prUrl: 'https://github.com/company/auth-service/pull/219',
      },
    ],
    diagnosis: {
      hypothesis:
        'Node.js V8 Heap memory leak in auth-service v3.1.0 caused by unbound JWKS key caching in RAM leading to kernel cgroup OOMKill (Exit 137).',
      confidence: 0.96,
      affectedService: 'auth-service',
      failureMode: 'OOM_KILLED',
      evidenceFromLogs: [
        'Container auth-service in pod auth-service-684b-01 was OOMKilled (exit code 137)',
        'FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory',
      ],
      blastRadius: {
        primaryImpact: '502 Bad Gateway on user login and OAuth token refreshes',
        secondaryImpact: ['Mobile app session renewals failing across iOS/Android clients'],
        estimatedUsersAffected: 8900,
        estimatedRevenuePerMin: 1650,
      },
      remediationSteps: [
        {
          step: 1,
          action: 'Scale up Pod Memory Limit temporarily from 512Mi to 2Gi',
          command:
            'kubectl set resources deployment auth-service --limits=memory=2Gi,cpu=1000m -n production',
          expectedOutcome: 'Stops instantaneous OOMKill cycling while team patches code',
          risk: 'LOW',
        },
        {
          step: 2,
          action: 'Rollback auth-service to v3.0.4 with bounded cache',
          command: 'kubectl rollout undo deploy/auth-service -n production',
          expectedOutcome: 'Restores memory stability and resolves crash loops',
          risk: 'LOW',
        },
      ],
      deploymentCorrelation: {
        likelyCause: true,
        deployment: 'v3.1.0 (auth-service)',
        deployedAt: '07:20:00 UTC (25 mins prior)',
        riskSignal: 'Unbounded in-memory map storing public certificates on every handshake',
      },
    },
    comms: {
      slackMessage:
        '⚠️ *INCIDENT ALERT — P2 HIGH*\n*Service:* `auth-service`\n*Impact:* User login and token refresh degradation (OOMKill Exit 137)\n*Remediation:* Bumping memory limits to 2Gi and rolling back to v3.0.4.',
      executiveBrief:
        'P2 incident active on user authentication. Engineering has increased container memory allocation and initiated a rollback to restore login stability.',
      statusPageUpdate:
        'Identified: Users may experience delays or errors when attempting to sign in. A fix is currently being deployed to resolve the authentication service memory bottleneck.',
    },
  },
  {
    id: 'inc-9483',
    title: 'P3: Edge Ingress TLS Handshake Timeout & DNS Latency',
    service: 'gateway-ingress',
    severity: 'P3',
    status: 'investigating',
    startedAt: '2026-08-26T06:10:00Z',
    durationMinutes: 45,
    affectedUsers: 3400,
    revenueBurnRate: 420,
    logs: [
      {
        id: 'l20',
        timestamp: '06:10:05.101',
        level: 'WARN',
        service: 'gateway-ingress',
        pod: 'ingress-edge-01',
        message: 'SSL handshake latency to upstream Cloudflare origin exceeded 1800ms',
      },
      {
        id: 'l21',
        timestamp: '06:10:22.404',
        level: 'ERROR',
        service: 'gateway-ingress',
        pod: 'ingress-edge-01',
        message: '504 Gateway Timeout during TLS renegotiation with eu-central origin cluster',
      },
    ],
    recentDeployments: [],
    diagnosis: {
      hypothesis:
        'Cross-region TLS session resumption latency between Cloudflare Edge and primary EU-Central origin ingress gateway.',
      confidence: 0.88,
      affectedService: 'gateway-ingress',
      failureMode: 'DNS_TIMEOUT',
      evidenceFromLogs: [
        'SSL handshake latency to upstream Cloudflare origin exceeded 1800ms',
        '504 Gateway Timeout during TLS renegotiation',
      ],
      blastRadius: {
        primaryImpact: 'Intermittent latency spikes for European region website visitors',
        secondaryImpact: ['Static asset CDN cache miss rate elevated by 14%'],
        estimatedUsersAffected: 3400,
        estimatedRevenuePerMin: 420,
      },
      remediationSteps: [
        {
          step: 1,
          action: 'Enable TLS 1.3 0-RTT session tickets on NGINX Ingress',
          command:
            'kubectl patch configmap nginx-configuration -n ingress-nginx --patch \'{"data":{"ssl-session-tickets":"on","ssl-protocols":"TLSv1.2 TLSv1.3"}}\'',
          expectedOutcome: 'Eliminates one roundtrip on recurring client handshakes',
          risk: 'LOW',
        },
      ],
    },
    comms: {
      slackMessage:
        'ℹ️ *P3 NOTICE:* Edge ingress TLS latency in EU region under observation. Applied TLS 1.3 session ticket patch.',
      executiveBrief:
        'P3 minor latency impact in European region. Engineering applied TLS configuration optimizations.',
      statusPageUpdate:
        'Monitoring: We have implemented an edge routing optimization and are observing improved response times in the European region.',
    },
  },
  {
    id: 'inc-9484',
    title: 'P4: Redis Cluster Read Replica MaxMemory Thrashing',
    service: 'catalog-service',
    severity: 'P4',
    status: 'investigating',
    startedAt: '2026-08-26T05:00:00Z',
    durationMinutes: 60,
    affectedUsers: 850,
    revenueBurnRate: 95,
    logs: [
      {
        id: 'l30',
        timestamp: '05:00:11.890',
        level: 'WARN',
        service: 'catalog-service',
        pod: 'redis-node-03',
        message: 'maxmemory (8.00GB) reached - executing volatile-lru eviction of 14,820 keys/sec',
      },
    ],
    recentDeployments: [],
    diagnosis: {
      hypothesis:
        'Redis catalog read replica hit maxmemory threshold resulting in aggressive CPU-intensive key evictions.',
      confidence: 0.91,
      affectedService: 'catalog-service',
      failureMode: 'REDIS_MEMORY_SPIKE',
      evidenceFromLogs: ['maxmemory (8.00GB) reached - executing volatile-lru eviction'],
      blastRadius: {
        primaryImpact: 'Sub-second cache miss rate increased to 8%',
        secondaryImpact: ['Slight 50ms read latency increase on product search'],
        estimatedUsersAffected: 850,
        estimatedRevenuePerMin: 95,
      },
      remediationSteps: [
        {
          step: 1,
          action: 'Flush expired transient keys and increase cluster replica memory ceiling to 16GB',
          command: 'redis-cli -h redis-cluster.internal -p 6379 CONFIG SET maxmemory 16gb',
          expectedOutcome: 'Evictions halt and cache hit ratio returns to > 99.2%',
          risk: 'LOW',
        },
      ],
    },
    comms: {
      slackMessage: 'ℹ️ *P4 NOTICE:* Redis cache eviction spike mitigated by expanding maxmemory to 16GB.',
      executiveBrief: 'Low severity cache eviction resolved without business impact.',
      statusPageUpdate: 'All systems operational.',
    },
  },
];
