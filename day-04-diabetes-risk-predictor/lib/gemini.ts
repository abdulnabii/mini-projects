import { GoogleGenerativeAI } from '@google/generative-ai';
import { PatientVitals, RecommendationItem } from '@/types';

const apiKey = process.env.GEMINI_API_KEY || '';

export async function generateLifestyleRecommendations(
  vitals: PatientVitals,
  riskPercent: number
): Promise<RecommendationItem[]> {
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are an empathetic, evidence-based Clinical Health Advisor AI.
A patient received a Diabetes Risk Assessment score of ${riskPercent}% with the following vitals:
- Glucose: ${vitals.glucose} mg/dL (normal: 70-99 mg/dL)
- BMI: ${vitals.bmi} kg/m² (normal: 18.5-24.9 kg/m²)
- Blood Pressure: ${vitals.bloodPressure} mmHg (normal: 60-79 mmHg)
- Age: ${vitals.age} years

Generate 4 personalized, actionable, evidence-based lifestyle recommendations addressing these vitals.
Return ONLY a JSON array of objects with this structure:
[
  {
    "id": "rec_1",
    "category": "Diet",
    "advice": "Reduce refined sugars...",
    "priority": "HIGH",
    "icon": "🥗"
  }
]`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn('Gemini API call failed, using heuristic clinical recommendations:', err);
    }
  }

  // Fallback Rule-Based Clinical Recommendations
  return fallbackRecommendations(vitals, riskPercent);
}

function fallbackRecommendations(vitals: PatientVitals, riskPercent: number): RecommendationItem[] {
  const list: RecommendationItem[] = [];

  if (vitals.glucose > 99) {
    list.push({
      id: 'rec_diet',
      category: 'Diet',
      advice: `Reduce refined carbohydrate & sugar intake. Your glucose of ${vitals.glucose} mg/dL suggests monitoring carbohydrate density and transitioning to high-fiber, low-glycemic foods.`,
      priority: vitals.glucose > 125 ? 'HIGH' : 'MEDIUM',
      icon: '🥗',
    });
  } else {
    list.push({
      id: 'rec_diet_norm',
      category: 'Diet',
      advice: 'Maintain a balanced Mediterranean-style diet rich in leafy greens, healthy fats, and lean proteins to sustain healthy glucose levels.',
      priority: 'LOW',
      icon: '🥗',
    });
  }

  if (vitals.bmi > 24.9) {
    list.push({
      id: 'rec_weight',
      category: 'Weight Management',
      advice: `A 5–7% reduction in body weight (BMI: ${vitals.bmi}) has been clinically proven to reduce Type 2 diabetes incidence by up to 58% in at-risk individuals.`,
      priority: vitals.bmi > 29.9 ? 'HIGH' : 'MEDIUM',
      icon: '⚖️',
    });
  }

  list.push({
    id: 'rec_activity',
    category: 'Physical Activity',
    advice: 'Engage in 150 minutes per week of moderate aerobic exercise (brisk walking, cycling) plus 2 days of strength training to enhance insulin sensitivity.',
    priority: riskPercent > 50 ? 'HIGH' : 'MEDIUM',
    icon: '🏃',
  });

  list.push({
    id: 'rec_medical',
    category: 'Medical Follow-Up',
    advice: riskPercent > 60
      ? 'Schedule a comprehensive HbA1c and fasting blood test with your physician within 2 weeks for formal clinical evaluation.'
      : 'Include annual fasting blood glucose testing during your routine wellness checkup.',
    priority: riskPercent > 60 ? 'HIGH' : 'LOW',
    icon: '🏥',
  });

  return list;
}
