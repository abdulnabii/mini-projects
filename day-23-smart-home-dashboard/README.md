# AuraHome.AI — Voice-Controlled Smart Home Ecosystem & Energy Intelligence

> **Day 23 of 30 Mini Projects**  
> AI-powered, browser-native voice smart home control center with natural language command parsing, speech synthesis feedback, automated scenes, live power draw radar, and IF/THEN automation rules.

---

## 🌟 Key Features

1. **🎙️ Web Speech STT & TTS Voice Engine**:
   - Continuous / push-to-talk speech recognition with animated audio visualizer waveform.
   - Spoken Text-to-Speech confirmation feedback for every executed action.
   - 4 Instant 1-Click voice command quick chips (*Movie Night*, *Goodnight*, *Morning Rise*, *Eco Mode*).

2. **🧠 Gemini 1.5 Low-Latency Intent Parsing**:
   - Natural language comprehension of multi-device commands, relative dimming/cooling adjustments, and smart home scene triggers.
   - Dynamic deterministic fallback state machine for zero-latency offline demo execution.

3. **🏠 Room-by-Room Device Grid**:
   - 12 Simulated smart home appliances across 6 zones (*Living Room*, *Master Bedroom*, *Kitchen*, *Home Office*, *Security & Entry*, *Patio & Outdoor*).
   - Interactive sliders for Dimmable RGB Lights, Thermostats (Cool/Heat/Eco), Smart Locks, Audio Volume, and Espresso Maker.

4. **🎬 Scene Automation Bar**:
   - 1-Click transitions: 🎬 *Movie Night*, 😴 *Sleep Sanctuary*, 🏃 *Away / Lockdown*, ☀️ *Morning Rise*, 💼 *Deep Focus Work*, 🌿 *Eco Saver*.

5. **⚡ Real-Time Energy Radar (`/energy`)**:
   - Live power draw (Watts), daily kWh consumption, and projected monthly bills.
   - 24-Hour power curve with Gemini 1.5 Flash efficiency optimization recommendations.

6. **⚙️ Smart Rule Builder (`/automations`)**:
   - Custom IF/THEN automation engine supporting Time, Motion, and Temperature triggers.

7. **🛡️ Security & Video Surveillance (`/security`)**:
   - Multi-camera simulated streams, motion detection alerts, and 1-Click **Panic Lockdown**.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack) with App Router
- **Styling**: Tailwind CSS, Lucide React, Framer Motion
- **Charts**: Recharts (24-hour power curve)
- **Voice**: Web Speech API (STT SpeechRecognition + TTS SpeechSynthesis)
- **AI Engine**: Google Gemini 1.5 Flash
- **Language**: TypeScript

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/abdulnabii/mini-projects.git
cd mini-projects/day-23-smart-home-dashboard

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
