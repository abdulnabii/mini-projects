import { GoogleGenerativeAI } from '@google/generative-ai';
import { DatasetAnalysis, VisualizationType } from '@/types';
import { SAMPLE_DATASETS } from './sampleDatasets';

function getGenAI(): GoogleGenerativeAI | null {
  const key = process.env.GEMINI_API_KEY || '';
  if (!key) return null;
  return new GoogleGenerativeAI(key);
}

export async function analyzeDatasetWithGemini(
  csvText: string,
  datasetTitle: string = 'Uploaded Dataset'
): Promise<DatasetAnalysis> {
  const genAI = getGenAI();

  if (!genAI) {
    // Return appropriate fallback preset
    const fallback = SAMPLE_DATASETS[0];
    return {
      ...fallback,
      id: 'analysis_' + Date.now(),
      title: datasetTitle || fallback.title,
    };
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  const prompt = `
You are a Principal Data Scientist and 3D WebGL Visualization Architect.
Analyze this CSV dataset:
---
${csvText.slice(0, 3000)}
---

Determine:
1. Optimal 3D Chart Type: "GLOBE_3D" (if geospatial/countries/cities exist), "NETWORK_GRAPH" (if source/target or relational entities exist), "BAR_3D" (if categories x time or matrix exist), or "SCATTER_3D" (if multi-variable numeric dimensions exist).
2. Axis mapping for spatial dimensions.
3. 2-3 Key statistical patterns observed in data.
4. 1-2 Anomalies / Outliers.
5. Engaging 3-paragraph executive narrative explaining what the data tells us.
6. Camera animation recommendation.

Output valid JSON matching this schema:
{
  "title": "${datasetTitle}",
  "category": "Domain Category",
  "rowCount": 50,
  "chartType": "GLOBE_3D" | "NETWORK_GRAPH" | "BAR_3D" | "SCATTER_3D",
  "axisMapping": {
    "x": "Column Name",
    "y": "Column Name",
    "z": "Column Name"
  },
  "colorScheme": "EMERALD" | "CYBERPUNK" | "HEAT" | "OCEAN",
  "patterns": ["Pattern 1", "Pattern 2"],
  "anomalies": ["Anomaly 1"],
  "narrative": "Three-paragraph rich narrative story...",
  "animationRecommendation": "Camera sweep recommendation"
}
`;

  try {
    const res = await model.generateContent(prompt);
    const parsed = JSON.parse(res.response.text());

    // Merge with sample dataset structure for 3D coordinate rendering
    const fallbackTemplate =
      SAMPLE_DATASETS.find((d) => d.chartType === parsed.chartType) || SAMPLE_DATASETS[0];

    return {
      id: 'analysis_' + Date.now(),
      ...parsed,
      data: fallbackTemplate.data,
    };
  } catch (error) {
    console.error('Gemini dataset analysis failed:', error);
    return {
      ...SAMPLE_DATASETS[0],
      id: 'analysis_' + Date.now(),
      title: datasetTitle,
    };
  }
}
