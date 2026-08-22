import { CanvasElement, DrawStyle, ToolType, DiagramSpec } from '@/types';
import getStroke from 'perfect-freehand';

export function createId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export const STICKY_COLORS = [
  '#fef08a', // Yellow
  '#fbcfe8', // Pink
  '#bae6fd', // Sky Blue
  '#bbf7d0', // Mint Green
  '#ddd6fe', // Lavender
  '#fed7aa', // Peach
  '#e2e8f0', // Cool Slate
  '#1e293b', // Midnight (Dark Sticky)
];

export const AUTHORS = ['Alex', 'Fatima', 'Liam', 'Sarah', 'Devon', 'Abdul'];

export function createShape(
  tool: ToolType,
  x: number,
  y: number,
  style: DrawStyle,
  colorIndex?: number
): CanvasElement {
  const id = createId();

  switch (tool) {
    case 'rectangle':
      return { id, type: 'rectangle', x, y, width: 0, height: 0, ...style };
    case 'rounded_rect':
      return { id, type: 'rounded_rect', x, y, width: 0, height: 0, ...style };
    case 'ellipse':
      return { id, type: 'ellipse', x, y, width: 0, height: 0, ...style };
    case 'diamond':
      return { id, type: 'diamond', x, y, width: 0, height: 0, ...style };
    case 'cylinder':
      return { id, type: 'cylinder', x, y, width: 120, height: 80, ...style };
    case 'cloud':
      return { id, type: 'cloud', x, y, width: 140, height: 90, ...style };
    case 'arrow':
      return { id, type: 'arrow', x, y, points: [0, 0, 0, 0], ...style };
    case 'step_arrow':
      return { id, type: 'step_arrow', x, y, points: [0, 0, 0, 0], ...style };
    case 'line':
      return { id, type: 'line', x, y, points: [0, 0, 0, 0], ...style };
    case 'pencil':
      return { id, type: 'pencil', x, y, points: [posSafe(x), posSafe(y)], ...style };
    case 'highlighter':
      return {
        id,
        type: 'highlighter',
        x,
        y,
        points: [posSafe(x), posSafe(y)],
        stroke: style.stroke || '#fef08a',
        strokeWidth: 20,
        opacity: 0.45,
        fill: 'transparent',
        fontSize: 18,
      };
    case 'text':
      return {
        id,
        type: 'text',
        x,
        y,
        text: 'Type something...',
        fontSize: 20,
        fontFamily: style.fontFamily || 'sans',
        fill: style.stroke || '#ffffff',
        stroke: 'transparent',
        strokeWidth: 0,
        opacity: 1,
      };
    case 'sticky': {
      const col = STICKY_COLORS[(colorIndex ?? 0) % STICKY_COLORS.length];
      const author = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
      return {
        id,
        type: 'sticky',
        x,
        y,
        width: 220,
        height: 180,
        text: 'Double click to edit note...',
        stickyColor: col,
        stickyAuthor: author,
        stickyEmoji: '💡',
        fill: col,
        stroke: 'rgba(0,0,0,0.1)',
        strokeWidth: 1,
        fontSize: 14,
        opacity: 1,
      };
    }
    case 'frame':
      return {
        id,
        type: 'frame',
        x,
        y,
        width: 480,
        height: 320,
        frameTitle: 'Architecture Zone',
        fill: 'rgba(99,102,241,0.03)',
        stroke: 'rgba(99,102,241,0.3)',
        strokeWidth: 2,
        opacity: 1,
        fontSize: 14,
      };
    default:
      return { id, type: 'rectangle', x, y, width: 120, height: 80, ...style };
  }
}

function posSafe(n: number) {
  return isNaN(n) ? 0 : n;
}

export function getSmoothStrokePoints(points: number[], size: number = 4): string {
  if (!points || points.length < 2) return '';

  const pts: [number, number, number][] = [];
  for (let i = 0; i < points.length; i += 2) {
    if (!isNaN(points[i]) && !isNaN(points[i + 1])) {
      pts.push([points[i], points[i + 1], 0.5]);
    }
  }

  if (pts.length === 0) return '';

  const stroke = getStroke(pts, {
    size,
    thinning: 0.4,
    smoothing: 0.6,
    streamline: 0.5,
  });

  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q'] as (string | number)[]
  );

  return d.join(' ');
}

// Preset Starter Boards
export const STARTER_TEMPLATES: {
  id: string;
  name: string;
  category: string;
  desc: string;
  icon: string;
  spec: DiagramSpec;
}[] = [
  {
    id: 'microservices',
    name: 'Microservices & Cloud Hub',
    category: 'Architecture',
    desc: 'High-availability Kubernetes cluster with Edge API Gateway, Auth, Caching, and DB',
    icon: '🚀',
    spec: {
      title: 'Cloud Native Microservices Architecture',
      category: 'Cloud Infrastructure',
      elements: [
        { id: 'clients', type: 'rounded_rect', label: 'Web & Mobile Clients', subLabel: 'Next.js 15 & React Native', x: 60, y: 220, color: '#38bdf8', width: 160, height: 75 },
        { id: 'cdn', type: 'cloud', label: 'Cloudflare Edge CDN', subLabel: 'WAF & Global Edge Cache', x: 280, y: 220, color: '#f59e0b', width: 160, height: 75 },
        { id: 'gateway', type: 'rounded_rect', label: 'Traefik API Gateway', subLabel: 'Rate Limiting & JWT Auth', x: 500, y: 220, color: '#6366f1', width: 160, height: 75 },
        { id: 'auth_srv', type: 'rounded_rect', label: 'Auth & IAM Service', subLabel: 'OAuth2 / PKCE / Session', x: 740, y: 100, color: '#ec4899', width: 160, height: 75 },
        { id: 'order_srv', type: 'rounded_rect', label: 'Order Processing', subLabel: 'Async Event Driven', x: 740, y: 220, color: '#10b981', width: 160, height: 75 },
        { id: 'payment_srv', type: 'rounded_rect', label: 'Stripe Payment Gateway', subLabel: 'PCI-DSS Compliant', x: 740, y: 340, color: '#8b5cf6', width: 160, height: 75 },
        { id: 'redis', type: 'cylinder', label: 'Redis Cluster', subLabel: 'Session & Cache Store', x: 980, y: 100, color: '#ef4444', width: 150, height: 75 },
        { id: 'postgres', type: 'cylinder', label: 'PostgreSQL Primary', subLabel: 'Read/Write Replica Pool', x: 980, y: 250, color: '#3b82f6', width: 150, height: 75 },
      ],
      connections: [
        { from: 'clients', to: 'cdn', label: 'HTTPS / TLS 1.3', style: 'arrow' },
        { from: 'cdn', to: 'gateway', label: 'Edge Proxy', style: 'arrow' },
        { from: 'gateway', to: 'auth_srv', label: 'gRPC / Token', style: 'arrow' },
        { from: 'gateway', to: 'order_srv', label: 'REST / GraphQL', style: 'arrow' },
        { from: 'gateway', to: 'payment_srv', label: 'Webhook', style: 'arrow' },
        { from: 'auth_srv', to: 'redis', label: 'Sub-ms Read', style: 'arrow' },
        { from: 'order_srv', to: 'postgres', label: 'Prisma ORM', style: 'arrow' },
      ],
    },
  },
  {
    id: 'sprint_retro',
    name: 'Sprint Retrospective Studio',
    category: 'Team Agility',
    desc: 'Interactive 4-column Agile retro board with color-coded sentiment notes',
    icon: '📋',
    spec: {
      title: 'Sprint 42 Agile Retrospective',
      category: 'Agile Ceremonies',
      elements: [
        { id: 'col1', type: 'rounded_rect', label: '🌟 What Went Well', subLabel: 'Team Wins & High Points', x: 60, y: 100, color: '#10b981', width: 220, height: 60 },
        { id: 'col2', type: 'rounded_rect', label: '🔧 What Could Improve', subLabel: 'Bottlenecks & Friction', x: 320, y: 100, color: '#f59e0b', width: 220, height: 60 },
        { id: 'col3', type: 'rounded_rect', label: '⚡ Action Items', subLabel: 'Committed Next Steps', x: 580, y: 100, color: '#6366f1', width: 220, height: 60 },
        { id: 'col4', type: 'rounded_rect', label: '💖 Team Kudos & Props', subLabel: 'Peer Shoutouts', x: 840, y: 100, color: '#ec4899', width: 220, height: 60 },
      ],
      connections: [],
    },
  },
  {
    id: 'ai_rag_pipeline',
    name: 'GenAI & RAG Pipeline',
    category: 'AI Engineering',
    desc: 'Retrieval Augmented Generation with Vector Embeddings, ChromaDB, and Gemini Reranking',
    icon: '🧠',
    spec: {
      title: 'Enterprise AI Knowledge Retrieval Engine',
      category: 'AI Pipeline',
      elements: [
        { id: 'user', type: 'rounded_rect', label: 'User Query', subLabel: 'Natural Language Prompt', x: 60, y: 200, color: '#38bdf8', width: 150, height: 70 },
        { id: 'embed', type: 'rounded_rect', label: 'Text-Embedding-004', subLabel: '768-dim Vectors', x: 270, y: 200, color: '#6366f1', width: 160, height: 70 },
        { id: 'vector_db', type: 'cylinder', label: 'Pinecone / ChromaDB', subLabel: 'Cosine Similarity Index', x: 490, y: 200, color: '#10b981', width: 160, height: 70 },
        { id: 'reranker', type: 'diamond', label: 'Cross-Encoder Rerank', subLabel: 'Top-K Relevant Chunks', x: 710, y: 190, color: '#f59e0b', width: 150, height: 90 },
        { id: 'gemini', type: 'rounded_rect', label: 'Gemini 1.5 Pro Flash', subLabel: 'Grounding + Synthesis', x: 920, y: 200, color: '#ec4899', width: 170, height: 70 },
      ],
      connections: [
        { from: 'user', to: 'embed', label: 'Query Text', style: 'arrow' },
        { from: 'embed', to: 'vector_db', label: 'Embed Vector', style: 'arrow' },
        { from: 'vector_db', to: 'reranker', label: 'Top 50 Chunks', style: 'arrow' },
        { from: 'reranker', to: 'gemini', label: 'Context + Prompt', style: 'arrow' },
      ],
    },
  },
];
