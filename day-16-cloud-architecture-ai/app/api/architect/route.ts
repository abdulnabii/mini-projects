import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ArchitectureDesignResult, CloudProvider, ArchitectureScale } from '@/types';
import { generateClientFallbackArchitecture } from '@/lib/architectEngine';

export async function POST(req: Request) {
  try {
    const {
      requirements,
      provider = 'AWS',
      scale = 'Growth (100k DAU)',
    }: {
      requirements: string;
      provider?: CloudProvider;
      scale?: ArchitectureScale;
    } = await req.json();

    if (!requirements || !requirements.trim()) {
      return NextResponse.json({ error: 'Requirements cannot be empty.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a Principal Cloud Solutions Architect and Distributed Systems Fellow.
Given these application requirements:
"${requirements}"

Target Cloud Provider: ${provider} (e.g. use native ${provider} service names)
Target Scale: ${scale}

Generate a comprehensive production system design architecture with 6-8 structured tiers, monthly cost estimation, single points of failure (SPOF) audit, and starter Terraform code.

Return ONLY valid JSON matching this exact schema (no markdown wrap, no backticks, no other text):
{
  "title": "Clear Architecture Title",
  "requirementsSummary": "1-2 sentence technical summary of the system design",
  "projectedRPS": 15000,
  "estimatedP99Latency": "45ms",
  "nodes": [
    {
      "id": "node_client",
      "name": "Global Clients & Mobile",
      "type": "client",
      "providerService": "Web & Mobile SDKs",
      "tier": 1,
      "description": "User edge devices and API consumers",
      "specs": "HTTPS/2, TLS 1.3"
    },
    {
      "id": "node_cdn",
      "name": "Global Edge CDN & WAF",
      "type": "cdn",
      "providerService": "${provider === 'AWS' ? 'Amazon CloudFront + WAF' : provider === 'GCP' ? 'Cloud CDN + Cloud Armor' : 'Azure Front Door'}",
      "tier": 1,
      "description": "DDoS protection and edge asset caching",
      "specs": "300+ Edge POPs"
    },
    {
      "id": "node_gateway",
      "name": "API Gateway & Load Balancer",
      "type": "gateway",
      "providerService": "${provider === 'AWS' ? 'AWS Application Load Balancer' : provider === 'GCP' ? 'Cloud HTTPS Load Balancer' : 'Azure App Gateway'}",
      "tier": 2,
      "description": "SSL termination & traffic routing",
      "specs": "Multi-AZ Auto-Scaling"
    },
    {
      "id": "node_compute",
      "name": "Core Service Cluster",
      "type": "compute",
      "providerService": "${provider === 'AWS' ? 'Amazon ECS Fargate / EKS' : provider === 'GCP' ? 'Google Cloud Run / GKE' : 'Azure Container Apps'}",
      "tier": 3,
      "description": "Microservices execution layer",
      "specs": "8-24 Auto-scaling tasks"
    },
    {
      "id": "node_cache",
      "name": "Distributed Cache",
      "type": "cache",
      "providerService": "${provider === 'AWS' ? 'Amazon ElastiCache Redis' : provider === 'GCP' ? 'Google Memorystore' : 'Azure Cache for Redis'}",
      "tier": 4,
      "description": "Sub-millisecond data caching",
      "specs": "Multi-AZ Replication"
    },
    {
      "id": "node_queue",
      "name": "Event Stream / Queue",
      "type": "queue",
      "providerService": "${provider === 'AWS' ? 'Amazon SQS / MSK Kafka' : provider === 'GCP' ? 'Google Cloud Pub/Sub' : 'Azure Service Bus'}",
      "tier": 4,
      "description": "Async event bus and decoupling",
      "specs": "High-Throughput Partitioned"
    },
    {
      "id": "node_database",
      "name": "Primary Database Cluster",
      "type": "database",
      "providerService": "${provider === 'AWS' ? 'Amazon Aurora PostgreSQL' : provider === 'GCP' ? 'Cloud SQL PostgreSQL' : 'Azure DB for PostgreSQL'}",
      "tier": 5,
      "description": "ACID persistence store",
      "specs": "1 Writer + 2 Read Replicas"
    }
  ],
  "edges": [
    { "from": "node_client", "to": "node_cdn", "protocol": "HTTPS", "label": "Client Request", "latencyMs": 15 },
    { "from": "node_cdn", "to": "node_gateway", "protocol": "HTTPS", "label": "WAF Filtered", "latencyMs": 2 },
    { "from": "node_gateway", "to": "node_compute", "protocol": "HTTP/2", "label": "Load Balanced", "latencyMs": 2 },
    { "from": "node_compute", "to": "node_cache", "protocol": "TCP", "label": "Cache Check", "latencyMs": 1 },
    { "from": "node_compute", "to": "node_queue", "protocol": "Async", "label": "Event Dispatch", "latencyMs": 3 },
    { "from": "node_compute", "to": "node_database", "protocol": "SQL TCP", "label": "DB Queries", "latencyMs": 5 }
  ],
  "costBreakdown": {
    "totalMonthlyUSD": 1850,
    "items": [
      { "category": "Compute", "serviceName": "${provider} Managed Compute", "specs": "Auto-scaling containers", "estimatedMonthlyUSD": 680, "costDriver": "vCPU & RAM" },
      { "category": "Database", "serviceName": "${provider} Managed Database", "specs": "Multi-AZ with read replicas", "estimatedMonthlyUSD": 550, "costDriver": "Instance hours & storage IOPS" },
      { "category": "Cache", "serviceName": "${provider} In-Memory Redis", "specs": "Multi-AZ cluster", "estimatedMonthlyUSD": 320, "costDriver": "RAM capacity" },
      { "category": "Networking", "serviceName": "${provider} CDN & Load Balancer", "specs": "Data transfer out", "estimatedMonthlyUSD": 180, "costDriver": "Egress bandwidth" },
      { "category": "Messaging", "serviceName": "${provider} Queue & Event Stream", "specs": "Message operations", "estimatedMonthlyUSD": 120, "costDriver": "Throughput volume" }
    ]
  },
  "spofAudit": {
    "overallReliabilityScore": 94,
    "rpoMinutes": 0,
    "rtoMinutes": 2,
    "risks": [
      {
        "componentName": "Primary Database",
        "severity": "HIGH",
        "riskDescription": "Single database master can become a read/write bottleneck during peak spikes.",
        "failoverMitigation": "Deploy read replicas with connection pooling (PgBouncer) and Multi-AZ synchronous replication."
      },
      {
        "componentName": "Redis Cache Invalidation",
        "severity": "MEDIUM",
        "riskDescription": "Cache stampede upon key expiration could overwhelm database.",
        "failoverMitigation": "Implement probabilistic early expiration (XFetch) and circuit breakers."
      }
    ]
  },
  "terraformCode": "# main.tf - ${provider} Cloud Architecture\\nprovider \\"${provider.toLowerCase()}\\" {\\n  region = \\"us-east-1\\"\\n}\\n",
  "dockerComposeCode": "version: '3.8'\\nservices:\\n  app:\\n    build: .\\n    ports:\\n      - \\"3000:3000\\"\\n"
}`;

        const res = await model.generateContent(prompt);
        const text = res.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(text);

        const result: ArchitectureDesignResult = {
          id: `arch_${Date.now()}`,
          targetProvider: provider,
          targetScale: scale,
          ...parsed,
          createdAt: new Date().toISOString(),
        };

        return NextResponse.json(result);
      } catch (err) {
        console.warn('Gemini architecture generation failed, using fallback engine:', err);
      }
    }

    const fallback = generateClientFallbackArchitecture(requirements, provider, scale);
    return NextResponse.json(fallback);
  } catch (err) {
    console.error('Architect API error:', err);
    return NextResponse.json({ error: 'Failed to generate cloud architecture' }, { status: 500 });
  }
}
