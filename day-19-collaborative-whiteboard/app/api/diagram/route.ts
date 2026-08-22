import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();

    if (!description?.trim()) {
      return NextResponse.json({ error: 'Description is required.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return a demo diagram when no key is provided
      return NextResponse.json({
        title: 'Microservices Architecture',
        elements: [
          { id: 'client', type: 'rectangle', label: 'Web Client', x: 50, y: 200, color: '#94a3b8', width: 130, height: 60 },
          { id: 'gateway', type: 'rectangle', label: 'API Gateway', x: 250, y: 200, color: '#6366f1', width: 130, height: 60 },
          { id: 'auth', type: 'rectangle', label: 'Auth Service', x: 450, y: 100, color: '#f59e0b', width: 130, height: 60 },
          { id: 'users', type: 'rectangle', label: 'User Service', x: 450, y: 230, color: '#10b981', width: 130, height: 60 },
          { id: 'db', type: 'ellipse', label: 'PostgreSQL', x: 650, y: 230, color: '#3b82f6', width: 130, height: 60 },
        ],
        connections: [
          { from: 'client', to: 'gateway', label: 'HTTPS', style: 'arrow' },
          { from: 'gateway', to: 'auth', label: 'JWT Verify', style: 'arrow' },
          { from: 'gateway', to: 'users', label: 'Route', style: 'arrow' },
          { from: 'users', to: 'db', label: 'SQL Query', style: 'arrow' },
        ],
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a professional diagram layout engine for a collaborative whiteboard application.
Convert the user's natural language description into a structured diagram specification.

Rules:
- Position elements on a canvas that starts at x=50, y=100
- Spread elements with ~200px horizontal spacing, ~150px vertical spacing
- Max canvas width before wrapping: ~900px
- Keep labels short: max 3-4 words
- Use varied, vibrant colors for each node
- Arrows indicate data/request flow direction
- Return ONLY valid JSON — no markdown, no backticks, no explanation

Output this exact schema:
{
  "title": "short diagram title",
  "elements": [
    {
      "id": "unique_node_id",
      "type": "rectangle",
      "label": "Node Label",
      "x": 50,
      "y": 200,
      "color": "#6366f1",
      "width": 130,
      "height": 60
    }
  ],
  "connections": [
    { "from": "node_id_1", "to": "node_id_2", "label": "flow label", "style": "arrow" }
  ]
}

Available element types: rectangle, ellipse, diamond
Available connection styles: arrow, dashed

USER DESCRIPTION: "${description}"`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '').replace(/^```\n?/, '');

    const diagram = JSON.parse(text);
    return NextResponse.json(diagram);
  } catch (error) {
    console.error('Diagram generation error:', error);
    return NextResponse.json({ error: 'Failed to generate diagram. Please try again.' }, { status: 500 });
  }
}
