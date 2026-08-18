'use client';

import { useState } from 'react';
import { SEOAuditResult } from '@/types';
import { SAMPLE_ARTICLES } from '@/lib/sampleArticles';
import { runFullSEOAudit } from '@/lib/seoEngine';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleInput from '@/components/ArticleInput';
import SEOScoreOverview from '@/components/SEOScoreOverview';
import ReadabilityCard from '@/components/ReadabilityCard';
import KeywordDensityCard from '@/components/KeywordDensityCard';
import SERPPreviewCard from '@/components/SERPPreviewCard';
import HeadingTreeCard from '@/components/HeadingTreeCard';
import ActionPlanCard from '@/components/ActionPlanCard';
import AISectionRewriter from '@/components/AISectionRewriter';
import FAQSchemaGenerator from '@/components/FAQSchemaGenerator';
import { Sparkles, Search, CheckCircle2, ArrowDown, RotateCcw } from 'lucide-react';

export default function HomePage() {
  const [currentTitle, setCurrentTitle] = useState(SAMPLE_ARTICLES[0].title);
  const [currentTargetKeyword, setCurrentTargetKeyword] = useState(SAMPLE_ARTICLES[0].targetKeyword);
  const [currentContent, setCurrentContent] = useState(SAMPLE_ARTICLES[0].content);

  const [auditResult, setAuditResult] = useState<SEOAuditResult | null>(() =>
    runFullSEOAudit(
      SAMPLE_ARTICLES[0].content,
      SAMPLE_ARTICLES[0].targetKeyword,
      SAMPLE_ARTICLES[0].title,
      SAMPLE_ARTICLES[0].metaDescription,
      SAMPLE_ARTICLES[0].secondaryKeywords
    )
  );

  const [isLoadingAudit, setIsLoadingAudit] = useState<boolean>(false);
  const [isRewriting, setIsRewriting] = useState<boolean>(false);

  const handleRunAudit = async (
    title: string,
    targetKeyword: string,
    metaDescription: string,
    content: string,
    secondaryKeywords: string[]
  ) => {
    setCurrentTitle(title);
    setCurrentTargetKeyword(targetKeyword);
    setCurrentContent(content);
    setIsLoadingAudit(true);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, targetKeyword, metaDescription, content, secondaryKeywords }),
      });

      const data: SEOAuditResult = await res.json();
      setAuditResult(data);
    } catch (err) {
      console.error('Audit failed, running client fallback:', err);
      const fallback = runFullSEOAudit(content, targetKeyword, title, metaDescription, secondaryKeywords);
      setAuditResult(fallback);
    } finally {
      setIsLoadingAudit(false);
    }
  };

  const handleRewrite = async (paragraph: string, targetKeyword: string) => {
    setIsRewriting(true);
    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paragraph, targetKeyword }),
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Rewrite API failed:', err);
      throw err;
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-200">
      <Navbar />

      <main className="flex-1 space-y-10 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Hero Header */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI CONTENT AUDIT &amp; SERP INTELLIGENCE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-outfit">
            Transform Blog Content into <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 bg-clip-text text-transparent">
              Top-Ranking Search Assets
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
            Run comprehensive 8-point SEO health checks: keyword density, Flesch-Kincaid readability, SERP snippets, heading hierarchy, instant AI paragraph rewrites, and Position 0 FAQ Schema generator.
          </p>
        </section>

        {/* Input Workbench */}
        <section className="rounded-3xl bg-[#0e1424] border border-emerald-500/30 p-6 sm:p-8 shadow-2xl shadow-emerald-500/10">
          <ArticleInput onRunAudit={handleRunAudit} isLoading={isLoadingAudit} />
        </section>

        {/* Audit Results Section */}
        {auditResult && (
          <section id="results-dashboard" className="space-y-8 animate-in fade-in duration-500">
            {/* Scorecard Overview & GSC Predictor */}
            <SEOScoreOverview result={auditResult} />

            {/* Readability & Keyword Density Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ReadabilityCard readability={auditResult.readability} />
              <KeywordDensityCard keywordDensity={auditResult.keywordDensity} />
            </div>

            {/* SERP Snippet Simulator & Heading Structure Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SERPPreviewCard meta={auditResult.metaAudit} />
              <HeadingTreeCard structure={auditResult.headingStructure} />
            </div>

            {/* AI Section Rewriter */}
            <AISectionRewriter
              paragraphs={auditResult.rawParagraphs}
              targetKeyword={auditResult.targetKeyword}
              onRewrite={handleRewrite}
              isLoading={isRewriting}
            />

            {/* Position 0 FAQ Schema Studio */}
            <FAQSchemaGenerator
              title={currentTitle}
              targetKeyword={currentTargetKeyword}
              content={currentContent}
            />

            {/* Prioritized SEO Action Plan */}
            <ActionPlanCard actionPlan={auditResult.actionPlan} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
