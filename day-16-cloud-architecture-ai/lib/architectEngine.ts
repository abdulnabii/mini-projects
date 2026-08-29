import { ArchitectureDesignResult, CloudProvider, ArchitectureScale, NodeType, WellArchitectedScore } from '@/types';

export function getNodeTypeColor(type: NodeType): { bg: string; border: string; text: string; dot: string; glow: string } {
  switch (type) {
    case 'client':
      return { bg: 'bg-sky-500/10', border: 'border-sky-500/40', text: 'text-sky-400', dot: 'bg-sky-400', glow: 'shadow-sky-500/20' };
    case 'cdn':
    case 'security':
      return { bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-400', dot: 'bg-amber-400', glow: 'shadow-amber-500/20' };
    case 'gateway':
      return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', text: 'text-cyan-400', dot: 'bg-cyan-400', glow: 'shadow-cyan-500/20' };
    case 'compute':
      return { bg: 'bg-blue-500/10', border: 'border-blue-500/40', text: 'text-blue-400', dot: 'bg-blue-400', glow: 'shadow-blue-500/20' };
    case 'cache':
      return { bg: 'bg-rose-500/10', border: 'border-rose-500/40', text: 'text-rose-400', dot: 'bg-rose-400', glow: 'shadow-rose-500/20' };
    case 'queue':
      return { bg: 'bg-purple-500/10', border: 'border-purple-500/40', text: 'text-purple-400', dot: 'bg-purple-400', glow: 'shadow-purple-500/20' };
    case 'database':
      return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-400', dot: 'bg-emerald-400', glow: 'shadow-emerald-500/20' };
    case 'storage':
      return { bg: 'bg-teal-500/10', border: 'border-teal-500/40', text: 'text-teal-400', dot: 'bg-teal-400', glow: 'shadow-teal-500/20' };
    default:
      return { bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-300', dot: 'bg-slate-400', glow: 'shadow-slate-500/20' };
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
  let estimatedP99 = '42ms';
  let monthlyCost = scale.includes('Hyperscale') ? 4850 : scale.includes('Growth') ? 1850 : 420;

  if (isAI) {
    title = 'Distributed Multi-Tenant Generative AI & Vector Search Architecture';
    estimatedP99 = '65ms';
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

  const nodes = [
    {
      id: 'node_1_client',
      name: 'Global Client Traffic & Edge Ingress',
      type: 'client' as NodeType,
      providerService: 'Next.js Web / iOS & Android Apps',
      tier: 1,
      description: 'End-user browser clients, mobile apps, and public API consumers across global geographies.',
      specs: 'HTTPS/2, TLS 1.3 Termination • HTTP/3 QUIC',
    },
    {
      id: 'node_2_cdn',
      name: 'Global Edge CDN & Layer 7 WAF',
      type: 'cdn' as NodeType,
      providerService: provider === 'AWS' ? 'Amazon CloudFront + AWS WAF' : provider === 'GCP' ? 'Cloud CDN + Cloud Armor' : 'Azure Front Door + WAF',
      tier: 1,
      description: 'Caches static/SSR assets across 300+ Edge POPs and blocks automated Layer 7 bot attacks and DDoS floods.',
      specs: '99.99% Edge SLA • Anycast IP Routing • Automated SSL',
    },
    {
      id: 'node_3_gateway',
      name: 'API Gateway & Distributed Load Balancer',
      type: 'gateway' as NodeType,
      providerService: provider === 'AWS' ? 'AWS Application Load Balancer' : provider === 'GCP' ? 'Google Cloud HTTPS Load Balancer' : 'Azure Application Gateway',
      tier: 2,
      description: 'Routes incoming microservice traffic by path, terminates mTLS, and performs continuous health checks.',
      specs: 'Multi-AZ Auto-Scaling • Zero-Downtime Rolling Deploys',
    },
    {
      id: 'node_4_app',
      name: 'Core Microservices Compute Cluster',
      type: 'compute' as NodeType,
      providerService: provider === 'AWS' ? 'Amazon ECS Fargate / EKS Kubernetes' : provider === 'GCP' ? 'Google Cloud Run / GKE' : 'Azure Container Apps / AKS',
      tier: 3,
      description: 'Stateless containerized application services executing core business logic, auth, and data processing.',
      specs: 'Auto-scaled 8-32 container tasks (ARM64 Graviton/Ampere)',
    },
    {
      id: 'node_5_cache',
      name: 'Distributed In-Memory Cache Cluster',
      type: 'cache' as NodeType,
      providerService: provider === 'AWS' ? 'Amazon ElastiCache Redis v7' : provider === 'GCP' ? 'Google Memorystore Redis' : 'Azure Cache for Redis',
      tier: 4,
      description: 'Ultra low-latency session caching and frequent database query result acceleration (<1.5ms response).',
      specs: 'Multi-AZ Primary + 2 Read Replicas (64GB RAM)',
    },
    {
      id: 'node_6_queue',
      name: 'Asynchronous Event Stream & Job Queue',
      type: 'queue' as NodeType,
      providerService: provider === 'AWS' ? 'Amazon SQS / Apache Kafka (MSK)' : provider === 'GCP' ? 'Google Cloud Pub/Sub' : 'Azure Service Bus',
      tier: 4,
      description: 'Decouples heavy background processing, transactional webhooks, and asynchronous workers.',
      specs: 'Partitioned High-Throughput • Dead Letter Queue (DLQ)',
    },
    {
      id: 'node_7_db',
      name: 'Primary Multi-AZ Relational Database',
      type: 'database' as NodeType,
      providerService: provider === 'AWS' ? 'Amazon Aurora PostgreSQL Serverless v2' : provider === 'GCP' ? 'Google Cloud SQL PostgreSQL / AlloyDB' : 'Azure Database for PostgreSQL',
      tier: 5,
      description: 'ACID-compliant transactional database with continuous backups, point-in-time recovery, and auto-failover.',
      specs: '1 Writer + 2 Read Replicas (Multi-AZ Storage)',
    },
    {
      id: 'node_8_storage',
      name: 'High-Durability Object Storage',
      type: 'storage' as NodeType,
      providerService: provider === 'AWS' ? 'Amazon S3 Standard' : provider === 'GCP' ? 'Google Cloud Storage' : 'Azure Blob Storage',
      tier: 5,
      description: 'Encrypted object storage for user-uploaded assets, media, raw logs, and automated disaster recovery snapshots.',
      specs: '99.999999999% (11 9s) Durability • SSE-KMS Encrypted',
    },
  ];

  const edges = [
    { from: 'node_1_client', to: 'node_2_cdn', protocol: 'HTTPS / TLS 1.3', label: 'Client Ingress', latencyMs: 18 },
    { from: 'node_2_cdn', to: 'node_3_gateway', protocol: 'HTTPS', label: 'WAF Filtered Proxy', latencyMs: 3 },
    { from: 'node_3_gateway', to: 'node_4_app', protocol: 'HTTP/2 gRPC', label: 'Internal Load Balance', latencyMs: 2 },
    { from: 'node_4_app', to: 'node_5_cache', protocol: 'TCP (Redis)', label: 'Cache Lookup (<1.5ms)', latencyMs: 1 },
    { from: 'node_4_app', to: 'node_6_queue', protocol: 'Async Event', label: 'Job Dispatch', latencyMs: 3 },
    { from: 'node_4_app', to: 'node_7_db', protocol: 'SQL TCP (PgBouncer)', label: 'Read/Write Queries', latencyMs: 5 },
    { from: 'node_4_app', to: 'node_8_storage', protocol: 'S3 API / IAM Roles', label: 'Signed Asset Upload', latencyMs: 4 },
  ];

  const costItems = [
    { category: 'Compute' as const, serviceName: `${provider} Managed Container Compute`, specs: '8-32 Auto-scaling ARM64 Tasks', estimatedMonthlyUSD: Math.round(monthlyCost * 0.35), costDriver: 'vCPU & RAM Uptime Hours' },
    { category: 'Database' as const, serviceName: `${provider} Multi-AZ PostgreSQL Engine`, specs: '1 Writer + 2 Read Replicas', estimatedMonthlyUSD: Math.round(monthlyCost * 0.28), costDriver: 'ACUs & Provisioned IOPS' },
    { category: 'Cache' as const, serviceName: `${provider} Distributed Redis Cluster`, specs: 'Multi-AZ High Availability', estimatedMonthlyUSD: Math.round(monthlyCost * 0.15), costDriver: 'RAM Capacity (GB)' },
    { category: 'Networking' as const, serviceName: `${provider} CloudFront CDN & Load Balancer`, specs: 'Data Transfer Out & LCU', estimatedMonthlyUSD: Math.round(monthlyCost * 0.11), costDriver: 'Egress Bandwidth & LCUs' },
    { category: 'Storage' as const, serviceName: `${provider} Encrypted Object Storage`, specs: 'Standard Tier + Lifecycle Policies', estimatedMonthlyUSD: Math.round(monthlyCost * 0.06), costDriver: 'Stored GB & PUT/GET Requests' },
    { category: 'Messaging' as const, serviceName: `${provider} Event Streaming / Queue`, specs: 'Pub/Sub / SQS FIFO', estimatedMonthlyUSD: Math.round(monthlyCost * 0.05), costDriver: 'Operations Volume' },
  ];

  const risks = [
    {
      componentName: 'Primary Database Master Node',
      severity: 'HIGH' as const,
      riskDescription: 'Unplanned hardware failure on primary write database could cause temporary connection drops during failover.',
      failoverMitigation: 'Enabled Aurora Multi-AZ with synchronous replication; automatic DNS failover promotes read replica in <30 seconds without data loss.',
    },
    {
      componentName: 'Redis Cache Eviction & Stampede',
      severity: 'MEDIUM' as const,
      riskDescription: 'Sudden cold cache restart could slam database master with un-cached read surges.',
      failoverMitigation: 'Configured Redis cluster multi-node replica warming, exponential backoff circuit breakers, and connection pooling.',
    },
    {
      componentName: 'Single Region Dependency',
      severity: 'MEDIUM' as const,
      riskDescription: 'Complete cloud provider regional outage in us-east-1 would degrade API availability.',
      failoverMitigation: 'Implement cross-region S3 bucket replication and Route53 / Cloud DNS health check failover to secondary standby region.',
    },
  ];

  const wellArchitected: WellArchitectedScore = {
    security: 94,
    reliability: 92,
    performance: 96,
    costOptimization: 88,
    operationalExcellence: 90,
    sustainability: 92,
    overallScore: 92,
    frameworkSummary: 'Exceeds AWS Well-Architected Framework benchmarks with Multi-AZ redundancy, WAF perimeter security, ARM64 Graviton compute, and automated IaC.',
  };

  const terraform = `# main.tf - ${provider} Production Cloud Infrastructure Blueprint
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

# 1. Virtual Private Cloud (VPC) & Multi-AZ Subnets
resource "${provider.toLowerCase()}_vpc" "main_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "cloudarchitect-production-vpc"
    Environment = "production"
    ManagedBy   = "CloudArchitect.AI"
  }
}

# 2. Application Load Balancer (ALB)
resource "${provider.toLowerCase()}_lb" "app_alb" {
  name               = "production-ingress-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = ["sg-0a1b2c3d4e5f"]
  subnets            = ["subnet-1a", "subnet-1b", "subnet-1c"]
}

# 3. Multi-AZ Managed Container Service (ECS / EKS)
resource "${provider.toLowerCase()}_ecs_cluster" "production_cluster" {
  name = "production-app-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# 4. In-Memory Redis Caching Cluster
resource "${provider.toLowerCase()}_elasticache_replication_group" "redis_cluster" {
  replication_group_id          = "prod-redis-cache"
  replication_group_description = "High-availability Redis cache"
  node_type                     = "cache.r6g.large"
  number_cache_clusters         = 3
  port                          = 6379
  automatic_failover_enabled    = true
  multi_az_enabled              = true
}

# 5. Aurora PostgreSQL Multi-AZ Serverless Cluster
resource "${provider.toLowerCase()}_rds_cluster" "postgresql_cluster" {
  cluster_identifier      = "prod-aurora-postgres"
  engine                  = "aurora-postgresql"
  engine_mode             = "provisioned"
  engine_version          = "15.4"
  database_name           = "production_db"
  master_username         = "admin_user"
  master_password         = "ChangeMeInVault123!"
  backup_retention_period = 30
  preferred_backup_window = "02:00-03:00"
  storage_encrypted       = true
}
`;

  const dockerCompose = `# docker-compose.yml - Local Full-Stack Architecture Emulator
version: '3.8'

services:
  # Core Web / API Service
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://app_user:app_secret@postgres:5432/app_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  # In-Memory Cache
  redis:
    image: redis:7.2-alpine
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # PostgreSQL ACID Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: app_db
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: app_secret
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:
  redis_data:
`;

  const kubernetesCode = `# k8s-deployment.yaml - Kubernetes Production Manifest
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloudarchitect-app-deployment
  labels:
    app: core-service
    tier: compute
spec:
  replicas: 6
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 0
  selector:
    matchLabels:
      app: core-service
  template:
    metadata:
      labels:
        app: core-service
    spec:
      containers:
      - name: app
        image: ghcr.io/abdulnabii/cloudarchitect-service:latest
        resources:
          limits:
            cpu: "2"
            memory: "4Gi"
          requests:
            cpu: "500m"
            memory: "1Gi"
        ports:
        - containerPort: 3000
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: core-service-lb
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: core-service
`;

  return {
    id: `arch_${Date.now()}`,
    title,
    requirementsSummary: requirements.slice(0, 150) || 'Custom enterprise cloud architecture blueprint',
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
      rtoMinutes: 2,
      risks,
    },
    wellArchitected,
    terraformCode: terraform,
    dockerComposeCode: dockerCompose,
    kubernetesCode,
    createdAt: new Date().toISOString(),
  };
}
