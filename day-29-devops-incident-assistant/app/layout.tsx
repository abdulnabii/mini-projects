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
  title: "OpsPulse.AI — AI DevOps Incident Response & SRE Triage",
  description:
    "Intelligent SRE incident response command center. Real-time log triage, Gemini 1.5 root cause analysis, deployment correlation radar, and automated post-mortems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#060e14] text-slate-100 min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
