# Day 26 — Patient Medication Reminder System

## 🗓️ Day: 26 of 30
## 🏷️ Category: Healthcare Tech / PWA / Notifications
## ⚡ Difficulty: Intermediate
## 🕐 Estimated Build Time: 6–8 hours

---

## 📌 Project Overview

A Progressive Web App (installable on phone home screen) that helps patients manage complex medication schedules. Doctors or caregivers set up medication regimens with AI-assisted dosing reminders, drug interaction checker, adherence tracking, and automatic refill alerts. Critical for chronic disease patients (diabetes, hypertension, heart disease) who manage 5+ medications daily. Supports both English and Urdu for Pakistani healthcare context.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| Medication Schedule Setup | Add meds with dose, frequency, and timing |
| Push Notifications | Browser/PWA push reminders at set times |
| Drug Interaction Checker | AI flags dangerous medication combinations |
| Adherence Dashboard | Weekly/monthly medication compliance chart |
| Refill Reminder | Alerts when medication supply is running low |
| Missed Dose Guidance | AI explains what to do if dose missed |
| Caregiver Mode | Family member monitors patient compliance |
| Side Effect Log | Patient logs and tracks side effects |
| Prescription Scanner | OCR reads prescription to auto-populate |
| Bilingual UI | Full English + Urdu interface |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (PWA config), Tailwind CSS
- **PWA**: `next-pwa` for service worker + installability
- **Push Notifications**: Web Push API (VAPID keys) + `web-push` npm
- **AI**: Google Gemini 1.5 Pro (interaction checking, guidance)
- **OCR**: Tesseract.js (prescription scanning)
- **Database**: Supabase (medications, logs, user profiles)
- **Auth**: Supabase Auth + phone OTP (SMS via Twilio)
- **Deployment**: Vercel

---

## 🔧 Key Functions

### `checkDrugInteractions(medications: Medication[]): Promise<Interaction[]>`
Sends the complete list of patient medications (name + dosage) to Gemini with a clinical pharmacology system prompt. Returns severity-classified interaction warnings (SEVERE/MODERATE/MILD) with specific clinical guidance.

### `scheduleMedicationReminders(userId: string, medications: Medication[]): Promise<void>`
Calculates all reminder timestamps for the next 30 days based on frequency patterns (once daily, twice daily, with meals, etc.) and registers them as scheduled Web Push notifications via the VAPID push service.

### `logMedicationTaken(userId: string, medicationId: string, takenAt: Date): Promise<void>`
Records the exact dose-taken timestamp in Supabase, updates adherence statistics, and if a scheduled dose was missed (> 2 hours late), triggers the missed-dose guidance flow.

### `getMissedDoseGuidance(medication: Medication, hoursMissed: number): Promise<string>`
Generates safe, medication-specific guidance for a missed dose: whether to take late, skip and continue normally, or seek medical advice — based on medication type, half-life, and hours elapsed since scheduled time.

### `scanPrescription(imageBase64: string): Promise<PrescriptionData>`
Runs Tesseract.js OCR on a prescription photo then passes the extracted text to Gemini for structured parsing: medication names, dosages, frequencies, and duration extracted into medication objects ready for schedule creation.

---

## 📁 File Structure

```
med-reminder/
├── app/
│   ├── page.tsx                # Dashboard + today's schedule
│   ├── medications/page.tsx    # Medication list manager
│   ├── adherence/page.tsx      # Compliance charts
│   ├── caregiver/page.tsx      # Caregiver monitoring view
│   └── api/
│       ├── interactions/route.ts  # Drug interaction check
│       ├── guidance/route.ts      # Missed dose guidance
│       └── scan/route.ts          # OCR prescription
├── components/
│   ├── MedCard.tsx             # Medication card + take button
│   ├── AdherenceChart.tsx      # Weekly compliance chart
│   ├── InteractionAlert.tsx    # Drug interaction warning
│   ├── PrescriptionScanner.tsx # Camera + OCR UI
│   └── ReminderSettings.tsx    # Push notification setup
├── public/
│   └── sw.js                  # Service Worker (PWA)
└── lib/
    ├── push.ts                # Web Push API
    ├── gemini.ts
    └── ocr.ts
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are a clinical pharmacist AI assistant. Check this patient's medication list 
for drug interactions and provide actionable clinical guidance.

Classification:
- SEVERE: Contraindicated — Do not take together
- MODERATE: Use with caution — Monitor closely
- MILD: Minor interaction — Usually manageable

For each interaction provide:
1. Which specific drugs interact
2. What the interaction causes physiologically
3. Specific monitoring recommendations
4. Whether patient should contact doctor

Output JSON only:
{
  "interactions": [
    {
      "severity": "SEVERE",
      "drugs": ["Warfarin", "Aspirin"],
      "mechanism": "Both inhibit clotting, dramatically increasing bleeding risk",
      "clinicalRisk": "Risk of internal hemorrhage, stroke from bleeding",
      "action": "CONTACT DOCTOR IMMEDIATELY — do not take together without medical supervision",
      "monitoring": "Watch for unusual bruising, blood in urine/stool, prolonged bleeding"
    }
  ],
  "overallSafetyRating": "HIGH_RISK",
  "recommendedAction": "Contact prescribing physician before taking all medications together"
}

PATIENT MEDICATIONS: {medications}
```

---

## 📤 Expected Output (Result)

**Patient Medications:** Metformin 500mg, Lisinopril 10mg, Aspirin 81mg, Ibuprofen 400mg

```json
{
  "interactions": [
    {
      "severity": "SEVERE",
      "drugs": ["Lisinopril", "Ibuprofen"],
      "mechanism": "NSAIDs (Ibuprofen) reduce kidney blood flow and block the vasodilation effect of ACE inhibitors (Lisinopril), causing acute kidney injury and dangerous blood pressure spikes",
      "clinicalRisk": "Acute kidney injury, hypertensive crisis, reduced effectiveness of blood pressure control",
      "action": "CONTACT DOCTOR — Replace Ibuprofen with Paracetamol (Tylenol) for pain relief",
      "monitoring": "Monitor blood pressure daily and watch for decreased urination or ankle swelling"
    },
    {
      "severity": "MODERATE",
      "drugs": ["Aspirin", "Ibuprofen"],
      "mechanism": "Ibuprofen blocks Aspirin's antiplatelet effect, reducing cardiovascular protection",
      "clinicalRisk": "Reduced cardioprotective benefit of low-dose Aspirin",
      "action": "Take Aspirin at least 30 minutes BEFORE Ibuprofen if both must be used",
      "monitoring": "Discuss with cardiologist if both are needed long-term"
    }
  ],
  "overallSafetyRating": "HIGH_RISK",
  "recommendedAction": "Contact your doctor today about replacing Ibuprofen with Paracetamol"
}
```

**UI Display:**
```
💊 Medication Reminder — Today's Schedule

📅 Thursday | 4 medications due

⏰ 8:00 AM
  ✅ Metformin 500mg — TAKEN (8:03 AM)
  ✅ Lisinopril 10mg — TAKEN (8:03 AM)

⏰ 2:00 PM
  ⏳ Metformin 500mg — Due in 2 hours
  ⏳ Aspirin 81mg    — Due in 2 hours

🚨 DRUG INTERACTION ALERT:
  SEVERE: Lisinopril + Ibuprofen
  Risk: Kidney damage + BP spike
  Action: Contact your doctor today

Adherence This Week: 91% 🟢 Excellent

[Mark as Taken] [Contact Doctor] [Scan Prescription]
```

---

## 🚀 Stretch Goals

- [ ] WhatsApp bot for medication reminders (Twilio WhatsApp API)
- [ ] Integration with pharmacy apps for refill ordering
- [ ] Telemedicine link — video call with doctor from app
- [ ] Multi-patient mode for clinic management use case
