'use client';

import { useState } from 'react';
import { ClassificationResult, ModelType, SampleMedicalImage } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DisclaimerModal from '@/components/DisclaimerModal';
import ImageUploader from '@/components/ImageUploader';
import GradCAMCanvas from '@/components/GradCAMCanvas';
import ClassifierView from '@/components/ClassifierView';
import RadiologyConsultantChat from '@/components/RadiologyConsultantChat';
import ModelCard from '@/components/ModelCard';
import { Activity, Sparkles, ShieldAlert, Layers, ArrowRight, RotateCcw } from 'lucide-react';

export default function HomePage() {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(true);
  const [modelType, setModelType] = useState<ModelType>('xray');
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelectImage = async (imageSrc: string, sampleInfo?: SampleMedicalImage) => {
    setSelectedImageSrc(imageSrc);
    setIsLoading(true);

    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageSrc,
          modelType: sampleInfo ? sampleInfo.modelType : modelType,
          sampleId: sampleInfo?.id,
        }),
      });

      const data: ClassificationResult = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Error classifying medical image:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-200">
      {/* Disclaimer Modal */}
      <DisclaimerModal isOpen={isDisclaimerOpen} onAccept={() => setIsDisclaimerOpen(false)} />

      <Navbar onOpenDisclaimer={() => setIsDisclaimerOpen(true)} />

      <main className="flex-1 space-y-10 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full font-mono text-xs text-slate-300">
        {/* Hero Header */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXPLAINABLE AI DIAGNOSTIC SIMULATOR</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-outfit">
            Client-Side AI Radiology &amp; <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
              GradCAM Heatmap Explainability
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
            Classify Chest X-Rays (Pneumonia) and Dermatology Lesions (Melanoma) with real-time gradient activation colormaps showing neural network visual attention.
          </p>
        </section>

        {/* Workflow Section 1: Uploader */}
        <section className="rounded-3xl bg-[#090d16] border border-cyan-500/20 p-6 sm:p-8 shadow-2xl shadow-cyan-500/5">
          <ImageUploader
            modelType={modelType}
            onSelectModelType={(m) => {
              setModelType(m);
              setResult(null);
              setSelectedImageSrc(null);
            }}
            onSelectImage={handleSelectImage}
            isLoading={isLoading}
          />
        </section>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-3 font-mono text-xs text-slate-400">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="font-bold text-white text-sm font-outfit">Running WebGL Neural Inference &amp; GradCAM Backprop...</p>
            <p>Computing DenseNet-121 layer activation gradients...</p>
          </div>
        )}

        {/* Workflow Section 2: GradCAM & Results */}
        {result && selectedImageSrc && !isLoading && (
          <section className="space-y-8 animate-in fade-in duration-500">
            {/* GradCAM Canvas Overlay */}
            <GradCAMCanvas
              imageSrc={selectedImageSrc}
              heatmapGrid={result.heatmapGrid}
              modelType={result.modelType}
              predictedClass={result.predictedClass}
            />

            {/* Classification & Educational Annotation View */}
            <ClassifierView result={result} isLoadingAnnotation={false} />

            {/* AI Clinical Consultant Q&A Drawer */}
            <RadiologyConsultantChat result={result} />

            {/* Model Card Specifications */}
            <ModelCard modelType={result.modelType} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
