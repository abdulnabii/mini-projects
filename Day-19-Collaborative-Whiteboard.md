# Day 19 — Real-Time Collaborative Whiteboard

## 🗓️ Day: 19 of 30
## 🏷️ Category: Real-Time / Collaboration / WebSockets
## ⚡ Difficulty: Advanced
## 🕐 Estimated Build Time: 8–10 hours

---

## 📌 Project Overview

A real-time collaborative infinite canvas whiteboard — like Figma FigJam or Miro — built from scratch. Multiple users can draw, add sticky notes, shapes, arrows, and text simultaneously. Each cursor shows the collaborator's name. AI assistant can generate diagrams from text descriptions ("Draw a microservices architecture with 4 services") and convert hand-drawn shapes to polished vector graphics.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| Infinite Canvas | Pan/zoom infinite workspace with minimap |
| Freehand Drawing | Smooth pressure-sensitive drawing tool |
| Shape Library | Rectangles, circles, diamonds, arrows, connectors |
| Sticky Notes | Colorful draggable notes with rich text |
| Live Cursors | See all collaborators' cursors with name labels |
| Real-Time Sync | WebSocket-based instant sync across all clients |
| AI Diagram Gen | Text-to-diagram ("Draw a system architecture") |
| Shape Recognition | Converts rough drawings to clean shapes |
| Room System | Create/join rooms via shareable link |
| Export | PNG, SVG, or PDF export of canvas |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Canvas API / Konva.js, Rough.js
- **Real-Time**: Liveblocks (WebSocket multiplayer infrastructure)
- **AI**: Google Gemini (diagram generation) + Perfect Freehand (stroke smoothing)
- **Storage**: Liveblocks Storage (CRDT-based conflict resolution)
- **Export**: `html2canvas` + `jspdf`
- **Deployment**: Vercel

---

## 🔧 Key Functions

### `initializeLiveblocksRoom(roomId: string): Room`
Connects to Liveblocks room using CRDT storage. Sets up presence (cursor position, username, active tool) and storage (canvas elements array). Handles conflict-free real-time synchronization.

### `handleCanvasDraw(points: Point[], tool: Tool, style: DrawStyle): CanvasElement`
Processes freehand drawing points using Perfect Freehand to smooth strokes, then converts to SVG path and adds to shared Liveblocks storage — broadcasting to all connected clients instantly.

### `generateDiagramFromText(description: string): Promise<DiagramElement[]>`
Sends natural language diagram description to Gemini. Returns structured array of shapes, connections, and labels with x/y positions that get rendered on the canvas.

### `recognizeShape(points: Point[]): Shape | null`
Applies heuristic shape recognition to rough hand-drawn points — detecting rectangles, circles, triangles, and arrows — then replaces rough drawing with clean vector version.

### `exportCanvas(elements: CanvasElement[], format: 'png' | 'svg' | 'pdf'): Promise<Blob>`
Renders all canvas elements to off-screen canvas and exports in the specified format, handling proper scaling for high-DPI displays.

---

## 📁 File Structure

```
collab-whiteboard/
├── app/
│   ├── page.tsx              # Landing + create/join room
│   ├── board/[roomId]/
│   │   └── page.tsx          # Main whiteboard canvas
│   └── api/diagram/route.ts  # AI diagram generation
├── components/
│   ├── Canvas.tsx            # Main Konva canvas
│   ├── Toolbar.tsx           # Drawing tools sidebar
│   ├── LiveCursors.tsx       # Real-time cursor display
│   ├── StickyNote.tsx        # Sticky note component
│   ├── DiagramModal.tsx      # AI diagram generator UI
│   └── Minimap.tsx           # Canvas overview minimap
└── lib/
    ├── liveblocks.ts
    ├── shapes.ts
    └── export.ts
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are a diagram layout engine. Convert the user's natural language description 
into a structured diagram specification.

Rules:
- Position elements logically (left-to-right data flow, top-to-bottom hierarchy)
- Use x/y grid coordinates (each unit = 150px)
- Keep labels short (max 3 words)
- Arrows indicate data/request flow direction

Output JSON only:
{
  "title": "Diagram title",
  "elements": [
    {
      "id": "client",
      "type": "rectangle",
      "label": "Web Client",
      "x": 0, "y": 2,
      "color": "#6366f1",
      "width": 120, "height": 60
    }
  ],
  "connections": [
    { "from": "client", "to": "api-gateway", "label": "HTTP Request", "style": "arrow" }
  ]
}

USER DESCRIPTION: "Draw a microservices architecture with an API gateway,
 auth service, user service, and PostgreSQL database"
```

---

## 📤 Expected Output (Result)

```json
{
  "title": "Microservices Architecture",
  "elements": [
    { "id": "client", "type": "rectangle", "label": "Web Client", "x": 0, "y": 2, "color": "#94a3b8" },
    { "id": "gateway", "type": "rectangle", "label": "API Gateway", "x": 2, "y": 2, "color": "#6366f1" },
    { "id": "auth", "type": "rectangle", "label": "Auth Service", "x": 4, "y": 0, "color": "#f59e0b" },
    { "id": "users", "type": "rectangle", "label": "User Service", "x": 4, "y": 2, "color": "#10b981" },
    { "id": "db", "type": "cylinder", "label": "PostgreSQL", "x": 6, "y": 2, "color": "#3b82f6" }
  ],
  "connections": [
    { "from": "client", "to": "gateway", "label": "HTTPS", "style": "arrow" },
    { "from": "gateway", "to": "auth", "label": "JWT Verify", "style": "arrow" },
    { "from": "gateway", "to": "users", "label": "Route", "style": "arrow" },
    { "from": "users", "to": "db", "label": "SQL Query", "style": "arrow" }
  ]
}
```

**UI Display:**
```
🎨 Collaborative Whiteboard — Room: arch-review-2026

[Live Users: 👤 Abdul · 👤 Fatima · 👤 Ali]

Canvas renders:
  ┌──────────┐     ┌─────────────┐     ┌──────────────┐
  │ Web      │────▶│ API Gateway │────▶│ Auth Service │
  │ Client   │     │             │     └──────────────┘
  └──────────┘     │             │────▶┌──────────────┐     ┌────────────┐
                   └─────────────┘     │ User Service │────▶│ PostgreSQL │
                                       └──────────────┘     └────────────┘

✅ Diagram generated from: "microservices with API gateway..."
[Export PNG] [Export SVG] [Share Link 🔗]
```

---

## 🚀 Stretch Goals

- [ ] Voice command drawing ("Add a database node on the right")
- [ ] Template library (System Design, ERD, Flowchart starters)
- [ ] Presentation mode with laser pointer
- [ ] Version history with time-travel slider
