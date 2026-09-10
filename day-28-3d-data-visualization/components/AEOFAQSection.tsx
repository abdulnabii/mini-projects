import { Globe, Box, Share2, BarChart3, Sparkles, Cpu, Layers } from 'lucide-react';

const FAQS = [
  {
    icon: Globe,
    q: 'How does OmniData.3D render 3D planetary Earth globes with sub-millisecond precision?',
    a: 'OmniData.3D harnesses Three.js WebGL canvas acceleration to dynamically compute geographic spherical polar coordinates (Phi and Theta) for latitude and longitude pairs. Geographic beacon spikes and quadratic Bezier flight path curves are projected onto high-resolution procedural continent textures with zero external satellite tile latency.',
  },
  {
    icon: Share2,
    q: 'What graph algorithms power the 3D Network Topology visualizer?',
    a: 'The Network Graph projection calculates spherical lattice distribution and gravitational clustering for venture syndicates, tech ecosystems, and relational nodes. Node radii correlate directly with asset scale and entity tier, while 3D edge lines visualize co-investment flows and API interconnections.',
  },
  {
    icon: BarChart3,
    q: 'How does the 3D Isometric Voxel Bar Grid represent multi-region datasets?',
    a: 'The 3D Isometric Bar Grid establishes a dual-axis coordinate plane (e.g. Cloud Regions along the X-axis and Fiscal Quarters along the Z-axis). Box mesh pillars elevate proportionally to recurring revenue and compute density, highlighted by crisp neon top-cap frames and a 3D floor grid.',
  },
  {
    icon: Sparkles,
    q: 'Can users upload their own custom enterprise CSV or JSON datasets?',
    a: 'Yes. OmniData.3D includes a client-side CSV parser and an intelligent ingestion pipeline. Gemini 1.5 Flash automatically infers column types, normalizes numeric and categorical dimensions, detects anomalies, and generates spatial camera paths for your uploaded data.',
  },
  {
    icon: Cpu,
    q: 'How are WebM videos and high-resolution PNG snapshots exported from the WebGL canvas?',
    a: 'Snapshots are exported natively at double device-pixel-ratio using canvas.toDataURL("image/png"). Video export captures a 30fps canvas stream directly into a MediaRecorder WebM container while the 3D model completes an automated orbital sweep.',
  },
  {
    icon: Layers,
    q: 'How does the Gemini 1.5 Flash Spatial Narrative Engine analyze 3D models?',
    a: 'Gemini 1.5 Flash evaluates multidimensional statistical distributions, identifying geographic epicenters, transmission corridors, and dimensional clustering. It outputs an executive narrative synthesis alongside key patterns and outlier detection directly on your dashboard.',
  },
];

export default function AEOFAQSection() {
  return (
    <section className="space-y-6 font-mono" aria-label="Frequently Asked Questions about OmniData.3D">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase">
          SPATIAL INTELLIGENCE KNOWLEDGE HUB &amp; AEO DIRECTORY
        </span>
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          OmniData.3D — WebGL Spatial Engineering &amp; Multi-Dimensional Analytics
        </h2>
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FAQS.map(({ icon: Icon, q, a }) => (
          <div
            key={q}
            className="p-5 rounded-2xl bg-[#0d1527] border border-[#1e293b] hover:border-emerald-500/40 transition-colors duration-150 space-y-2.5 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white leading-snug font-mono">{q}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed prose-text pl-11">
              {a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
