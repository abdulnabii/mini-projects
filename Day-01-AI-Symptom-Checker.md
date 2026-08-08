# Day 01 — AI Symptom Checker & Triage Assistant

## 🗓️ Day: 1 of 30
## 🏷️ Category: Healthcare AI / Full-Stack Web App
## ⚡ Difficulty: Intermediate
## 🕐 Estimated Build Time: 6–8 hours

---

## 📌 Project Overview

An intelligent, conversational symptom checker that allows users to describe how they feel in plain English. The AI analyzes symptoms, asks clarifying follow-up questions, then provides a risk-level triage (Low / Medium / High), possible conditions, and recommended next steps — all without replacing a real doctor.

Built for Abdul Nabi's portfolio to showcase healthcare AI expertise and real-world NLP problem solving.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| Conversational Chat UI | Users type symptoms in natural language |
| AI Follow-up Questions | Dynamically asks relevant clarifying questions |
| Risk Triage Engine | Classifies: Low / Medium / High / Emergency |
| Possible Conditions List | Returns top 3–5 likely conditions with confidence % |
| Recommended Next Steps | "See GP within 3 days", "Go to ER now", etc. |
| Symptom History Log | Saves session locally for review |
| Dark Mode UI | Premium healthcare-grade dark interface |
| Disclaimer Banner | Legal disclaimer always visible |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion
- **AI Engine**: Google Gemini 1.5 Pro API (chat completion)
- **State Management**: React useState + useReducer
- **Storage**: localStorage (session history)
- **Deployment**: Vercel

---

## 🔧 Key Functions

### `analyzeSymptoms(messages: Message[]): Promise<TriageResult>`
Sends the full chat history to Gemini API with a system prompt that enforces medical triage behavior. Returns structured JSON with `riskLevel`, `possibleConditions[]`, `nextSteps[]`, and `followUpQuestion`.

### `buildSystemPrompt(): string`
Constructs a detailed system prompt that instructs the AI to act as a medical triage assistant, follow WHO triage guidelines, ask one clarifying question at a time, and output structured JSON.

### `classifyRisk(conditions: Condition[]): RiskLevel`
Post-processes AI output to normalize risk to `LOW | MEDIUM | HIGH | EMERGENCY`.

### `renderTriageCard(result: TriageResult): JSX.Element`
Renders a beautiful animated card showing risk level with color coding (green/yellow/orange/red), conditions list, and action steps.

### `saveSessionToHistory(session: Session): void`
Persists conversation to localStorage with timestamp and triage result for later review.

---

## 📁 File Structure

```
ai-symptom-checker/
├── app/
│   ├── page.tsx              # Landing + chat entry
│   ├── chat/page.tsx         # Main chat interface
│   └── history/page.tsx      # Past sessions
├── components/
│   ├── ChatWindow.tsx        # Message bubbles UI
│   ├── TriageCard.tsx        # Result display card
│   ├── RiskBadge.tsx         # Color-coded risk badge
│   └── DisclaimerBanner.tsx  # Legal banner
├── lib/
│   ├── gemini.ts             # Gemini API wrapper
│   ├── triage.ts             # Risk classification logic
│   └── storage.ts            # localStorage utils
└── types/index.ts
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are MediTriage, an AI-powered medical symptom checker. You follow WHO emergency triage protocols.

Rules:
1. NEVER diagnose. Always say "possible" or "may indicate".
2. Ask ONLY ONE follow-up question per response.
3. After 3-5 messages, produce a final triage assessment.
4. Always output valid JSON in this exact format:
{
  "message": "Your empathetic response here",
  "followUpQuestion": "One specific question or null if assessment ready",
  "assessment": {
    "riskLevel": "LOW|MEDIUM|HIGH|EMERGENCY",
    "possibleConditions": [
      {"name": "Condition Name", "confidence": 0.75, "description": "Brief description"}
    ],
    "nextSteps": ["Step 1", "Step 2"],
    "urgency": "See a doctor within X days / Go to ER immediately"
  } | null
}
5. For EMERGENCY cases, immediately set followUpQuestion to null and trigger assessment.
6. Be empathetic, clear, and non-alarming unless genuinely urgent.

USER INPUT: "I've had a headache for 3 days, some neck stiffness, and I'm sensitive to light"
```

---

## 📤 Expected Output (Result)

```json
{
  "message": "I'm sorry you're feeling this way. A combination of headache, neck stiffness, and light sensitivity is something we should take seriously.",
  "followUpQuestion": null,
  "assessment": {
    "riskLevel": "HIGH",
    "possibleConditions": [
      {
        "name": "Meningitis",
        "confidence": 0.72,
        "description": "Inflammation of membranes surrounding brain and spinal cord"
      },
      {
        "name": "Severe Migraine with Aura",
        "confidence": 0.61,
        "description": "Intense migraine episode with neurological symptoms"
      },
      {
        "name": "Subarachnoid Hemorrhage",
        "confidence": 0.34,
        "description": "Bleeding in space surrounding the brain"
      }
    ],
    "nextSteps": [
      "Go to the nearest Emergency Room immediately",
      "Do not drive yourself — call emergency services or have someone take you",
      "Inform the ER about the duration and all three symptoms together"
    ],
    "urgency": "Go to ER immediately — do not wait"
  }
}
```

**UI Output:**
```
🔴 HIGH RISK — Seek Emergency Care

Possible Conditions:
  • Meningitis (72% match)
  • Severe Migraine with Aura (61% match)
  • Subarachnoid Hemorrhage (34% match)

⚠️ Recommended Action:
  Go to the nearest Emergency Room immediately.
  Do not drive yourself.

─────────────────────────────
⚕️ Disclaimer: This is not a medical diagnosis.
   Always consult a qualified healthcare professional.
```

---

## 🚀 Stretch Goals (Post-MVP)

- [ ] Voice input using Web Speech API
- [ ] Multi-language support (Urdu, Arabic)
- [ ] Integration with nearby hospital locator (Google Maps API)
- [ ] Export session as PDF for doctor visit
- [ ] Age/gender context for better triage accuracy
