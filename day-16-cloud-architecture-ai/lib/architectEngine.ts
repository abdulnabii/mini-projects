import { ArchitectureDesignResult, CloudProvider, ArchitectureScale, NodeType } from '@/types';

export function getNodeTypeColor(type: NodeType): { bg: string; border: string; text: string; dot: string } {
  switch (type) {
    case 'client':
      return { bg: 'bg-sky-500/10', border: 'border-sky-500/40', text: 'text-sky-400', dot: 'bg-sky-400' };
    case 'cdn':
    case 'security':
      return { bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-400', dot: 'bg-amber-400' };
    case 'gateway':
      return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', text: 'text-cyan-400', dot: 'bg-cyan-400' };
    case 'compute':
      return { bg: 'bg-blue-500/10', border: 'border-blue-500/40', text: 'text-blue-400', dot: 'bg-blue-400' };
    case 'cache':
      return { bg: 'bg-rose-500/10', border: 'border-rose-500/40', text: 'text-rose-400', dot: 'bg-rose-400' };
    case 'queue':
      return { bg: 'bg-purple-500/10', border: 'border-purple-500/40', text: 'text-purple-400', dot: 'bg-purple-400' };
    case 'database':
      return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-400', dot: 'bg-emerald-400' };
    case 'storage':
      return { bg: 'bg-teal-500/10', border: 'border-teal-500/40', text: 'text-teal-400', dot: 'bg-teal-400' };
    default:
      return { bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-300', dot: 'bg-slate-400' };
  }
}

export function generateClientFallbackArchitecture(
  requirements: string,
  provider: CloudProvider = 'AWS',
  scale: ArchitectureScale = 'Growth (100k DAU)'
): ArchitectureDesignResult {
  const reqLower = requirements.toLowerCase();

  const isECommerce = reqLower.includes('shop') || reqLower.includes('e-commerce') || reqLower.includes('payment') || reqLower.includes('cart');
  const isAI = reqLower.includes('ai') || reqLower.includes('llm') || reqLower.includes('rag') || reqLower.includes('vector');
  const isVideo = reqLower.includes('video') || reqLower.includes('stream') || reqLower.includes('transcode') || reqLower.includes('media');

  let title = 'Scalable Enterprise Microservices Cloud Architecture';
  let projectedRPS = scale.includes('Hyperscale') ? 50000 : scale.includes('Growth') ? 12000 : 2500;
  let estimatedP99 = '45ms';
  let monthlyCost = scale.includes('Hyperscale') ? 4850 : scale.includes('Growth') ? 1850 : 420;

  if (isAI) {
    title = 'Distributed Multi-Tenant Generative AI & Vector Search Architecture';
    estimatedP99 = '68ms';
    monthlyCost = scale.includes('Hyperscale') ? 6200 : scale.includes('Growth') ? 2400 : 650;
  } else if (isVideo) {
    title = 'High-Bandwidth Distributed Video Ingestion & HLS Streaming Engine';
    estimatedP99 = '25ms';
    monthlyCost = scale.includes('Hyperscale') ? 5400 : scale.includes('Growth') ? 2100 : 550;
  } else if (isECommerce) {
    title = 'High-Concurrency Event-Driven E-Commerce & Checkout Architecture';
    estimatedP99 = '32ms';
    monthlyCost = scale.includes('Hyperscale') ? 4200 : scale.includes('Growth') ? 1650 : 380;
  }

  const pPrefix = provider === 'AWS' ? 'Amazon / AWS' : provider === 'GCP' ? 'Google Cloud' : 'Microsoft Azure';

  const nodes = [
    {
      id: 'node_1_client',
      name: 'Global Clients & Web SPAs',
      type: 'client' as NodeType,
      providerService: 'Next.js Frontend / Mobile Apps',
      tier: 1,
      description: 'End-user browser clients, mobile apps, and third-party webhook callers.',
      specs: 'HTTPS/2, TLS 1.3 Termination',
    },
    {
      id: 'node_2_cdn',
      name: 'Global Edge CDN & WAF',
      type: 'cdn' as NodeType,
      providerService: provider === 'AWS' ? 'Amazon CloudFront + AWS WAF' : provider === 'GCP' ? 'Cloud CDN + Cloud Armor' : 'Azure Front Door',
      tier: 1,
      description: 'Caches static assets at 300+ edge locations and blocks malicious Layer 7 bot traffic.',
      specs: '99.99% Edge Availability • Anycast Routing',
    },
    {
      id: 'node_3_gateway',
      name: 'API Gateway & Load Balancer',
      type: 'gateway' as NodeType,
      providerService: provider === 'AWS' ? 'AWS Application Load Balancer' : provider === 'GCP' ? 'Google Cloud HTTPS Load Balancer' : 'Azure App Gateway',
      tier: 2,
      description: 'Routes traffic by path and handles SSL offloading and automatic failover.',
      specs: 'Multi-AZ Auto-Scaling • 25,000 req/sec peak',
    },
    {
      id: 'node_4_app',
      name: 'Core Application Service Cluster',
      type: 'compute' as NodeType,
      providerService: provider === 'AWS' ? 'Amazon ECS Fargate / EKS' : provider === 'GCP' ? 'Google Cloud Run / GKE' : 'Azure Container Apps / AKS',
      tier: 3,
      description: 'Stateless microservices executing business logic and API orchestration.',
      specs: 'Auto-scaled 8-24 container tasks (2 vCPU, 4GB RAM)',
    },
    {
      id: 'node_5_cache',
      name: 'Distributed In-Memory Cache',
      type: 'cache' as NodeType,
      providerService: provider === 'AWS' ? 'Amazon ElastiCache Redis' : provider === 'GCP' ? 'Google Memorystore Redis' : 'Azure Cache for Redis',
      tier: 4,
      description: 'Low-latency session caching and frequent query result storage (sub-2ms).',
      specs: 'Multi-AZ Primary + Read Replica (64GB RAM)',
    },
    {
      id: 'node_6_queue',
      name: 'Asynchronous Event Bus & Queue',
      type: 'queue' as NodeType,
      providerService: provider === 'AWS' ? 'Amazon SQS / Apache Kafka (MSK)' : provider === 'GCP' ? 'Google Cloud Pub/Sub' : 'Azure Service Bus',
      tier: 4,
      description: 'Decouples heavy processing tasks, webhook dispatches, and notifications.',
      specs: 'FIFO Queue • Dead Letter Queue with 14d retention',
    },
    {
      id: 'node_7_db',
      name: 'Primary Relational Database',
      type: 'database' as NodeType,
      providerService: provider === 'AWS' ? 'Amazon Aurora PostgreSQL Serverless v2' : provider === 'GCP' ? 'Google Cloud SQL PostgreSQL' : 'Azure Database for PostgreSQL',
      tier: 5,
      description: 'ACID transactional data store with automated backups and cross-AZ replication.',
      specs: '1 Writer + 2 Read Replicas (Multi-AZ Storage)',
    },
  ];

  const edges = [
    { from: 'node_1_client', to: 'node_2_cdn', protocol: 'HTTPS / TLS 1.3', label: 'Client Uplink', latencyMs: 18 },
    { from: 'node_2_cdn', to: 'node_3_gateway', protocol: 'HTTPS', label: 'WAF Filtered Proxy', latencyMs: 3 },
    { from: 'node_3_gateway', to: 'node_4_app', protocol: 'HTTP/2 gRPC', label: 'Internal Load Balance', latencyMs: 2 },
    { from: 'node_4_app', to: 'node_5_cache', protocol: 'TCP (Redis)', label: 'Cache Lookup (<2ms)', latencyMs: 1 },
    { from: 'node_4_app', to: 'node_6_queue', protocol: 'Async Event', label: 'Job Dispatch', latencyMs: 4 },
    { from: 'node_4_app', to: 'node_7_db', protocol: 'SQL TCP', label: 'Read/Write Queries', latencyMs: 6 },
  ];

  const costItems = [
    { category: 'Compute' as const, serviceName: `${provider} Managed Container Cluster`, specs: 'Auto-Scaling Compute Nodes', estimatedMonthlyUSD: Math.round(monthlyCost * 0.35), costDriver: 'vCPU & RAM Uptime Hours' },
    { category: 'Database' as const, serviceName: `${provider} Multi-AZ PostgreSQL Engine`, specs: 'Primary + 2 Read Replicas', estimatedMonthlyUSD: Math.round(monthlyCost * 0.28), costDriver: 'IOPS & Provisioned Storage' },
    { category: 'Cache' as const, serviceName: `${provider} In-Memory Redis Cluster`, specs: 'Multi-AZ High Availability', estimatedMonthlyUSD: Math.round(monthlyCost * 0.16), costDriver: 'RAM Capacity (GB)' },
    { category: 'Networking' as const, serviceName: `${provider} CDN, Load Balancer & NAT`, specs: 'Data Transfer Out & LCU', estimatedMonthlyUSD: Math.round(monthlyCost * 0.12), costDriver: 'Egress Bandwidth & LCUs' },
    { category: 'Messaging' as const, serviceName: `${provider} Event Streaming / Queue`, specs: 'Pub/Sub / SQS Storage', estimatedMonthlyUSD: Math.round(monthlyCost * 0.09), costDriver: 'Message Operations Volume' },
  ];

  const risks = [
    {
      componentName: 'Primary Database Master',
      severity: 'HIGH' as const,
      riskDescription: 'Unplanned hardware degradation on primary database node could trigger a 60-second failover window.',
      failoverMitigation: 'Enabled Aurora Multi-AZ automatic synchronous replication with automated replica promotion in <30 seconds.',
    },
    {
      componentName: 'Redis Cache Eviction Surge',
      severity: 'MEDIUM' as const,
      riskDescription: 'Sudden cold cache restart could slam primary database with un-cached read traffic spikes.',
      failoverMitigation: 'Implement exponential backoff circuit breakers and Redis cluster replica warming on startup.',
    },
  ];

  const terraform = `# main.tf - ${provider} Cloud Architecture IaC
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    ${provider.toLowerCase()} = {
      source  = "hashicorp/${provider.toLowerCase()}"
      version = "~> 5.0"
    }
  }
}

provider "${provider.toLowerCase()}" {
  region = "us-east-1"
}

# 1. Virtual Private Cloud Network
resource "${provider.toLowerCase()}_vpc" "production_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Environment = "production"
    ManagedBy   = "ArchCraft.AI"
  }
}

# 2. Multi-AZ Managed Container Service
resource "${provider.toLowerCase()}_ecs_cluster" "app_cluster" {
  name = "archcraft-production-cluster"
}

# 3. Distributed Redis In-Memory Cache
resource "${provider.toLowerCase()}_elasticache_cluster" "redis" {
  cluster_id           = "archcraft-redis-cache"
  engine               = "redis"
  node_type            = "cache.r6g.large"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
}
`;

  const dockerCompose = `# docker-compose.yml - Local Architecture Emulator
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://user:password@postgres:5432/app_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  redis:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: app_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:
`;

  return {
    id: `arch_${Date.now()}`,
    title,
    requirementsSummary: requirements.slice(0, 150) || 'Custom system design specification',
    targetProvider: provider,
    targetScale: scale,
    projectedRPS,
    estimatedP99Latency: estimatedP99,
    nodes,
    edges,
    costBreakdown: {
      totalMonthlyUSD: monthlyCost,
      items: costItems,
    },
    spofAudit: {
      overallReliabilityScore: 92,
      rpoMinutes: 0,
      rtoMinutes: 3,
      risks,
    },
    terraformCode: terraform,
    dockerComposeCode: dockerCompose,
    createdAt: new Date().toISOString(),
  };
}
