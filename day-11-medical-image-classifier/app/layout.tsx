import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'MedVision.AI — Medical Image Classifier & GradCAM Heatmap Overlay',
  description: 'Browser-native AI diagnostic education tool. Classify chest X-rays (Pneumonia) and skin lesions (Melanoma) with GradCAM activation heatmaps.',
  keywords: ['medical AI classifier', 'GradCAM heatmap', 'radiology AI simulator', 'chest X-ray pneumonia classifier', 'dermatology melanoma AI'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'MedVision.AI — Medical Image Classifier & GradCAM Heatmap Overlay',
    description: 'Classify chest X-rays and skin lesions with client-side inference and GradCAM explainability colormaps.',
    url: 'https://day-11-medical-image-classifier.vercel.app',
    siteName: 'MedVision AI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetBrainsMono.variable} ${outfit.variable} bg-[#080c14] text-slate-200 min-h-screen flex flex-col font-sans antialiased selection:bg-cyan-500/30 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
