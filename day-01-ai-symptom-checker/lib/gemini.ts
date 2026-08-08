import { PatientContext, ChatMessage, TriageAssessment } from '@/types';

export const SYSTEM_PROMPT = `
You are MediTriage AI, a clinical decision support and medical triage assistant adhering strictly to Emergency Severity Index (ESI) and WHO Emergency Triage Assessment and Treatment (ETAT) guidelines.

YOUR MANDATE:
1. Conduct a safe, empathetic, and objective preliminary triage.
2. Ask targeted, clarifying clinical follow-up questions ONE AT A TIME.
3. NEVER issue definitive medical diagnoses. Use probabilistic language ("may indicate", "is associated with", "possible condition").
4. ALWAYS categorize urgency into one of 4 levels:
   - "LOW": Routine self-care or general GP visit within 1-2 weeks if persistent.
   - "MEDIUM": Primary care physician appointment recommended within 24-72 hours.
   - "HIGH": Urgent Care Clinic or physician evaluation within 12-24 hours.
   - "EMERGENCY": Seek immediate Emergency Department (ER / 911 / 112) care immediately!

CRITICAL SAFETY PROTOCOL:
- If the user reports red-flag emergency symptoms (such as severe chest pain radiating to arm/jaw, sudden severe headache "thunderclap", severe shortness of breath, slurred speech, sudden weakness, violent abdominal pain), IMMEDIATELY classify riskLevel as "EMERGENCY", set followUpQuestion to null, and provide emergency instructions.

RESPONSE JSON FORMAT:
You MUST respond with pure JSON only in the following schema:
{
  "message": "Empathetic clinical response summarizing current context and reasoning.",
  "followUpQuestion": "Single precise follow-up question, or null if triage assessment is ready or emergency.",
  "assessment": {
    "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY",
    "possibleConditions": [
      {
        "name": "Condition Name",
        "confidence": 0.85, // float between 0.10 and 0.95
        "description": "Short 1-2 sentence medical explanation.",
        "recommendation": "Specific clinical note for this condition."
      }
    ],
    "nextSteps": [
      "Actionable step 1",
      "Actionable step 2"
    ],
    "urgency": "Clear timeframe e.g. 'Seek emergency care immediately' or 'Consult GP within 48 hours'",
    "summary": "Clinical triage summary",
    "disclaimer": "This automated triage tool is for informational reference only and does not replace emergency or professional medical care."
  }
}
`;

export function generateMockTriage(userMessage: string, patientContext?: PatientContext): {
  message: string;
  followUpQuestion: string | null;
  assessment?: TriageAssessment;
} {
  const text = userMessage.toLowerCase();

  if (text.includes('chest pain') || text.includes('heart') || text.includes('shortness of breath') || text.includes('faint')) {
    return {
      message: "Chest pain and difficulty breathing are symptoms that require immediate emergency evaluation to rule out acute cardiac or pulmonary conditions.",
      followUpQuestion: null,
      assessment: {
        riskLevel: 'EMERGENCY',
        possibleConditions: [
          {
            name: 'Acute Coronary Syndrome (ACS) / Myocardial Infarction',
            confidence: 0.88,
            description: 'Potential block in coronary blood flow requiring urgent cardiac assessment.',
            recommendation: 'Seek immediate emergency medical services.'
          },
          {
            name: 'Pulmonary Embolism',
            confidence: 0.65,
            description: 'Blood clot in pulmonary arteries causing sudden chest pain and breathing distress.',
            recommendation: 'Immediate ER evaluation.'
          },
          {
            name: 'Severe Angina or Pericarditis',
            confidence: 0.45,
            description: 'Inflammation of heart lining or restricted myocardial oxygen supply.',
            recommendation: 'Emergency department triage.'
          }
        ],
        nextSteps: [
          'Call 911 (or local emergency line) immediately.',
          'Do not drive yourself to the emergency department.',
          'Rest in a seated position and stay calm while waiting for paramedics.'
        ],
        urgency: 'Go to ER immediately or call Emergency Services (911 / 112)',
        summary: 'Emergency cardiac/pulmonary alert based on reported chest symptoms.',
        disclaimer: 'This automated triage is for educational reference only. Call 911 immediately.'
      }
    };
  }

  if (text.includes('headache') && (text.includes('stiff') || text.includes('light') || text.includes('fever') || text.includes('vomit'))) {
    return {
      message: "The combination of severe headache with neck stiffness, fever, or sensitivity to light requires urgent medical evaluation to exclude central nervous system infections or vascular issues.",
      followUpQuestion: null,
      assessment: {
        riskLevel: 'HIGH',
        possibleConditions: [
          {
            name: 'Meningitis / CNS Infection',
            confidence: 0.76,
            description: 'Inflammation of membranes surrounding the brain and spinal cord.',
            recommendation: 'Urgent medical examination within hours.'
          },
          {
            name: 'Severe Migraine with Photophobia & Nuchal Rigidity',
            confidence: 0.58,
            description: 'Complex neurological headache presenting with light sensitivity and neck tension.',
            recommendation: 'Physician assessment.'
          },
          {
            name: 'Atypical Sinus Infection or Intracranial Pressure',
            confidence: 0.35,
            description: 'Pressure buildup or acute sinus infection.',
            recommendation: 'Urgent Care visit.'
          }
        ],
        nextSteps: [
          'Visit an Urgent Care Center or Hospital Emergency Department today.',
          'Avoid bright lights and lie down in a quiet dark room while arranging care.',
          'Have someone drive you to the clinic or hospital.'
        ],
        urgency: 'Seek Urgent Medical Evaluation within 6–12 hours',
        summary: 'High risk neurological/infectious evaluation needed.',
        disclaimer: 'This automated tool is not a medical diagnosis. Consult a physician immediately.'
      }
    };
  }

  if (text.includes('fever') || text.includes('cough') || text.includes('sore throat') || text.includes('flu')) {
    return {
      message: "I understand you are feeling unwell with respiratory symptoms and fever. Let us monitor your symptoms closely.",
      followUpQuestion: "Are you experiencing any difficulty breathing, wheezing, or chest tightness when coughing?",
      assessment: {
        riskLevel: 'MEDIUM',
        possibleConditions: [
          {
            name: 'Viral Upper Respiratory Infection (Influenza / Common Cold)',
            confidence: 0.82,
            description: 'Typical viral pathogen causing fever, malaise, and sore throat.',
            recommendation: 'Rest, fluids, and GP consultation if persistent.'
          },
          {
            name: 'Acute Bronchitis',
            confidence: 0.48,
            description: 'Inflammation of bronchial tubes following viral illness.',
            recommendation: 'Monitor cough duration.'
          },
          {
            name: 'Strep Throat (Streptococcal Pharyngitis)',
            confidence: 0.38,
            description: 'Bacterial throat infection that responds well to antibiotics if confirmed by swab.',
            recommendation: 'Schedule doctor appointment for throat swab.'
          }
        ],
        nextSteps: [
          'Schedule an appointment with your General Practitioner (GP) within 48 hours.',
          'Stay hydrated with warm fluids, rest, and use OTC antipyretics if approved by your doctor.',
          'Monitor body temperature and seek urgent care if fever exceeds 103°F (39.4°C).'
        ],
        urgency: 'Consult Primary Care Doctor within 24–48 hours',
        summary: 'Moderate risk upper respiratory illness assessment.',
        disclaimer: 'Not medical advice. Consult your physician if symptoms worsen.'
      }
    };
  }

  return {
    message: "Thank you for describing how you are feeling. I have noted your symptoms and context.",
    followUpQuestion: "How many days have these symptoms been present, and are they worsening or staying steady?",
    assessment: {
      riskLevel: 'LOW',
      possibleConditions: [
        {
          name: 'General Fatigue & Mild Somatic Response',
          confidence: 0.70,
          description: 'Mild systemic response to stress, minor virus, or physical exertion.',
          recommendation: 'Rest and hydration.'
        },
        {
          name: 'Mild Seasonal Allergies',
          confidence: 0.45,
          description: 'Immune response to environmental allergens.',
          recommendation: 'Over-the-counter antihistamines if appropriate.'
        }
      ],
      nextSteps: [
        'Monitor symptoms over the next 48 hours.',
        'Ensure adequate hydration (8-10 glasses of water daily) and rest.',
        'Contact your doctor if symptoms persist or escalate.'
      ],
      urgency: 'Routine self-care; consult GP if symptoms persist over 5-7 days',
      summary: 'Low risk preliminary evaluation.',
      disclaimer: 'Educational triage tool only. Consult a doctor for any health concerns.'
    }
  };
}
