import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'OmniData.3D — 3D Interactive Data Visualization & Spatial Intelligence Engine',
  description:
    'Turn CSV and complex datasets into interactive 3D WebGL Earth globes, force-directed network graphs, animated 3D isometric bar matrices, and particle scatter plots with Gemini 1.5 Flash spatial narrative insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://day-28-3d-data-visualization.vercel.app/#webapp",
      "name": "OmniData.3D",
      "url": "https://day-28-3d-data-visualization.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "WebGL-accelerated Three.js 3D data visualization studio rendering multi-dimensional scatter plots, volumetric bar graphs, animated surface topographies, and spatial data analytics.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://day-28-3d-data-visualization.vercel.app/#website",
      "url": "https://day-28-3d-data-visualization.vercel.app",
      "name": "OmniData.3D",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-28-3d-data-visualization.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does OmniData.3D handle high-volume data rendering?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "OmniData.3D utilizes WebGL hardware GPU acceleration with Three.js instanced meshes to render 50,000+ data points smoothly at 60 FPS."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen flex flex-col bg-[#060e14] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200`}
      >
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
