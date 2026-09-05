import { MessageSquare, Zap, Wifi, Shield, BarChart2, Bot } from 'lucide-react';

const FAQS = [
  {
    icon: Bot,
    q: 'How does AuraHome.AI understand natural language voice commands?',
    a: 'AuraHome.AI captures your spoken audio via the browser\'s Web Speech API and sends the raw transcript to Google Gemini 1.5 Flash. Gemini parses your intent — including multi-device instructions like "Set movie night mode and lock the front door" — and returns a structured JSON action list executed in under 400ms.',
  },
  {
    icon: Wifi,
    q: 'Can AuraHome.AI connect to real smart home hardware?',
    a: 'Yes. The Ecosystem Bridge settings panel is designed to integrate with physical hardware via MQTT over Zigbee 3.0 or Tuya\'s Open API. The platform ships with a simulated device state machine for instant demo use, and can be wired to a real Home Assistant broker or any WebSocket-capable IoT gateway for production deployments.',
  },
  {
    icon: Zap,
    q: 'How is real-time energy consumption calculated?',
    a: 'Each device card maintains a powerWatts value that dynamically updates with device state. The Energy Radar page aggregates the live watt draw across all active appliances, renders a 24-hour load profile chart, and invokes Gemini 1.5 Flash to generate three data-backed optimization tips with an estimated monthly USD savings figure.',
  },
  {
    icon: Shield,
    q: 'How do smart lock and security camera controls work?',
    a: 'The Security Panel displays live lock status (Securely Locked / Unlocked) for all registered deadbolts and shows camera feeds. You can toggle locks directly via the panel UI, the device card on the main dashboard, or with a voice command such as "Lock the front door and arm perimeter cameras."',
  },
  {
    icon: BarChart2,
    q: 'What are smart scenes and how do they help?',
    a: 'Smart scenes are one-click presets that simultaneously update multiple devices. AuraHome.AI ships with six: Movie Night, Sleep Sanctuary, Away / Lock Down, Morning Rise, Deep Focus Work, and Eco Saver. Each scene executes all device state changes in parallel — identical to activating a Home Assistant scene via its REST API.',
  },
  {
    icon: MessageSquare,
    q: 'How do IF/THEN automation rules differ from scenes?',
    a: 'Scenes are manually triggered. Automation rules fire automatically based on a trigger condition — a specific time (e.g., 11:00 PM nightly auto-lock), a real-time power draw threshold (e.g., dim lights when grid load exceeds 2,500W), or a temperature sensor crossing a setpoint. Rules are evaluated on every device state change and persist across sessions.',
  },
];

export default function AEOFAQSection() {
  return (
    <section className="space-y-6 font-mono" aria-label="Frequently Asked Questions about AuraHome.AI">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 uppercase">
          Knowledge Hub
        </span>
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          AuraHome.AI — Frequently Asked Questions
        </h2>
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FAQS.map(({ icon: Icon, q, a }) => (
          <div
            key={q}
            className="p-5 rounded-2xl bg-[#0d1117] border border-slate-800 hover:border-cyan-500/30 transition-colors space-y-2.5"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white leading-snug">{q}</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pl-11">{a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
