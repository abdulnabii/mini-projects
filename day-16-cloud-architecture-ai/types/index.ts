export type CloudProvider = 'AWS' | 'GCP' | 'Azure';
export type ArchitectureScale = 'MVP (1k-10k DAU)' | 'Growth (100k DAU)' | 'Hyperscale (1M+ DAU)';

export type NodeType =
  | 'client'
  | 'cdn'
  | 'gateway'
  | 'compute'
  | 'cache'
  | 'queue'
  | 'database'
  | 'storage'
  | 'security';

export interface ArchitectureNode {
  id: string;
  name: string;
  type: NodeType;
  providerService: string; // e.g. AWS CloudFront, AWS ALB, Amazon ECS Fargate
  tier: number; // 1: Client/Edge, 2: Gateway/Load Balancer, 3: App/Compute, 4: Caching/Messaging, 5: Data/Persistence
  description: string;
  specs: string; // e.g. 4x c6g.xlarge, Multi-AZ
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  protocol: string; // HTTPS, gRPC, WebSocket, TCP, Async Queue
  label: string;
  latencyMs: number;
}

export interface CostBreakdownItem {
  category: 'Compute' | 'Storage' | 'Database' | 'Cache' | 'Networking' | 'Messaging';
  serviceName: string;
  specs: string;
  estimatedMonthlyUSD: number;
  costDriver: string;
}

export interface SPOFItem {
  componentName: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  riskDescription: string;
  failoverMitigation: string;
}

export interface ArchitectureDesignResult {
  id: string;
  title: string;
  requirementsSummary: string;
  targetProvider: CloudProvider;
  targetScale: ArchitectureScale;
  projectedRPS: number;
  estimatedP99Latency: string; // e.g. "42ms"
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  costBreakdown: {
    totalMonthlyUSD: number;
    items: CostBreakdownItem[];
  };
  spofAudit: {
    overallReliabilityScore: number; // 0-100
    rpoMinutes: number; // Recovery Point Objective
    rtoMinutes: number; // Recovery Time Objective
    risks: SPOFItem[];
  };
  terraformCode: string;
  dockerComposeCode: string;
  createdAt: string;
}

export interface ArchitecturePreset {
  id: string;
  title: string;
  category: string;
  tagline: string;
  requirements: string;
  targetProvider: CloudProvider;
  targetScale: ArchitectureScale;
  icon: string;
}
