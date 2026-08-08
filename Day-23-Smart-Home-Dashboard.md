# Day 23 — Voice-Controlled Smart Home Dashboard

## 🗓️ Day: 23 of 30
## 🏷️ Category: IoT / Voice AI / Real-Time Dashboard
## ⚡ Difficulty: Advanced
## 🕐 Estimated Build Time: 8–10 hours

---

## 📌 Project Overview

A sleek, voice-controlled smart home control center that runs in the browser. Users speak commands to control simulated (or real, via MQTT) smart home devices: lights, thermostats, locks, cameras, and appliances. AI understands complex natural language commands, maintains device state, provides energy insights, and learns usage patterns to make automated suggestions. Works with Home Assistant and Tuya Smart APIs.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| Voice Command Interface | Web Speech API for always-on voice control |
| Device Dashboard | Visual grid of all home devices with state |
| Scene Management | Preconfigured scenes (Movie Night, Sleep, Away) |
| Energy Monitor | Real-time power consumption by device/room |
| AI Command Understanding | Natural language parsing for complex commands |
| Automation Rules | IF/THEN rule builder with time/trigger conditions |
| Climate Control | Thermostat control with humidity and air quality |
| Security Panel | Lock/unlock doors, view camera feeds, set alarms |
| Usage Patterns | AI learns and suggests optimized schedules |
| MQTT Integration | Real-time bridge to actual IoT devices |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Framer Motion, Tailwind CSS
- **Voice**: Web Speech API (STT) + Web Speech Synthesis API (TTS)
- **AI Understanding**: Google Gemini 1.5 Flash (fast, low-latency)
- **Real-Time**: MQTT.js (device state) + Socket.io (dashboard updates)
- **Simulation**: Custom device state machine (for demo mode)
- **Charts**: Recharts (energy monitoring)
- **Integration**: Home Assistant REST API / Tuya Open API
- **Deployment**: Vercel (frontend) + Raspberry Pi (MQTT broker)

---

## 🔧 Key Functions

### `parseVoiceCommand(transcript: string): Promise<DeviceCommand>`
Sends natural language voice transcript to Gemini Flash for intent extraction. Returns structured command with device(s) affected, action type, parameters, and confirmation message.

### `executeCommand(command: DeviceCommand): Promise<CommandResult>`
Routes parsed command to the appropriate device controller. Updates local state optimistically, sends MQTT message to physical device (if connected), and waits for device ACK within timeout.

### `activateScene(sceneName: string): Promise<void>`
Looks up the scene definition (device states + transitions), then executes all device commands in parallel with configurable transition timing (e.g., lights dim over 2 seconds for Movie Night).

### `analyzeEnergyPatterns(history: EnergyLog[]): Promise<EnergyInsight[]>`
Sends 30-day energy consumption data to Gemini. Returns usage pattern insights, anomaly flags (unusual consumption spikes), and specific automation suggestions to reduce electricity bills.

### `buildAutomationRule(trigger: Trigger, conditions: Condition[], actions: Action[]): Rule`
Creates a structured IF/THEN automation rule with optional AND conditions, time windows, and delay actions. Rules are persisted and evaluated on every device state change.

---

## 📁 File Structure

```
smart-home-dashboard/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── energy/page.tsx       # Energy monitoring
│   ├── automations/page.tsx  # Rule builder
│   ├── security/page.tsx     # Cameras + locks
│   └── api/
│       ├── command/route.ts  # AI command parsing
│       └── energy/route.ts   # AI energy analysis
├── components/
│   ├── VoiceButton.tsx       # Microphone + waveform
│   ├── DeviceGrid.tsx        # Room-by-room device grid
│   ├── DeviceCard.tsx        # Individual device control
│   ├── SceneBar.tsx          # Scene activation bar
│   ├── EnergyChart.tsx       # Power consumption chart
│   └── AutomationBuilder.tsx # Rule editor UI
└── lib/
    ├── speech.ts             # Web Speech API wrapper
    ├── mqtt.ts               # MQTT.js client
    ├── device-state.ts       # Device state machine
    └── gemini-fast.ts
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are a smart home AI assistant. Parse the user's voice command and return 
the exact device control action(s) needed.

Available devices: {deviceList}
Current state: {currentState}

Rules:
- Handle ambiguous references ("the light" = living room if user is there)
- Support multi-device commands ("turn off all lights")  
- Handle relative changes ("dim the lights a bit" = reduce by 20%)
- Always include a natural language confirmation message

Output JSON only:
{
  "actions": [
    {
      "deviceId": "living-room-light",
      "deviceName": "Living Room Light",
      "action": "SET_BRIGHTNESS",
      "value": 40,
      "unit": "percent"
    }
  ],
  "confirmation": "Natural spoken confirmation message",
  "clarificationNeeded": null
}

VOICE COMMAND: {transcript}
```

---

## 📤 Expected Output (Result)

```
Voice Input: "Hey, set the mood for movie night and make sure the front door is locked"
```

```json
{
  "actions": [
    { "deviceId": "living-room-light", "action": "SET_BRIGHTNESS", "value": 15, "unit": "percent" },
    { "deviceId": "living-room-light", "action": "SET_COLOR", "value": "#ff6b35" },
    { "deviceId": "tv-backlight", "action": "TURN_ON", "value": true },
    { "deviceId": "bedroom-light", "action": "TURN_OFF", "value": false },
    { "deviceId": "front-door-lock", "action": "LOCK", "value": true },
    { "deviceId": "soundbar", "action": "SET_VOLUME", "value": 45, "unit": "percent" }
  ],
  "confirmation": "Movie night mode activated! Lights are dimmed warm, TV backlight is on, and your front door is locked. Enjoy the movie!",
  "clarificationNeeded": null
}
```

**UI Display:**
```
🏠 Smart Home Dashboard

🎤 [Listening...] "Set the mood for movie night..."

✅ Command Executed — 6 devices updated

Living Room:
  💡 Light    ████░░░░░░  15%  🟠 Warm
  📺 TV Light  ●  ON

Security:
  🔒 Front Door  LOCKED ✅

🗣️ AI: "Movie night mode activated! Front door is locked. Enjoy!"

[Scenes: 🎬 Movie | 😴 Sleep | 🏃 Away | ☀️ Morning]
```

---

## 🚀 Stretch Goals

- [ ] Wake word detection ("Hey Home") using TensorFlow.js
- [ ] Visitor detection via camera with facial recognition
- [ ] Integration with Google Home and Amazon Alexa
- [ ] Predictive automation based on weekly patterns
