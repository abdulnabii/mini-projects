# Day 28 — 3D Interactive Data Visualization Platform

## 🗓️ Day: 28 of 30
## 🏷️ Category: Data Visualization / 3D Web / WebGL
## ⚡ Difficulty: Advanced
## 🕐 Estimated Build Time: 8–10 hours

---

## 📌 Project Overview

A stunning 3D data visualization platform built with Three.js and React Three Fiber. Upload any CSV dataset and the AI automatically selects the optimal chart type, generates an immersive 3D visualization (globe maps, network graphs, 3D bar charts, particle scatter plots), and provides AI-generated narrative insights about patterns and anomalies. Makes data feel alive and explorable in a way 2D charts never could.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| CSV Auto-Analysis | Upload CSV → AI detects columns and relationships |
| 3D Chart Selection | AI picks optimal 3D visualization type |
| 3D Globe Map | Geographic data mapped on interactive 3D globe |
| 3D Network Graph | Relationship/connection visualization in 3D space |
| 3D Bar & Surface | Animated 3D bar charts and terrain surfaces |
| Particle Scatter | 100K+ data points rendered as particle field |
| AI Narrative | AI generates story about patterns in the data |
| Interactive Controls | Orbit, zoom, filter by clicking data points |
| Real-Time Animation | Data changes animated with smooth transitions |
| Export as Video | Record 10-second rotating 3D chart as MP4 |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React Three Fiber, Three.js, Drei (R3F helpers)
- **3D Globe**: `three-globe` library
- **AI Analysis**: Google Gemini 1.5 Pro
- **CSV Parsing**: `papaparse`
- **Animations**: GSAP + React Spring
- **Video Export**: `MediaRecorder API` + `ffmpeg.wasm`
- **Deployment**: Vercel

---

## 🔧 Key Functions

### `analyzeDataset(csvText: string): Promise<DatasetAnalysis>`
Sends first 100 rows + column headers to Gemini. Returns column data types, detected relationships, recommended 3D chart type, color scheme, and AI-generated hypothesis about the dataset's story.

### `renderGlobe3D(data: GeoDataPoint[], colorMetric: string): JSX.Element`
Uses `three-globe` to render an interactive 3D Earth globe with data points sized and colored by the specified metric. Supports arc connections between countries for flow data.

### `renderNetworkGraph3D(nodes: Node[], edges: Edge[]): JSX.Element`
Implements a force-directed 3D graph layout algorithm. Nodes orbit and settle to natural positions, with edges rendered as glowing THREE.Line segments. Clicking a node highlights all connections.

### `generateDataNarrative(analysis: DatasetAnalysis, insights: Insight[]): Promise<string>`
Sends the data analysis summary, detected patterns, and statistical outliers to Gemini. Returns a concise, engaging 3-paragraph narrative explaining what the data tells us in natural language.

### `exportVisualizationVideo(scene: THREE.Scene, duration: number): Promise<Blob>`
Uses `MediaRecorder API` to capture the rotating Three.js canvas for `duration` seconds. Returns a compressed MP4 video blob ready for download or sharing.

---

## 📁 File Structure

```
3d-dataviz/
├── app/
│   ├── page.tsx              # Landing + file upload
│   ├── visualize/[id]/
│   │   └── page.tsx          # 3D visualization view
│   └── api/
│       ├── analyze/route.ts  # Dataset AI analysis
│       └── narrative/route.ts# AI story generation
├── components/
│   ├── Canvas3D.tsx          # Main R3F canvas
│   ├── Globe3D.tsx           # 3D globe component
│   ├── NetworkGraph3D.tsx    # 3D network graph
│   ├── BarChart3D.tsx        # 3D bar chart
│   ├── ParticleField.tsx     # Particle scatter plot
│   ├── DataNarrative.tsx     # AI story sidebar
│   └── ControlPanel.tsx      # Filter + view controls
└── lib/
    ├── csv-parser.ts
    ├── chart-selector.ts     # AI chart type picker
    ├── gemini.ts
    └── video-export.ts
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are a data scientist and visualization expert. Analyze this dataset and 
recommend the optimal 3D visualization approach.

DATASET PREVIEW (first 5 rows):
{dataPreview}

COLUMN NAMES AND INFERRED TYPES:
{columns}

Based on the data structure, determine:
1. The best 3D chart type for this data
2. Which columns to use for X, Y, Z axes or size/color
3. Key patterns or anomalies you notice
4. The data's "story" in 2 sentences

Output JSON only:
{
  "chartType": "GLOBE_3D|NETWORK_GRAPH|BAR_3D|SCATTER_3D|SURFACE_3D",
  "axisMapping": { "x": "column_name", "y": "column_name", "z": "column_name", "color": "column_name", "size": "column_name" },
  "colorScheme": "HEAT|COOL|RAINBOW|MONOCHROME",
  "patterns": ["Pattern 1 description", "Pattern 2 description"],
  "anomalies": ["Anomaly 1 description"],
  "dataNarrative": "Two-sentence compelling story about this data",
  "animationRecommendation": "Rotate and zoom in on cluster at coordinates (x,y)"
}

DATASET: {csvSample}
```

---

## 📤 Expected Output (Result)

**Dataset:** Global COVID-19 cases by country (country, total_cases, deaths, vaccinations, population, continent)

```json
{
  "chartType": "GLOBE_3D",
  "axisMapping": {
    "geo": "country",
    "height": "total_cases",
    "color": "death_rate",
    "size": "vaccination_rate"
  },
  "colorScheme": "HEAT",
  "patterns": [
    "Strong clustering of high case counts in North America and Europe in early 2021",
    "Southeast Asia shows delayed but steep surge pattern — 6 months behind Western peaks",
    "Higher vaccination rates strongly correlate with lower death rates globally"
  ],
  "anomalies": [
    "New Zealand maintains near-zero cases for 18 months — extreme outlier due to island isolation strategy",
    "India shows case counts 3-5x underreported compared to excess mortality estimates"
  ],
  "dataNarrative": "This global COVID data reveals two distinct pandemic waves: a Western-first surge in early 2021, followed by a mirrored wave sweeping through South and Southeast Asia. The data makes vaccination's protective effect undeniable — every 10% increase in vaccination rate corresponds to roughly 23% reduction in death rate.",
  "animationRecommendation": "Begin from space view, zoom to Europe cluster, then pan east to show Indian subcontinent surge"
}
```

**UI Display:**
```
🌍 3D Data Visualization — COVID-19 Global Impact

[Immersive 3D Globe rotating on screen]
  📍 Glowing red spikes over USA, Europe (peak cases)
  📍 Blue spheres = high vaccination rate
  📍 Height = total cases per country

🤖 AI Narrative:
"This global COVID data reveals two distinct pandemic
 waves: a Western-first surge in early 2021, followed
 by a mirrored wave sweeping through South Asia..."

Key Patterns:
  • High vaccination = 23% lower death rate
  • New Zealand: extreme outlier

[🎥 Export as Video] [Filter by Continent] [Change Chart Type]
```

---

## 🚀 Stretch Goals

- [ ] Real-time streaming data visualization (WebSocket feeds)
- [ ] AR mode (view chart floating in room via WebXR)
- [ ] Multi-dataset overlay and comparison
- [ ] Collaborative viewing room (multiple users explore together)
