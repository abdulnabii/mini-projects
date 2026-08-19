import { ArchitectureDesignResult, ArchitecturePreset } from '@/types';

export const ARCHITECTURE_PRESETS: ArchitecturePreset[] = [
  {
    id: 'ride-hailing',
    title: 'Real-Time Geospatial Ride Hailing & Driver Match Engine',
    category: 'High-Throughput IoT & Real-Time Streams',
    tagline: 'Sub-50ms driver matching with WebSocket cluster, Redis Geospatial & Kafka streaming.',
    requirements:
      'Build a real-time ride hailing platform handling 250,000 active drivers sending GPS pings every 3 seconds. Needs sub-50ms matching latency, Redis GEO indexing, Apache Kafka event streaming, and multi-AZ PostgreSQL with PostGIS for trip history.',
    targetProvider: 'AWS',
    targetScale: 'Growth (100k DAU)',
    icon: '🚗',
  },
  {
    id: 'fintech-gateway',
    title: 'Global FinTech Payment Processing & Ledger Engine',
    category: 'PCI-DSS Compliant Transaction Ledger',
    tagline: 'Multi-Region zero-data-loss payment settlement with Amazon DynamoDB & EventBridge.',
    requirements:
      'Architect a PCI-DSS compliant global payment processing engine handling 5,000 TPS peak load. Requires idempotent payment processing, tokenized vaults, Amazon DynamoDB global tables with multi-region active-active replication, AWS KMS HSM encryption, and AWS EventBridge audit trails.',
    targetProvider: 'AWS',
    targetScale: 'Hyperscale (1M+ DAU)',
    icon: '💳',
  },
  {
    id: 'video-transcoding',
    title: 'Adaptive Video Transcoding & Global CDN Streaming',
    category: 'Media Pipelines & High-Bandwidth CDN',
    tagline: 'Automated 4K to multi-bitrate HLS/DASH transcoding with S3, AWS Batch, and CloudFront.',
    requirements:
      'Design a video ingestion and streaming pipeline for 100,000 daily uploads. Raw video hits S3, triggers AWS Lambda to orchestrate AWS Batch GPU transcoding workers into multi-bitrate HLS chunks, storing segments on S3 with global Amazon CloudFront CDN edge caching.',
    targetProvider: 'AWS',
    targetScale: 'Growth (100k DAU)',
    icon: '🎬',
  },
  {
    id: 'rag-ai-search',
    title: 'Multi-Tenant Enterprise RAG & Semantic Vector Engine',
    category: 'Generative AI & Hybrid Search',
    tagline: 'Sub-100ms hybrid vector search with Qdrant, Celery workers, and LangChain orchestration.',
    requirements:
      'Architect a scalable multi-tenant RAG (Retrieval-Augmented Generation) pipeline for 50M documents. Features asynchronous document chunking workers with Celery & Redis, Qdrant distributed vector database, Google Gemini 1.5 Flash LLM inference, and multi-tenant row-level security.',
    targetProvider: 'GCP',
    targetScale: 'MVP (1k-10k DAU)',
    icon: '🤖',
  },
];

export const INITIAL_SAMPLE_RESULT: ArchitectureDesignResult = {
  id: 'arch_sample_101',
  title: 'Real-Time Geospatial Ride Hailing & Driver Match Engine',
  requirementsSummary:
    'Real-time WebSocket cluster with sub-50ms driver matching, Redis GEO spatial indexing, Kafka event streams, and Aurora PostgreSQL PostGIS persistence.',
  targetProvider: 'AWS',
  targetScale: 'Growth (100k DAU)',
  projectedRPS: 12500,
  estimatedP99Latency: '38ms',
  nodes: [
    {
      id: 'node_clients',
      name: 'Mobile & Web Apps',
      type: 'client',
      providerService: 'iOS & Android SDKs',
      tier: 1,
      description: 'Passenger & Driver mobile apps emitting continuous telemetry and booking intents.',
      specs: '100k+ concurrent active sessions',
    },
    {
      id: 'node_cdn',
      name: 'Global Edge & WAF',
      type: 'cdn',
      providerService: 'Amazon CloudFront + AWS WAF',
      tier: 1,
      description: 'Terminates TLS, shields against DDoS L7 floods, and accelerates API payloads.',
      specs: 'Global Anycast POPs • Managed OWASP Top 10 Rules',
    },
    {
      id: 'node_alb',
      name: 'Application Load Balancer',
      type: 'gateway',
      providerService: 'AWS Network & App Load Balancer',
      tier: 2,
      description: 'Multiplexes HTTP/2 REST APIs and persistent WebSocket connection streams.',
      specs: 'Multi-AZ Auto-Scaling • 50,000 TCP conns/sec',
    },
    {
      id: 'node_ws_cluster',
      name: 'WebSocket Ingestion Cluster',
      type: 'compute',
      providerService: 'Amazon ECS Fargate (Go / Node)',
      tier: 3,
      description: 'Maintains long-lived driver location connections and pushes dispatch notifications.',
      specs: '12x Tasks (2 vCPU, 4GB RAM) • Auto-Scale 60% CPU',
    },
    {
      id: 'node_matching_service',
      name: 'Driver Matching Microservice',
      type: 'compute',
      providerService: 'Amazon EKS (Rust / Go Core)',
      tier: 3,
      description: 'Executes geospatial nearest-neighbor matching algorithms and surge pricing calculations.',
      specs: '8x Pods (c6g.xlarge Graviton3) • Sub-10ms logic',
    },
    {
      id: 'node_redis_geo',
      name: 'Geospatial Cache Cluster',
      type: 'cache',
      providerService: 'Amazon ElastiCache for Redis (Cluster Mode)',
      tier: 4,
      description: 'In-memory Redis GEO radius queries for sub-5ms driver proximity lookups.',
      specs: '3-Shard Cluster (cache.r6g.large) • Multi-AZ Auto-Failover',
    },
    {
      id: 'node_kafka',
      name: 'Event Streaming Backbone',
      type: 'queue',
      providerService: 'Amazon MSK (Managed Apache Kafka)',
      tier: 4,
      description: 'Decoupled event pipeline for ride requests, GPS breadcrumbs, and analytics.',
      specs: '3x kafka.m5.large Brokers • 7-day retention',
    },
    {
      id: 'node_aurora_db',
      name: 'Transactional Database',
      type: 'database',
      providerService: 'Amazon Aurora PostgreSQL (PostGIS)',
      tier: 5,
      description: 'Primary ACID database for passenger accounts, payment ledgers, and trip history.',
      specs: '1 Primary Writer + 2 Read Replicas (db.r6g.xlarge)',
    },
  ],
  edges: [
    { from: 'node_clients', to: 'node_cdn', protocol: 'HTTPS / WSS', label: 'TLS 1.3 Secure Uplink', latencyMs: 15 },
    { from: 'node_cdn', to: 'node_alb', protocol: 'HTTPS', label: 'WAF Filtered Proxy', latencyMs: 2 },
    { from: 'node_alb', to: 'node_ws_cluster', protocol: 'WebSocket', label: 'Persistent Bidirectional Stream', latencyMs: 3 },
    { from: 'node_ws_cluster', to: 'node_redis_geo', protocol: 'TCP (Redis GEO)', label: 'GPS Coordinates Ingest', latencyMs: 2 },
    { from: 'node_ws_cluster', to: 'node_kafka', protocol: 'Kafka Protocol', label: 'Ride Request Events', latencyMs: 4 },
    { from: 'node_kafka', to: 'node_matching_service', protocol: 'Consumer Group', label: 'Matchmaking Pipeline', latencyMs: 3 },
    { from: 'node_matching_service', to: 'node_redis_geo', protocol: 'GEOSEARCH', label: 'Radius Query Lookups', latencyMs: 2 },
    { from: 'node_matching_service', to: 'node_aurora_db', protocol: 'PostgreSQL TCP', label: 'Trip Ledger Commit', latencyMs: 7 },
  ],
  costBreakdown: {
    totalMonthlyUSD: 2480,
    items: [
      { category: 'Compute', serviceName: 'AWS ECS Fargate & EKS Cluster', specs: '12x Tasks + 8x EKS Pods', estimatedMonthlyUSD: 780, costDriver: 'vCPU & Memory uptime' },
      { category: 'Cache', serviceName: 'Amazon ElastiCache Redis', specs: '3 Shards (cache.r6g.large)', estimatedMonthlyUSD: 420, costDriver: 'In-Memory RAM capacity' },
      { category: 'Database', serviceName: 'Amazon Aurora PostgreSQL Serverless v2', specs: 'Multi-AZ 1 Writer + 2 Replicas', estimatedMonthlyUSD: 650, costDriver: 'ACU usage & IOPS' },
      { category: 'Messaging', serviceName: 'Amazon Managed Streaming for Kafka (MSK)', specs: '3x kafka.m5.large brokers', estimatedMonthlyUSD: 360, costDriver: 'Broker hours & data storage' },
      { category: 'Networking', serviceName: 'Amazon CloudFront & ALB & NAT Gateways', specs: '10 TB Data Transfer Out + ALB LCU', estimatedMonthlyUSD: 270, costDriver: 'Bandwidth & LCU load' },
    ],
  },
  spofAudit: {
    overallReliabilityScore: 94,
    rpoMinutes: 0,
    rtoMinutes: 2,
    risks: [
      {
        componentName: 'Redis Geospatial Cluster',
        severity: 'MEDIUM',
        riskDescription: 'If primary Redis master fails, in-flight GPS pings in a 2-second window could be dropped.',
        failoverMitigation: 'Enabled Multi-AZ auto-failover with standby replica promotion within 15 seconds.',
      },
      {
        componentName: 'WebSocket Ingestion Fargate Cluster',
        severity: 'MEDIUM',
        riskDescription: 'Massive surge traffic during rainstorm spikes could saturate connection handles.',
        failoverMitigation: 'Target Tracking scaling policy scales task count by 200% when connection count exceeds 5,000 per task.',
      },
    ],
  },
  terraformCode: `# main.tf - Production Cloud Infrastructure
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 1. Multi-AZ Virtual Private Cloud (VPC)
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "archcraft-production-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = false
}

# 2. Redis Geospatial Cache Cluster
resource "aws_elasticache_cluster" "redis_geo" {
  cluster_id           = "ride-hailing-redis"
  engine               = "redis"
  node_type            = "cache.r6g.large"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = module.vpc.elasticache_subnet_group_name
}

# 3. Amazon Aurora PostgreSQL (Multi-AZ with PostGIS)
resource "aws_rds_cluster" "aurora_db" {
  cluster_identifier      = "ride-hailing-aurora"
  engine                  = "aurora-postgresql"
  engine_version          = "15.3"
  database_name           = "rides_production"
  master_username         = "archcraft_admin"
  master_password         = "SuperSecurePass2026!"
  backup_retention_period = 7
  preferred_backup_window = "03:00-04:00"
  vpc_security_group_ids  = [aws_security_group.db_sg.id]
}
`,
  dockerComposeCode: `# docker-compose.yml - Local Architecture Emulator
version: '3.8'

services:
  # 1. Redis Geospatial Cache
  redis:
    image: redis:7.2-alpine
    container_name: archcraft_redis_geo
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  # 2. Apache Kafka & Zookeeper Event Stream
  zookeeper:
    image: confluentinc/cp-zookeeper:7.4.0
    container_name: archcraft_zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

  kafka:
    image: confluentinc/cp-kafka:7.4.0
    container_name: archcraft_kafka
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1

  # 3. PostgreSQL Database with PostGIS
  postgres:
    image: postgis/postgis:15-3.3-alpine
    container_name: archcraft_postgres
    environment:
      POSTGRES_DB: rides_dev
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  redis_data:
  pg_data:
`,
  createdAt: new Date().toISOString(),
};
