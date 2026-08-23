# MediGuard.AI — Patient Medication Reminder System & AI Clinical Safety Guardian

> **Day 26 of 30 Mini Projects**  
> An AI-powered patient medication schedule manager and clinical safety guardian for chronic disease regimens with real-time dosing reminders, Gemini-powered drug interaction cross-checking, adherence compliance tracking, and AI prescription OCR scanning.

---

## 🌟 Key Features

1. **💊 Daily Dose Timeline & Smart Check-in (`components/DoseTimeline.tsx`)**:
   - Time-slotted dose cards (*Morning 8:00 AM*, *Afternoon 1:00 PM*, *Evening 8:00 PM*, *Bedtime 10:00 PM*).
   - Pill strength (e.g. `Metformin 500mg`), meal instructions, remaining stock counter, 1-click **"Mark as Taken"**, and Web Speech voice reminders.

2. **🚨 Gemini 1.5 Flash Clinical Drug Interaction Safety Radar (`components/InteractionRadar.tsx`)**:
   - Real-time clinical cross-check of active medications for dangerous combinations (e.g. `Lisinopril + Ibuprofen`).
   - Severity classification: `SEVERE` (Contraindicated), `MODERATE`, `MILD`.
   - Physiological mechanism, clinical warnings, and safe alternative suggestions.

3. **📷 Prescription Camera & AI OCR Scanner (`components/PrescriptionScanner.tsx`)**:
   - Upload prescription image or select sample prescription photos.
   - Gemini 1.5 extracts medication names, strengths, frequencies, and durations to auto-populate the patient's schedule.

4. **📊 Adherence Compliance & Streak Analytics (`components/AdherenceDashboard.tsx` & `/adherence`)**:
   - 7-day pill compliance grid, adherence percentage gauge (e.g. `94% Excellent`), and consecutive day streak tracker.

5. **❓ AI Missed-Dose Clinical Advisor (`components/MissedDoseAdvisor.tsx` & `/api/guidance`)**:
   - Select missed medication and hours elapsed to get instant pharmacological advice (take now vs skip to next dose).

6. **👨‍⚕️ Caregiver & Family Monitoring Portal (`/caregiver`)**:
   - Remote compliance telemetry for family members and caregivers with emergency contact triggers and WhatsApp reminders.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack) with App Router
- **Styling**: Tailwind CSS, Lucide React, Framer Motion
- **AI Engine**: Google Gemini 1.5 Flash
- **Language**: TypeScript

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/abdulnabii/mini-projects.git
cd mini-projects/day-26-medication-reminder-system

# Install dependencies
npm install

# Set environment variables (.env.local)
GEMINI_API_KEY=your_gemini_api_key_here

# Run development server
npm run dev
```

---

## 👨‍💻 Author
Built with ❤️ by **[Abdul Nabi](https://github.com/abdulnabii)**
