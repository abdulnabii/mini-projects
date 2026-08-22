import { LegalAnalysis, DocType } from '@/types';

export interface SampleContractPreset {
  id: string;
  title: string;
  docType: DocType;
  icon: string;
  category: string;
  riskPreview: string;
  rawText: string;
  analysis: LegalAnalysis;
}

export const SAMPLE_CONTRACTS: SampleContractPreset[] = [
  {
    id: 'contract_employment',
    title: 'Senior Software Engineer Employment Agreement',
    docType: 'Employment Agreement',
    icon: '📄',
    category: 'Employment & Tech',
    riskPreview: '76/100 • HIGH RISK',
    rawText: `EMPLOYMENT AND CONFIDENTIALITY AGREEMENT

This Employment Agreement ("Agreement") is entered into as of October 12, 2025, by and between Apex Systems Global Inc. ("Company") and Employee ("Employee").

1. POSITION AND DUTIES
Employee shall serve as Senior Software Engineer on an exclusive full-time basis, dedicating 100% of professional attention and efforts to the Company.

2. INTELLECTUAL PROPERTY ASSIGNMENT
Employee hereby unconditionally assigns to the Company all worldwide right, title, and interest in and to any and all inventions, designs, source code, patentable ideas, algorithms, and discoveries conceived, reduced to practice, or authored by Employee, solely or jointly with others, during the term of employment, whether or not conceived during regular business hours, whether or not conceived on Company premises, and whether or not relating to Company's current products or prospective exploratory business lines.

3. NON-COMPETE COVENANT
For a period of twenty-four (24) continuous months following the termination of employment for any reason (whether voluntary or involuntary), Employee shall not directly or indirectly engage in, advise, invest in, consult for, or be employed by any enterprise anywhere globally that operates in any software, SaaS, artificial intelligence, or technology business line similar to or competing with Company.

4. TERMINATION AND AT-WILL CLAUSE
The Company reserves the unilateral right to terminate Employee's employment at any time, immediately, without cause, and without any advance written notice or payment in lieu of notice. In such event, Employee shall only be entitled to earned base salary through the final day worked, waiving all claims to unvested options or severance.

5. INDEMNIFICATION BY EMPLOYEE
Employee agrees to defend, indemnify, and hold harmless the Company, its directors, and affiliates from and against any third-party claims, legal defense fees, damages, or liabilities arising from any bug, defect, or operational outage allegedly caused by code authored or committed by Employee.

6. GOVERNING LAW AND ARBITRATION
This Agreement shall be governed exclusively by the laws of the State of Delaware. Any dispute shall be resolved via mandatory binding individual arbitration in Wilmington, DE, with Employee waiving all rights to jury trial and class action participation.`,
    analysis: {
      id: 'analysis_employment',
      docTitle: 'Senior Software Engineer Employment Agreement',
      docType: 'Employment Agreement',
      language: 'English',
      createdAt: new Date().toISOString(),
      riskScore: 76,
      riskVerdict: 'HIGH RISK — Negotiate Before Signing',
      executiveSummary:
        'This agreement is heavily tilted in favor of the employer. It assigns every piece of intellectual property you ever create (even unrelated weekend personal projects) to the company, imposes an overly restrictive 2-year worldwide non-compete, and exposes you to personal financial liability for software bugs.',
      overallPros: [
        'Clear job title and scope of responsibilities',
        'Standard governing law and confidential information safeguards',
      ],
      overallCons: [
        'Overly broad IP assignment claiming personal weekend creations',
        'Worldwide 24-month non-compete likely restrictive and punitive',
        'Unilateral termination without notice or severance',
        'Employee indemnification for coding errors and bugs',
      ],
      dangerousClauses: [
        {
          id: 'dc_1',
          severity: 'SEVERE',
          category: 'Intellectual Property',
          title: 'All-Encompassing Weekend & Personal IP Ownership',
          exactText:
            'Employee unconditionally assigns all inventions conceived during the term of employment, whether or not during regular business hours, whether or not on Company premises, and whether or not relating to Company business.',
          plainEnglish:
            'The company claims ownership of everything you create — even open-source projects or apps you code at home on weekends with your own personal laptop, totally unrelated to your job.',
          counterProposal:
            'Replace with: "Employee assigns inventions conceived during working hours, using Company resources, and directly relating to the Company\'s existing products or demonstrably anticipated business lines."',
          legalImplication:
            'You could lose rights to side projects, pre-existing GitHub repos, or future startups conceived during your tenure.',
        },
        {
          id: 'dc_2',
          severity: 'SEVERE',
          category: 'Non-Compete',
          title: '24-Month Global Non-Compete Across All Software',
          exactText:
            'Employee shall not directly or indirectly engage in, consult for, or be employed by any enterprise globally operating in any software, SaaS, or technology business line for 24 continuous months.',
          plainEnglish:
            'You cannot work anywhere in tech or software for 2 full years after leaving, anywhere in the world.',
          counterProposal:
            'Limit to 6 months, restrict geographic scope to direct competitors within a 50-mile radius of your primary workplace, or strike out entirely.',
          legalImplication:
            'Restricts your constitutional right to earn a livelihood in your profession upon resignation or layoff.',
        },
        {
          id: 'dc_3',
          severity: 'SEVERE',
          category: 'Indemnification & Liability',
          title: 'Personal Liability for Software Outages and Bugs',
          exactText:
            'Employee agrees to defend, indemnify, and hold harmless the Company from any damages or legal fees arising from bugs or outages caused by code authored by Employee.',
          plainEnglish:
            'If your code contains a bug or causes downtime, the company can legally sue you personally to pay for the damages and lawyer fees.',
          counterProposal:
            'Strike out Section 5 entirely. Employees must be covered under standard corporate Errors & Omissions (E&O) insurance.',
          legalImplication:
            'Exposes your personal bank accounts and assets to corporate litigation risks.',
        },
      ],
      missingClauses: [
        {
          id: 'mc_1',
          clause: 'Standard Written Notice Period',
          risk: 'Company can fire you instantaneously with 0 days notice and zero severance pay.',
          standardRecommendation: 'Require minimum 30 days written notice or 30 days salary in lieu of notice.',
          importance: 'CRITICAL',
        },
        {
          id: 'mc_2',
          clause: 'Pre-Existing IP Carve-Out Exhibit',
          risk: 'Personal codebases or patents you developed prior to joining can be claimed by employer.',
          standardRecommendation: 'Attach Schedule A listing pre-existing personal inventions and open-source contributions.',
          importance: 'IMPORTANT',
        },
        {
          id: 'mc_3',
          clause: 'Employer Indemnification of Employee',
          risk: 'If a customer sues over the product, the employee is left without legal defense.',
          standardRecommendation: 'Add mutual indemnification protecting employee acting within the scope of duties.',
          importance: 'RECOMMENDED',
        },
      ],
      sections: [
        {
          id: 'sec_1',
          title: '1. Position and Duties',
          plainEnglish: 'Establishes full-time exclusive employment status with the company.',
          riskLevel: 'LOW',
          keyTakeaway: 'Standard employment scope.',
        },
        {
          id: 'sec_2',
          title: '2. Intellectual Property Assignment',
          plainEnglish: 'Transfers all rights to anything you build, even outside work hours.',
          riskLevel: 'HIGH',
          keyTakeaway: 'High risk — demands personal side-project ownership.',
        },
        {
          id: 'sec_3',
          title: '3. Non-Compete Covenant',
          plainEnglish: 'Bans you from working in the software industry globally for 2 years.',
          riskLevel: 'HIGH',
          keyTakeaway: 'Extremely restrictive covenant.',
        },
        {
          id: 'sec_4',
          title: '4. Termination and At-Will Clause',
          plainEnglish: 'Allows employer to fire you on the spot with zero severance notice.',
          riskLevel: 'MEDIUM',
          keyTakeaway: 'Lacks mutual notice protections.',
        },
        {
          id: 'sec_5',
          title: '5. Indemnification by Employee',
          plainEnglish: 'Makes you personally financially liable for software bugs.',
          riskLevel: 'HIGH',
          keyTakeaway: 'Dangerous shift of business risk to employee.',
        },
        {
          id: 'sec_6',
          title: '6. Governing Law & Arbitration',
          plainEnglish: 'Mandates individual arbitration in Delaware and waives jury trial rights.',
          riskLevel: 'LOW',
          keyTakeaway: 'Standard corporate arbitration clause.',
        },
      ],
      rawText: '',
    },
  },
  {
    id: 'contract_nda',
    title: 'Mutual Non-Disclosure Agreement (Standard M&A)',
    docType: 'Non-Disclosure Agreement (NDA)',
    icon: '🔒',
    category: 'Confidentiality',
    riskPreview: '18/100 • SAFE',
    rawText: `MUTUAL NON-DISCLOSURE AGREEMENT

1. PURPOSE
The parties wish to explore a potential business relationship ("Purpose") and will exchange certain proprietary and confidential information.

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" includes all non-public technical, financial, commercial, and operational information marked as proprietary or reasonably understood to be confidential.

3. EXCLUSIONS FROM CONFIDENTIALITY
Information is not confidential if it: (a) was publicly known prior to disclosure; (b) is received from a third party without breach of duty; (c) was independently developed without reference to disclosing party's information.

4. OBLIGATIONS OF RECEIVING PARTY
Receiving party agrees to use information solely for the Purpose and apply the same standard of reasonable care as used for its own confidential assets.

5. TERM AND DURATION
This Agreement shall remain in effect for two (2) years from the date of disclosure.

6. RETURN OR DESTRUCTION OF MATERIALS
Upon written request, receiving party shall promptly return or destroy all physical and digital copies of disclosed information.`,
    analysis: {
      id: 'analysis_nda',
      docTitle: 'Mutual Non-Disclosure Agreement (Standard M&A)',
      docType: 'Non-Disclosure Agreement (NDA)',
      language: 'English',
      createdAt: new Date().toISOString(),
      riskScore: 18,
      riskVerdict: 'SAFE — Standard Balanced Terms',
      executiveSummary:
        'This is a clean, well-balanced mutual NDA with mutual bilateral obligations, industry-standard exclusions, and a reasonable 2-year confidentiality sunset period. Safe to sign with minimal risk.',
      overallPros: [
        'Mutual bilateral protections protecting both parties equally',
        'Standard clear exclusions (public domain, independent development)',
        'Reasonable 2-year expiration term',
      ],
      overallCons: [
        'No specific exception for legally compelled court subpoena disclosures',
      ],
      dangerousClauses: [],
      missingClauses: [
        {
          id: 'mc_nda_1',
          clause: 'Compelled Disclosure / Subpoena Safe Harbor',
          risk: 'If a court orders you to produce records, you could technically breach the NDA without a subpoena carve-out.',
          standardRecommendation: 'Add: "Party may disclose information pursuant to valid judicial order provided prompt notice is given to discloser."',
          importance: 'RECOMMENDED',
        },
      ],
      sections: [
        {
          id: 'sec_nda_1',
          title: '1. Purpose & 2. Definitions',
          plainEnglish: 'Defines what counts as secret information and what business purpose it covers.',
          riskLevel: 'LOW',
          keyTakeaway: 'Standard clear scope.',
        },
        {
          id: 'sec_nda_2',
          title: '3. Exclusions & 4. Obligations',
          plainEnglish: 'Protects both parties equally from sharing publicly available data.',
          riskLevel: 'LOW',
          keyTakeaway: 'Well balanced mutual standard.',
        },
      ],
      rawText: '',
    },
  },
  {
    id: 'contract_freelance',
    title: 'Freelance Software Consultant Master Services Agreement',
    docType: 'Freelance / Master Services Agreement (MSA)',
    icon: '💼',
    category: 'Consulting & B2B',
    riskPreview: '72/100 • HIGH RISK',
    rawText: `MASTER SERVICES AGREEMENT (FREELANCE CONTRACTOR)

1. SERVICES AND DELIVERABLES
Contractor agrees to provide custom software development services in accordance with Statements of Work (SOW).

2. PAYMENT TERMS
Client shall pay approved invoices within ninety (90) business days of client acceptance (Net-90). Client reserves the right to withhold payment indefinitely if client determines deliverables are unsatisfactory in client's sole discretion.

3. WORK FOR HIRE AND IP
All deliverables are designated "Work Made for Hire". Full ownership transfers to Client immediately upon creation, regardless of whether Client has paid the contractor for the invoice.

4. UNLIMITED INDEMNITY BY CONTRACTOR
Contractor shall indemnify, defend, and hold Client harmless from any and all damages, claims, third-party software patent disputes, and consequential lost revenue arising from or related to deliverables provided.

5. TERMINATION AND KILL FEE
Client may terminate this Agreement at any time without reason. In the event of mid-project cancellation, Client shall not be liable for any kill fee, work-in-progress compensation, or unbilled hours.`,
    analysis: {
      id: 'analysis_freelance',
      docTitle: 'Freelance Software Consultant Master Services Agreement',
      docType: 'Freelance / Master Services Agreement (MSA)',
      language: 'English',
      createdAt: new Date().toISOString(),
      riskScore: 72,
      riskVerdict: 'HIGH RISK — Negotiate Before Signing',
      executiveSummary:
        'This contractor agreement contains severe cash flow and liability traps: Net-90 delayed payment with subjective withholding, immediate IP transfer before receiving payment, unlimited liability for client revenue loss, and zero kill fee on cancellation.',
      overallPros: [
        'Clear statement of work architecture for milestones',
      ],
      overallCons: [
        'Net-90 payment terms with unilateral subjective withholding',
        'IP transfers before full payment is cleared',
        'Unlimited contractor indemnification including consequential damages',
        'No kill fee or pay for work-in-progress on early cancellation',
      ],
      dangerousClauses: [
        {
          id: 'dc_fl_1',
          severity: 'SEVERE',
          category: 'Payment Terms',
          title: 'Net-90 Payment Delay & Unilateral Withholding',
          exactText:
            'Client shall pay approved invoices within 90 business days... and reserves the right to withhold payment indefinitely in client\'s sole discretion.',
          plainEnglish:
            'You may wait 4+ months for payment, and the client can choose not to pay you at all based on subjective opinion.',
          counterProposal:
            'Change to Net-15 or Net-30 with automatic late fee of 1.5% per month, and objective acceptance testing criteria (5-day cure window).',
          legalImplication:
            'High risk of contractor cash flow insolvency and unpaid labor.',
        },
        {
          id: 'dc_fl_2',
          severity: 'SEVERE',
          category: 'Intellectual Property',
          title: 'IP Ownership Transfers Prior to Payment',
          exactText:
            'Full ownership transfers to Client immediately upon creation, regardless of whether Client has paid the contractor.',
          plainEnglish:
            'The client owns your code the second you write it, even if they refuse to pay you a single penny for it.',
          counterProposal:
            'Amend to: "IP transfers to Client solely upon full and final payment of all corresponding invoice balances."',
          legalImplication:
            'You surrender all leverage to recover unpaid fees through copyright claims.',
        },
      ],
      missingClauses: [
        {
          id: 'mc_fl_1',
          clause: 'Kill Fee & Work-in-Progress Payment',
          risk: 'If client cancels project at 90% completion, contractor receives zero dollars.',
          standardRecommendation: 'Include: "Client pays prorated fee for all hours and milestones completed up to notice date plus 15% kill fee."',
          importance: 'CRITICAL',
        },
        {
          id: 'mc_fl_2',
          clause: 'Cap on Liability (Total Fees Paid)',
          risk: 'Client can sue contractor for millions in theoretical lost business revenue.',
          standardRecommendation: 'Cap contractor aggregate liability to the total fees actually paid under the SOW.',
          importance: 'CRITICAL',
        },
      ],
      sections: [
        {
          id: 'sec_fl_1',
          title: '1. Services & 2. Payment Terms',
          plainEnglish: 'Defines deliverables but imposes predatory 90-day payment delays.',
          riskLevel: 'HIGH',
          keyTakeaway: 'Requires immediate negotiation to Net-15/30.',
        },
        {
          id: 'sec_fl_2',
          title: '3. Work for Hire & 4. Indemnity',
          plainEnglish: 'Client takes your IP without paying and shifts business liability to you.',
          riskLevel: 'HIGH',
          keyTakeaway: 'Severe liability and ownership imbalance.',
        },
      ],
      rawText: '',
    },
  },
];
