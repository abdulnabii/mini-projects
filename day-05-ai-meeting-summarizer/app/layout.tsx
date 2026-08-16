import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "MeetingMind.AI — AI-Powered Meeting Intelligence & Action Plan Extractor",
  description: "Transform raw audio transcripts into executive intelligence dossiers: speaker participation analytics, key decisions, assignable action items, and AI Q&A assistant.",
  authors: [{ name: "Abdul Nabi", url: "https://github.com/abdulnabii" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} ${outfit.variable} font-sans min-h-screen flex flex-col antialiased bg-[#080c14] text-slate-300 selection:bg-purple-500/30 selection:text-white`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
