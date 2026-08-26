'use client';

import { useState, useEffect } from 'react';
import {
  AIUsageLog,
  AdminMetrics,
  Invoice,
  Organization,
  PlanTier,
  UserRole,
} from '@/types';
import {
  INITIAL_ADMIN_METRICS,
  INITIAL_INVOICES,
  INITIAL_ORGS,
  PLAN_CONFIGS,
} from '@/lib/sampleData';
import {
  getStoredActiveOrgId,
  getStoredInvoices,
  getStoredOrganizations,
  getStoredUsageLogs,
  saveActiveOrgId,
  saveInvoices,
  saveOrganizations,
  saveUsageLogs,
} from '@/lib/storage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroMarketing from '@/components/HeroMarketing';
import AIPlayground from '@/components/AIPlayground';
import BillingManager from '@/components/BillingManager';
import AdminDashboard from '@/components/AdminDashboard';
import FeatureFlagsPanel from '@/components/FeatureFlagsPanel';
import OrganizationModal from '@/components/OrganizationModal';
import DeveloperSetupModal from '@/components/DeveloperSetupModal';

export default function HomePage() {
  const [activeView, setActiveView] = useState<'landing' | 'playground' | 'billing' | 'admin' | 'flags'>(
    'landing'
  );

  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGS);
  const [activeOrgId, setActiveOrgId] = useState<string>(INITIAL_ORGS[0].id);
  const [usageLogs, setUsageLogs] = useState<AIUsageLog[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics>(INITIAL_ADMIN_METRICS);

  const [lastCreditDeduction, setLastCreditDeduction] = useState<{ amount: number; id: number } | null>(null);

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);

  // Initialize from LocalStorage with plan validation
  useEffect(() => {
    const savedOrgs = getStoredOrganizations();
    const savedActiveId = getStoredActiveOrgId();
    const savedLogs = getStoredUsageLogs();
    const savedInvs = getStoredInvoices();

    setOrganizations(savedOrgs);
    setActiveOrgId(savedActiveId);
    setUsageLogs(savedLogs);
    setInvoices(savedInvs);
  }, []);

  const activeOrg =
    organizations.find((o) => o.id === activeOrgId) || organizations[0] || INITIAL_ORGS[0];

  // Handle plan upgrade/change with strict quota capping
  const handleUpgradePlan = (targetPlan: PlanTier, billingCycle: 'monthly' | 'yearly') => {
    const planCfg = PLAN_CONFIGS.find((p) => p.id === targetPlan) || PLAN_CONFIGS[0];

    const updatedOrgs = organizations.map((org) => {
      if (org.id === activeOrg.id) {
        return {
          ...org,
          plan: targetPlan,
          billingCycle,
          creditsTotal: planCfg.creditsPerMonth,
          creditsRemaining: planCfg.creditsPerMonth,
        };
      }
      return org;
    });

    setOrganizations(updatedOrgs);
    saveOrganizations(updatedOrgs);

    // Add invoice if paid
    if (planCfg.monthlyPrice > 0) {
      const newInvoice: Invoice = {
        id: `inv_${Date.now()}`,
        number: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        amount: billingCycle === 'yearly' ? planCfg.yearlyPrice : planCfg.monthlyPrice,
        status: 'paid',
        planName: `${planCfg.name} (${billingCycle})`,
      };
      const updatedInvs = [newInvoice, ...invoices];
      setInvoices(updatedInvs);
      saveInvoices(updatedInvs);
    }
  };

  // Execute Metered AI Feature
  const handleExecuteAIFeature = async (
    feature: 'COPYWRITER' | 'CODE_GEN' | 'DATA_ANALYST',
    prompt: string
  ): Promise<string> => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature,
          prompt,
          plan: activeOrg.plan,
          creditsRemaining: activeOrg.creditsRemaining,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'AI generation failed');
      }

      const result = data.result;

      // Deduct credits with strict bounds checking
      const updatedOrgs = organizations.map((org) => {
        if (org.id === activeOrg.id) {
          const newRemaining = Math.max(0, org.creditsRemaining - result.creditsUsed);
          return {
            ...org,
            creditsRemaining: Math.min(org.creditsTotal, newRemaining),
          };
        }
        return org;
      });

      setOrganizations(updatedOrgs);
      saveOrganizations(updatedOrgs);

      // Trigger visual feedback flash on header and studio credit counter
      setLastCreditDeduction({
        amount: result.creditsUsed,
        id: Date.now(),
      });

      // Record usage log
      const newLog: AIUsageLog = {
        id: `log_${Date.now()}`,
        orgId: activeOrg.id,
        userId: 'user_abdul',
        feature,
        promptSnippet: prompt.slice(0, 45) + '...',
        creditsUsed: result.creditsUsed,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        latencyMs: result.latencyMs,
        timestamp: new Date().toISOString(),
      };

      const updatedLogs = [newLog, ...usageLogs];
      setUsageLogs(updatedLogs);
      saveUsageLogs(updatedLogs);

      // Update admin metrics
      setAdminMetrics((prev) => ({
        ...prev,
        totalAICallsToday: prev.totalAICallsToday + 1,
      }));

      return result.output;
    } catch (err: any) {
      console.error('Error executing AI feature:', err);
      return `❌ Rate Limit / Execution Notice: ${err.message}`;
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Create new organization with strict Free tier capping (50 credits)
  const handleCreateOrg = (name: string, slug: string) => {
    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name,
      slug,
      plan: 'free',
      billingCycle: 'monthly',
      creditsRemaining: 50,
      creditsTotal: 50,
      currentPeriodEnd: '2026-09-26T00:00:00Z',
      cancelAtPeriodEnd: false,
      members: [
        {
          id: `m-${Date.now()}`,
          userId: 'user_abdul',
          name: 'Abdul Nabi',
          email: 'abdul@hyperscalelabs.io',
          role: 'owner',
          joinedAt: new Date().toISOString(),
        },
      ],
    };

    const updated = [...organizations, newOrg];
    setOrganizations(updated);
    setActiveOrgId(newOrg.id);
    saveOrganizations(updated);
    saveActiveOrgId(newOrg.id);
  };

  // Add member to active organization
  const handleAddMember = (name: string, email: string, role: UserRole) => {
    const updated = organizations.map((org) => {
      if (org.id === activeOrg.id) {
        const newMember = {
          id: `m-${Date.now()}`,
          userId: `user_${Math.random().toString(36).substring(2, 7)}`,
          name,
          email,
          role,
          joinedAt: new Date().toISOString(),
        };
        return {
          ...org,
          members: [...org.members, newMember],
        };
      }
      return org;
    });

    setOrganizations(updated);
    saveOrganizations(updated);
  };

  return (
    <div className="flex flex-col min-h-screen font-mono">
      <Navbar
        activeOrg={activeOrg}
        onOpenOrgModal={() => setShowOrgModal(true)}
        activeView={activeView}
        onChangeView={setActiveView}
        onOpenDevModal={() => setShowDevModal(true)}
        lastDeduction={lastCreditDeduction}
      />

      <main className="flex-1 py-6 px-3 sm:px-6 max-w-7xl mx-auto w-full space-y-6">
        {activeView === 'landing' && (
          <HeroMarketing
            currentPlan={activeOrg.plan}
            onSelectPlan={(plan, cycle) => {
              handleUpgradePlan(plan, cycle);
              setActiveView('billing');
            }}
            onLaunchPlayground={() => setActiveView('playground')}
            onOpenDevModal={() => setShowDevModal(true)}
          />
        )}

        {activeView === 'playground' && (
          <AIPlayground
            activeOrg={activeOrg}
            usageLogs={usageLogs}
            onExecuteAIFeature={handleExecuteAIFeature}
            isGenerating={isGeneratingAI}
            onNavigateToBilling={() => setActiveView('billing')}
            lastDeduction={lastCreditDeduction}
          />
        )}

        {activeView === 'billing' && (
          <BillingManager
            activeOrg={activeOrg}
            invoices={invoices}
            onUpgradePlan={handleUpgradePlan}
          />
        )}

        {activeView === 'admin' && <AdminDashboard metrics={adminMetrics} />}

        {activeView === 'flags' && <FeatureFlagsPanel activeOrg={activeOrg} />}
      </main>

      <Footer />

      {/* Organization Switcher & Member Modal */}
      <OrganizationModal
        isOpen={showOrgModal}
        onClose={() => setShowOrgModal(false)}
        organizations={organizations}
        activeOrg={activeOrg}
        onSelectOrg={(org) => {
          setActiveOrgId(org.id);
          saveActiveOrgId(org.id);
        }}
        onCreateOrg={handleCreateOrg}
        onAddMember={handleAddMember}
      />

      {/* Developer CLI Setup.sh & Drizzle Schema Modal */}
      <DeveloperSetupModal
        isOpen={showDevModal}
        onClose={() => setShowDevModal(false)}
      />
    </div>
  );
}
