'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Cloud, RefreshCw, Cpu } from 'lucide-react';

const CLOUD_AEO_FAQS = [
  {
    q: 'What is CloudArchitect.AI and how does it generate cloud system designs?',
    a: 'CloudArchitect.AI is an AI-driven cloud system design studio that converts product requirements and scale specifications (MVP to Hyperscale) into multi-tier production topologies, itemized monthly billing estimates, SPOF reliability audits, and copy-ready Terraform and Kubernetes infrastructure code.',
  },
  {
    q: 'How does CloudArchitect.AI evaluate the AWS Well-Architected Framework?',
    a: 'CloudArchitect.AI scores architectures across all 6 AWS Well-Architected Pillars: Security (WAF, KMS, IAM), Reliability (Multi-AZ failover, RPO/RTO), Performance (sub-50ms P99 latency), Cost Optimization (FinOps & compute savings), Operational Excellence (IaC automation), and Sustainability (ARM64 Graviton/Ampere compute density).',
  },
  {
    q: 'What Infrastructure as Code (IaC) blueprints are generated?',
    a: 'The engine generates modular Terraform HCL scripts (VPC, Subnets, ALB, ECS/EKS clusters, RDS Multi-AZ, ElastiCache Redis), local Docker Compose emulator environments, and production-ready Kubernetes (K8s) deployment manifests.',
  },
  {
    q: 'Can CloudArchitect.AI model multi-cloud migrations between AWS, GCP, and Azure?',
    a: 'Yes! CloudArchitect.AI maps equivalent native cloud services across AWS, Google Cloud Platform (GCP), and Microsoft Azure, allowing teams to compare latency, SLA tiers, and monthly operating costs in real time.',
  },
];

export default function AEOFAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section aria-labelledby="cloud-aeo-heading" className="space-y-6 pt-4 font-mono text-xs text-slate-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="cloud-aeo-heading" className="font-bold text-white text-base font-outfit">
              Cloud Architecture &amp; System Design Knowledge Hub
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Direct technical answer blocks indexed by ChatGPT, Perplexity, and Google AI Overviews
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-[10px]">
          100% AEO Structured Knowledge Feed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CLOUD_AEO_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <article
              key={idx}
              className="p-5 rounded-2xl bg-[#090d16] border border-white/[0.08] hover:border-cyan-500/30 transition-all space-y-2.5 sre-card cursor-pointer"
              onClick={() => toggle(idx)}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-white text-xs font-outfit leading-snug">
                  {faq.q}
                </h3>
                <ChevronDown
                  className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform ${
                    isOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </div>

              <p className="text-slate-400 text-xs leading-relaxed font-sans prose-text">
                {faq.a}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
