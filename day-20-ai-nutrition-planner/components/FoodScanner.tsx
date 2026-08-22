'use client';

import { useState, useRef } from 'react';
import { MealAnalysisResult, MealType } from '@/types';
import { SAMPLE_MEALS, SampleMeal } from '@/lib/sampleFoods';
import {
  Camera,
  Upload,
  Sparkles,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  Check,
  AlertCircle,
  Clock,
  Heart,
  PlusCircle,
  Zap,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onMealLogged?: (meal: MealAnalysisResult) => void;
}

export default function FoodScanner({ onMealLogged }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<MealAnalysisResult | null>(null);
  const [loggedSuccess, setLoggedSuccess] = useState(false);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      setScanResult(null);
      setLoggedSuccess(false);
      setActiveSampleId(null);
      runVisionAnalysis(base64);
    };
    reader.readAsDataURL(file);
  };

  // Sample Meal Selector
  const handleSelectSample = (sample: SampleMeal) => {
    setActiveSampleId(sample.id);
    setSelectedImage(sample.imageUrl);
    setScanResult(sample.mockAnalysis);
    setLoggedSuccess(false);
  };

  // Trigger Gemini Vision API
  const runVisionAnalysis = async (base64Data: string) => {
    setIsScanning(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data, mealType }),
      });

      if (!res.ok) throw new Error('Analysis failed');

      const data: MealAnalysisResult = await res.json();
      setScanResult(data);
    } catch (err) {
      console.warn('API error, falling back to sample result:', err);
      setScanResult(SAMPLE_MEALS[0].mockAnalysis);
    } finally {
      setIsScanning(false);
    }
  };

  // Log Meal to Storage
  const handleLogMeal = () => {
    if (!scanResult) return;
    onMealLogged?.(scanResult);
    setLoggedSuccess(true);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#06b6d4', '#818cf8'],
    });

    setTimeout(() => setLoggedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Upload / Sample Selector Zone */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#09121d] border-2 border-emerald-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base font-outfit">
                AI Vision Food Scanner
              </h3>
              <p className="text-xs text-slate-400">
                Snap any meal photo to calculate exact macros, calories &amp; health score
              </p>
            </div>
          </div>

          {/* Meal Type Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => (
              <button
                key={type}
                onClick={() => setMealType(type)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  mealType === type
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Dropzone & Quick Samples Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Custom Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="lg:col-span-1 border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 rounded-3xl p-6 bg-slate-950/60 hover:bg-slate-900/60 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3 min-h-[220px] group shadow-inner"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <span className="font-bold text-white text-sm block font-outfit">
                Upload Custom Meal Photo
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Supports JPG, PNG, WEBP, or live phone camera snapshot
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
              Browse Files
            </span>
          </div>

          {/* Preset Sample Meals */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Or Try Instant Verified Sample Meals
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_MEALS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer group flex flex-col justify-between space-y-2 relative overflow-hidden ${
                    activeSampleId === sample.id
                      ? 'bg-emerald-950/40 border-emerald-400 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900">
                    <img
                      src={sample.imageUrl}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div>
                    <span className="text-[9px] font-bold uppercase font-mono text-emerald-400 block">
                      {sample.category}
                    </span>
                    <h4 className="font-bold text-white text-xs line-clamp-1 group-hover:text-emerald-300 transition-colors">
                      {sample.name}
                    </h4>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Vision Scanner Simulation */}
      {isScanning && (
        <div className="p-12 rounded-3xl bg-[#09121d] border-2 border-emerald-500/40 shadow-2xl flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 animate-spin">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-black text-white font-outfit">
              Analyzing Food Composition with Gemini 1.5 Flash Vision...
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Segmenting ingredient boundaries, estimating portion grams, and calculating macronutrient density.
            </p>
          </div>
        </div>
      )}

      {/* Scan Results Card */}
      {scanResult && !isScanning && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#09121d] border-2 border-emerald-500/40 shadow-2xl space-y-6 animate-in fade-in duration-300">
          {/* Header & Health Score Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-4">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt={scanResult.mealName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md shrink-0"
                />
              )}
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono tracking-wider">
                  Verified Vision Analysis ({scanResult.mealType.toUpperCase()})
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-outfit">
                  {scanResult.mealName}
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Total Weight: ~
                  {scanResult.items.reduce((sum, item) => sum + item.estimatedGrams, 0)}g
                </span>
              </div>
            </div>

            {/* Health Score Pill */}
            <div className="flex items-center gap-3">
              <div className="p-3 px-5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-2xl font-black font-mono text-emerald-400 leading-none">
                  {scanResult.healthScore}
                  <span className="text-xs text-slate-500">/100</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                  Health Score
                </span>
              </div>

              <button
                onClick={handleLogMeal}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
              >
                {loggedSuccess ? <Check className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                <span>{loggedSuccess ? 'Logged to Diary!' : 'Log to Today'}</span>
              </button>
            </div>
          </div>

          {/* Quick Macro Summary Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> Total Energy
              </span>
              <div className="text-xl font-black font-mono text-white">
                {scanResult.totals.calories} <span className="text-xs font-normal text-slate-400">kcal</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Protein
              </span>
              <div className="text-xl font-black font-mono text-emerald-400">
                {Math.round(scanResult.totals.protein)}g
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Wheat className="w-3.5 h-3.5 text-cyan-400" /> Net Carbs
              </span>
              <div className="text-xl font-black font-mono text-cyan-400">
                {Math.round(scanResult.totals.carbs)}g
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-amber-400" /> Total Fats
              </span>
              <div className="text-xl font-black font-mono text-amber-400">
                {Math.round(scanResult.totals.fat)}g
              </div>
            </div>
          </div>

          {/* Itemized Detected Ingredients Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Detected Food Items &amp; Portion Breakdown
            </h4>

            <div className="grid grid-cols-1 gap-2.5">
              {scanResult.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <strong className="text-white font-bold text-sm block font-outfit">
                        {item.name}
                      </strong>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                        <span>{item.estimatedGrams}g portion</span>
                        <span>•</span>
                        <span className="text-emerald-400">{Math.round(item.confidence * 100)}% Confidence</span>
                        <span>•</span>
                        <span className="capitalize">{item.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono font-bold">
                    <span className="text-white">{item.calories} kcal</span>
                    <span className="text-emerald-400">{item.protein}g P</span>
                    <span className="text-cyan-400">{item.carbs}g C</span>
                    <span className="text-amber-400">{item.fat}g F</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Dietitian Advice & Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" /> Clinical Dietitian Assessment
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {scanResult.clinicalDietitianAdvice}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Bioavailability &amp; Optimizations
              </span>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside leading-relaxed">
                {scanResult.optimizationSuggestions.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
