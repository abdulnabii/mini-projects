import { LegalAnalysis, DocType, SupportedLanguage, DangerousClause, MissingClause, SectionAnalysis, RiskVerdict } from '@/types';

export function analyzeDocumentWithHeuristics(
  text: string,
  docType: DocType,
  docTitle: string,
  language: SupportedLanguage = 'English'
): LegalAnalysis {
  const lower = text.toLowerCase();
  const dangerousClauses: DangerousClause[] = [];
  const missingClauses: MissingClause[] = [];
  const sections: SectionAnalysis[] = [];
  let riskScore = 20; // baseline

  // 1. Check IP Assignment
  if (
    lower.includes('assign') &&
    (lower.includes('invention') || lower.includes('intellectual property') || lower.includes('all rights') || lower.includes('work made for hire'))
  ) {
    const isBroad = lower.includes('whether or not') || lower.includes('at any time') || lower.includes('solely or jointly') || lower.includes('unconditionally');
    if (isBroad) {
      riskScore += 25;
      dangerousClauses.push({
        id: 'dc_ip_' + Date.now(),
        severity: 'SEVERE',
        category: 'Intellectual Property',
        title: 'Overly Broad Intellectual Property Grab',
        exactText: extractSentenceContaining(text, ['assign', 'invention', 'whether or not', 'all rights']) || 'Employee assigns all worldwide right, title, and interest in inventions conceived at any time...',
        plainEnglish: 'The company claims ownership of everything you create, potentially including unrelated personal projects built on personal time with your own equipment.',
        counterProposal: 'Replace with: "Employee assigns inventions conceived during working hours, using Company resources, and directly relating to the Company\'s existing products."',
        legalImplication: 'Loss of rights to personal side projects, pre-existing open-source codebases, or future entrepreneurial ventures.',
      });
    } else {
      riskScore += 10;
    }
  }

  // 2. Check Non-Compete
  if (lower.includes('non-compete') || lower.includes('not compete') || lower.includes('competing enterprise') || lower.includes('similar business')) {
    const isLongDuration = lower.includes('24 month') || lower.includes('two year') || lower.includes('36 month') || lower.includes('three year') || lower.includes('globally') || lower.includes('worldwide');
    riskScore += isLongDuration ? 25 : 15;
    dangerousClauses.push({
      id: 'dc_nc_' + Date.now(),
      severity: isLongDuration ? 'SEVERE' : 'MODERATE',
      category: 'Non-Compete',
      title: isLongDuration ? 'Restrictive Extended Non-Compete Covenant' : 'Post-Termination Non-Compete Restriction',
      exactText: extractSentenceContaining(text, ['non-compete', 'compete', '24', 'months', 'similar']) || 'Shall not engage in, consult for, or be employed by any competing business...',
      plainEnglish: 'Restricts your ability to work in your industry or field after leaving this engagement.',
      counterProposal: 'Limit restriction to direct competitors only, reduce duration to 6 months maximum, and specify a reasonable geographic radius (e.g. 50 miles).',
      legalImplication: 'May severely limit employment mobility and career progression upon departure.',
    });
  }

  // 3. Check Indemnification & Personal Liability
  if (lower.includes('indemnif') || lower.includes('hold harmless') || lower.includes('defend and hold')) {
    const isUnilateral = !lower.includes('mutual indemnif') && (lower.includes('employee shall') || lower.includes('contractor shall') || lower.includes('tenant shall'));
    if (isUnilateral) {
      riskScore += 20;
      dangerousClauses.push({
        id: 'dc_ind_' + Date.now(),
        severity: 'SEVERE',
        category: 'Indemnification & Liability',
        title: 'Unilateral Indemnification & Liability Shift',
        exactText: extractSentenceContaining(text, ['indemnify', 'hold harmless', 'defend']) || 'Agrees to defend, indemnify, and hold harmless from and against any third-party claims or damages...',
        plainEnglish: 'You are agreeing to pay for legal defense costs and damages if a third party sues the company, shifting enterprise risk onto you individually.',
        counterProposal: 'Make indemnification mutual, strike out individual liability, and cap aggregate damages to the actual fees paid under this agreement.',
        legalImplication: 'Exposes personal financial assets to corporate lawsuits.',
      });
    }
  }

  // 4. Check Termination & Notice
  if (lower.includes('terminat') || lower.includes('at-will') || lower.includes('without cause')) {
    const hasZeroNotice = lower.includes('immediately') || lower.includes('without notice') || lower.includes('without advance');
    if (hasZeroNotice) {
      riskScore += 15;
      missingClauses.push({
        id: 'mc_notice_' + Date.now(),
        clause: 'Standard Advance Written Notice Period',
        risk: 'Engagement can be terminated instantaneously without severance or preparation window.',
        standardRecommendation: 'Require a minimum 14 to 30 days written notice prior to termination without cause.',
        importance: 'CRITICAL',
      });
    }
  } else {
    missingClauses.push({
      id: 'mc_term_' + Date.now(),
      clause: 'Clear Termination and Cure Period Clause',
      risk: 'No explicit exit mechanism or remediation period defined for contract breaches.',
      standardRecommendation: 'Add standard 30-day written notice and 15-day cure period for non-material breaches.',
      importance: 'IMPORTANT',
    });
  }

  // 5. Check Payment Terms (for MSA / Freelance)
  if (lower.includes('net 60') || lower.includes('net 90') || lower.includes('net-60') || lower.includes('net-90') || lower.includes('sole discretion')) {
    riskScore += 15;
    dangerousClauses.push({
      id: 'dc_pay_' + Date.now(),
      severity: 'MODERATE',
      category: 'Payment Terms',
      title: 'Extended Payment Delay (Net-60 / Net-90)',
      exactText: extractSentenceContaining(text, ['net 60', 'net 90', 'net-60', 'net-90', 'invoices', 'payment']) || 'Invoices payable within 90 days of client acceptance...',
      plainEnglish: 'You will have to wait 2 to 3 months to receive compensation for delivered work.',
      counterProposal: 'Negotiate to Net-15 or Net-30 terms with an explicit 1.5% monthly late payment fee on overdue balances.',
      legalImplication: 'High risk of cash flow strain and unpaid contractor receivables.',
    });
  }

  // 6. Check Missing Protections
  if (!lower.includes('force majeure')) {
    missingClauses.push({
      id: 'mc_fm_' + Date.now(),
      clause: 'Force Majeure Protection',
      risk: 'Unforeseen natural disasters, infrastructure failures, or government acts could put you in default.',
      standardRecommendation: 'Add standard force majeure clause excusing performance delays caused by events beyond reasonable control.',
      importance: 'RECOMMENDED',
    });
  }

  if (!lower.includes('limitation of liability') && !lower.includes('liability cap')) {
    missingClauses.push({
      id: 'mc_cap_' + Date.now(),
      clause: 'Limitation of Liability Cap',
      risk: 'Unlimited damages exposure in the event of contractual dispute.',
      standardRecommendation: 'Cap total aggregate liability of either party to the contract value or insurance limits.',
      importance: 'IMPORTANT',
    });
  }

  // 7. Extract Sections dynamically
  const rawSections = text.split(/(?=\n\s*(?:SECTION|\d+\.|\bARTICLE\b|[A-Z\s]{4,}:))/i).filter((s) => s.trim().length > 20);
  if (rawSections.length > 0) {
    rawSections.slice(0, 8).forEach((sec, idx) => {
      const lines = sec.trim().split('\n');
      const title = lines[0].slice(0, 60).replace(/^[#*\s]+/, '').trim() || `Section ${idx + 1}`;
      const isSecRisky = sec.toLowerCase().includes('indemnif') || sec.toLowerCase().includes('non-compete') || sec.toLowerCase().includes('assign all');
      sections.push({
        id: `sec_dyn_${idx + 1}`,
        title,
        plainEnglish: `Governs ${title.toLowerCase()}. Outlines the respective rights, obligations, and standards between the parties.`,
        riskLevel: isSecRisky ? 'HIGH' : idx % 2 === 0 ? 'LOW' : 'MEDIUM',
        keyTakeaway: isSecRisky ? 'Contains critical terms requiring negotiation.' : 'Standard operational terms.',
      });
    });
  } else {
    sections.push(
      {
        id: 'sec_1',
        title: 'Core Operative Terms',
        plainEnglish: 'Sets the foundational terms, scope, and deliverables agreed upon by both parties.',
        riskLevel: 'LOW',
        keyTakeaway: 'Standard operating baseline.',
      },
      {
        id: 'sec_2',
        title: 'Rights & Obligations',
        plainEnglish: 'Defines the legal responsibilities, intellectual property rights, and covenants.',
        riskLevel: dangerousClauses.length > 0 ? 'HIGH' : 'MEDIUM',
        keyTakeaway: 'Review flagged clauses in this section.',
      }
    );
  }

  // Cap risk score between 10 and 95
  const finalScore = Math.min(95, Math.max(10, riskScore));

  let riskVerdict: RiskVerdict = 'SAFE — Standard Balanced Terms';
  if (finalScore >= 75) {
    riskVerdict = 'CRITICAL RISK — Severely One-Sided / Do Not Sign';
  } else if (finalScore >= 60) {
    riskVerdict = 'HIGH RISK — Negotiate Before Signing';
  } else if (finalScore >= 35) {
    riskVerdict = 'MODERATE RISK — Minor Adjustments Advised';
  }

  return {
    id: 'analysis_' + Date.now(),
    docTitle: docTitle || `${docType} Review`,
    docType,
    language,
    createdAt: new Date().toISOString(),
    riskScore: finalScore,
    riskVerdict,
    executiveSummary: `This ${docType} has been analyzed. It contains ${dangerousClauses.length} flagged risk clause(s) and ${missingClauses.length} missing standard protection(s). ${
      finalScore > 60
        ? 'Several terms are one-sided and should be negotiated prior to execution.'
        : 'The document is relatively standard with minor advisory adjustments.'
    }`,
    overallPros: [
      'Document structure contains identifiable operational sections',
      'Defines governing relationship and scope of engagement',
    ],
    overallCons: dangerousClauses.map((dc) => dc.title).slice(0, 4),
    dangerousClauses,
    missingClauses,
    sections,
    rawText: text,
  };
}

function extractSentenceContaining(text: string, keywords: string[]): string {
  const paragraphs = text.split('\n').filter((p) => p.trim().length > 0);
  for (const para of paragraphs) {
    const paraLower = para.toLowerCase();
    if (keywords.some((k) => paraLower.includes(k))) {
      return para.trim().slice(0, 300);
    }
  }
  return '';
}
