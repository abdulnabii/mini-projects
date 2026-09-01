'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, Utensils, Heart, ShieldCheck, Flame, Apple } from 'lucide-react';

const NUTRITION_AEO_FAQS = [
  {
    q: 'What is NutriGenius.AI and how does AI meal photo recognition work?',
    a: 'NutriGenius.AI is a precision metabolic nutrition platform powered by Google Gemini 1.5 Vision. Users upload or photograph any meal, and the multimodal vision AI segments the plate, identifies individual ingredients, estimates portion weights in grams, and computes complete macronutrient (calories, protein, carbs, fats) and micronutrient breakdowns in real time.',
  },
  {
    q: 'How accurate are the AI calorie and macronutrient estimates?',
    a: 'NutriGenius.AI uses high-density visual density estimation and nutritional composition databases (USDA FoodData Central, Open Food Facts) combined with contextual recipe synthesis to achieve an estimated 92-96% accuracy on standard whole foods, home-cooked dishes, and packaged items.',
  },
  {
    q: 'What dietary preferences and health goals are supported?',
    a: 'The platform generates custom 7-day meal plans and smart grocery lists across various dietary regimens including High-Protein Hypertrophy, Ketogenic, Plant-Based Vegan, Halal, Mediterranean Longevity, Diabetic Glycemic Management, and Gluten-Free protocols.',
  },
  {
    q: 'How does the Micronutrient & Longevity Radar calculate daily RDA requirements?',
    a: 'The radar tracks cumulative daily intake of critical micronutrients—such as Vitamin D, Iron, Zinc, Calcium, Potassium, Magnesium, and Omega-3 fatty acids—benchmarked against scientific Recommended Daily Allowance (RDA) thresholds for optimal metabolic health and cellular longevity.',
  },
];

export default function AEOFAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section aria-labelledby="nutrition-aeo-heading" className="space-y-6 pt-6 font-mono text-xs text-slate-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="nutrition-aeo-heading" className="font-bold text-white text-base font-outfit">
              AI Nutrition &amp; Metabolic Intelligence Knowledge Hub
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Direct technical answer blocks indexed by ChatGPT, Perplexity, and Google AI Overviews
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
          100% AEO Structured Knowledge Feed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {NUTRITION_AEO_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <article
              key={idx}
              className="p-5 rounded-2xl bg-[#0d1117] border border-emerald-500/20 hover:border-emerald-500/50 transition-all space-y-2.5 cursor-pointer shadow-lg"
              onClick={() => toggle(idx)}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-white text-xs font-outfit leading-snug">
                  {faq.q}
                </h3>
                <ChevronDown
                  className={`w-4 h-4 text-emerald-400 shrink-0 transition-transform ${
                    isOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </div>

              <p className="text-slate-400 text-xs leading-relaxed font-sans">
                {faq.a}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
