import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaSForge.AI — Full-Stack AI SaaS Boilerplate & Starter Kit",
  description:
    "Production-ready multi-tenant AI SaaS starter kit with Stripe billing, Gemini 1.5 Flash token metering, Upstash Redis rate limits, and executive SRE admin telemetry. Built by Abdul Nabi (Day 30/30).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#06090e] text-slate-100 min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
