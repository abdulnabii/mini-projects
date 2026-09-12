'use client';

import { useState } from 'react';
import {
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Radio,
  Send,
  Code2,
  Terminal,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  environment: 'production' | 'development';
  status: 'active' | 'revoked';
}

interface WebhookEvent {
  id: string;
  event: string;
  timestamp: string;
  status: number;
  durationMs: number;
  payload: Record<string, any>;
}

export default function ApiKeysWebhooksPanel() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([
    {
      id: 'key-1',
      name: 'Production Worker Key',
      key: 'sf_live_mock_token_production_demo_key',
      created: '2026-08-15',
      lastUsed: 'Just now',
      environment: 'production',
      status: 'active',
    },
    {
      id: 'key-2',
      name: 'Staging CI/CD Pipeline',
      key: 'sf_test_mock_token_staging_demo_key',
      created: '2026-09-01',
      lastUsed: '2 hours ago',
      environment: 'development',
      status: 'active',
    },
  ]);

  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState<'production' | 'development'>('production');
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [activeSnippetTab, setActiveSnippetTab] = useState<'curl' | 'ts' | 'python'>('ts');

  // Webhook states
  const [webhookUrl, setWebhookUrl] = useState('https://api.yourdomain.com/webhooks/saasforge');
  const [webhookSecret] = useState('sec_webhook_mock_sign_token_sample');
  const [selectedEventType, setSelectedEventType] = useState('invoice.payment_succeeded');
  const [isSimulating, setIsSimulating] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const [webhookLogs, setWebhookLogs] = useState<WebhookEvent[]>([
    {
      id: 'wh_evt_01',
      event: 'customer.subscription.updated',
      timestamp: '10:42:15 AM',
      status: 200,
      durationMs: 42,
      payload: {
        id: 'sub_1Q0xyz987',
        object: 'subscription',
        status: 'active',
        plan: 'pro',
        credits_allocated: 10000,
        customer: 'cus_994821',
      },
    },
    {
      id: 'wh_evt_02',
      event: 'quota.credits_low',
      timestamp: '09:15:02 AM',
      status: 200,
      durationMs: 61,
      payload: {
        organization_id: 'org_main_01',
        remaining_credits: 45,
        threshold: 100,
        suggested_action: 'auto_recharge',
      },
    },
  ]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateKey = () => {
    const prefix = newKeyEnv === 'production' ? 'sf_live_mock_' : 'sf_test_mock_';
    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName.trim(),
      key: `${prefix}${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      environment: newKeyEnv,
      status: 'active',
    };

    setKeys([newKey, ...keys]);
    setNewKeyName('');
    setShowNewKeyModal(false);
  };

  const handleRevokeKey = (id: string) => {
    setKeys(
      keys.map((k) => (k.id === id ? { ...k, status: 'revoked' as const } : k))
    );
  };

  const handleSimulateWebhook = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const mockPayloads: Record<string, any> = {
        'invoice.payment_succeeded': {
          id: `inv_${Date.now()}`,
          amount_paid: 2900,
          currency: 'usd',
          status: 'paid',
          period_start: new Date().toISOString(),
          customer_email: 'billing@enterprise.io',
        },
        'customer.subscription.created': {
          id: `sub_${Date.now()}`,
          tier: 'enterprise',
          monthly_credits: 50000,
          concurrency_limit: 50,
          activated: true,
        },
        'quota.exceeded': {
          alert_level: 'critical',
          organization_id: 'org_acme_corp',
          credits_left: 0,
          blocked_requests: 1,
        },
      };

      const newLog: WebhookEvent = {
        id: `wh_evt_${Date.now()}`,
        event: selectedEventType,
        timestamp: new Date().toLocaleTimeString(),
        status: 200,
        durationMs: Math.floor(Math.random() * 50) + 30,
        payload: mockPayloads[selectedEventType] || { status: 'ok', event: selectedEventType },
      };

      setWebhookLogs([newLog, ...webhookLogs]);
      setIsSimulating(false);
    }, 600);
  };

  const snippetCode = {
    curl: `curl -X POST https://day-30-ai-saas-boilerplate.vercel.app/api/ai \\
  -H "Authorization: Bearer ${keys[0]?.key || 'sf_live_YOUR_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-1.5-flash",
    "prompt": "Synthesize microservice architecture summary",
    "temperature": 0.7
  }'`,
    ts: `import { SaaSForgeClient } from '@saasforge/sdk';

const client = new SaaSForgeClient({
  apiKey: process.env.SAASFORGE_API_KEY || '${keys[0]?.key || 'sf_live_YOUR_KEY'}',
  endpoint: 'https://day-30-ai-saas-boilerplate.vercel.app/api',
});

async function main() {
  const response = await client.ai.generate({
    model: 'gemini-1.5-flash',
    prompt: 'Summarize real-time enterprise telemetry',
    stream: true,
  });

  for await (const chunk of response) {
    process.stdout.write(chunk.text);
  }
}
main();`,
    python: `import os
import requests

API_KEY = os.getenv("SAASFORGE_API_KEY", "${keys[0]?.key || 'sf_live_YOUR_KEY'}")
URL = "https://day-30-ai-saas-boilerplate.vercel.app/api/ai"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

payload = {
    "model": "gemini-1.5-pro",
    "prompt": "Analyze vector embedding anomaly",
    "temperature": 0.5
}

response = requests.post(URL, json=payload, headers=headers)
print(response.json())`,
  };

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#090d16] border border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold mb-2 text-[10px]">
              <Key className="w-3 h-3" />
              <span>DEVELOPER PORTAL & AUTH</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              API Keys & Webhooks Engine
            </h2>
            <p className="text-slate-400 text-xs mt-1 max-w-2xl">
              Authenticate external client microservices, provision scoped authorization tokens, and stream cryptographically verified real-time events.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowNewKeyModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/15 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Secret Key</span>
          </button>
        </div>
      </div>

      {/* Modal for Creating API Key */}
      {showNewKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#090d16] border border-white/[0.12] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Create New Secret Key</span>
            </h3>
            <p className="text-slate-400 text-xs">
              Secret keys allow programmatic access to the SaaSForge AI inference pipeline and credit balance.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Key Description / Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Production Ingestion Service"
                  className="w-full px-3 py-2 rounded-lg bg-[#04060c] border border-white/[0.1] text-white focus:outline-none focus:border-amber-400 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Environment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewKeyEnv('production')}
                    className={`py-2 px-3 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                      newKeyEnv === 'production'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                        : 'bg-[#04060c] text-slate-400 border-white/[0.08]'
                    }`}
                  >
                    Production (sf_live)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewKeyEnv('development')}
                    className={`py-2 px-3 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                      newKeyEnv === 'development'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                        : 'bg-[#04060c] text-slate-400 border-white/[0.08]'
                    }`}
                  >
                    Development (sf_test)
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4">
              <button
                type="button"
                onClick={() => setShowNewKeyModal(false)}
                className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateKey}
                disabled={!newKeyName.trim()}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-extrabold"
              >
                Generate Token
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Active API Keys Table */}
      <div className="p-6 rounded-2xl bg-[#090d16] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Active Secret Keys</span>
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Do not share secret keys in public repositories or client-side bundles.
            </p>
          </div>
          <span className="text-[11px] text-slate-500">
            {keys.filter((k) => k.status === 'active').length} active keys
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Name / Purpose</th>
                <th className="py-3 px-4">Secret Key Token</th>
                <th className="py-3 px-4">Environment</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Last Used</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {keys.map((k) => {
                const isVisible = !!visibleKeys[k.id];
                const isRevoked = k.status === 'revoked';
                const displayKey = isRevoked
                  ? '••••••••••••••••••••••••••••••••'
                  : isVisible
                  ? k.key
                  : `${k.key.substring(0, 8)}••••••••••••••••${k.key.substring(k.key.length - 4)}`;

                return (
                  <tr
                    key={k.id}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      isRevoked ? 'opacity-40' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{k.name}</span>
                        {isRevoked && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold">
                            REVOKED
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#04060c] px-2 py-1 rounded border border-white/[0.06] text-[11px] select-all">
                          {displayKey}
                        </span>
                        {!isRevoked && (
                          <>
                            <button
                              type="button"
                              onClick={() => toggleVisibility(k.id)}
                              className="text-slate-500 hover:text-white transition-colors"
                              title={isVisible ? 'Mask Key' : 'Reveal Key'}
                            >
                              {isVisible ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopy(k.key, k.id)}
                              className="text-slate-500 hover:text-emerald-400 transition-colors"
                              title="Copy Full Key"
                            >
                              {copiedId === k.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          k.environment === 'production'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                        }`}
                      >
                        {k.environment}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-400 text-[11px]">{k.created}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{k.lastUsed}</td>

                    <td className="py-3 px-4 text-right">
                      {!isRevoked && (
                        <button
                          type="button"
                          onClick={() => handleRevokeKey(k.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Revoke Key"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Quick Start Code Snippets */}
      <div className="p-6 rounded-2xl bg-[#090d16] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Client SDK Integration Snippet</span>
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Plug into your microservice architecture in less than 60 seconds.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#04060c] p-1 rounded-xl border border-white/[0.08]">
            {(['ts', 'curl', 'python'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSnippetTab(tab)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  activeSnippetTab === tab
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'ts' ? 'TypeScript / Node' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-xl bg-[#04060c] border border-white/[0.08] p-4 overflow-hidden">
          <div className="absolute top-3 right-3">
            <button
              type="button"
              onClick={() => handleCopy(snippetCode[activeSnippetTab], 'snippet')}
              className="px-2.5 py-1 rounded bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 hover:text-white text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedId === 'snippet' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="text-slate-300 font-mono text-[11px] leading-relaxed overflow-x-auto pt-2">
            <code>{snippetCode[activeSnippetTab]}</code>
          </pre>
        </div>
      </div>

      {/* Section 3: Webhook Delivery Simulator & Stream */}
      <div className="p-6 rounded-2xl bg-[#090d16] border border-white/[0.08] space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold mb-2 text-[10px]">
            <Radio className="w-3 h-3 text-indigo-400" />
            <span>REAL-TIME DISPATCH</span>
          </div>
          <h3 className="text-sm font-bold text-white">
            Webhook Delivery Endpoints & Live Simulator
          </h3>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Deliver signed JSON event payloads to your backend endpoints when subscriptions, usage thresholds, or quota limits trigger.
          </p>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300">Webhook Target URL</label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#04060c] border border-white/[0.08] text-white focus:outline-none focus:border-indigo-400 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300">
              Signing Secret (HMAC SHA-256)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={webhookSecret}
                className="flex-1 px-3 py-2 rounded-xl bg-[#04060c] border border-white/[0.08] text-slate-400 text-xs font-mono select-all"
              />
              <button
                type="button"
                onClick={() => handleCopy(webhookSecret, 'webhookSecret')}
                className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 font-bold text-xs flex items-center gap-1 shrink-0"
              >
                {copiedId === 'webhookSecret' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="p-4 rounded-xl bg-[#04060c] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-slate-300">Select Mock Event:</span>
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="bg-[#0a0f1d] border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
            >
              <option value="invoice.payment_succeeded">invoice.payment_succeeded</option>
              <option value="customer.subscription.created">customer.subscription.created</option>
              <option value="quota.exceeded">quota.exceeded</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSimulateWebhook}
            disabled={isSimulating}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <Send className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Dispatching Payload...' : 'Test Webhook Payload'}</span>
          </button>
        </div>

        {/* Webhook Events Stream Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
            <span>Recent Event Deliveries</span>
            <span>{webhookLogs.length} events logged</span>
          </div>

          <div className="space-y-2">
            {webhookLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              return (
                <div
                  key={log.id}
                  className="rounded-xl border border-white/[0.06] bg-[#04060c] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="w-full p-3 flex items-center justify-between text-left hover:bg-white/[0.02] cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                        {log.status} OK
                      </span>
                      <span className="font-bold text-white">{log.event}</span>
                      <span className="text-slate-500 text-[10px] hidden sm:inline">{log.id}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-[10px]">{log.durationMs}ms</span>
                      <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-3 border-t border-white/[0.06] bg-[#020408]">
                      <div className="flex items-center justify-between mb-1.5 text-[10px] text-slate-400">
                        <span>Payload JSON</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(JSON.stringify(log.payload, null, 2), log.id)}
                          className="hover:text-white flex items-center gap-1"
                        >
                          {copiedId === log.id ? 'Copied' : 'Copy JSON'}
                        </button>
                      </div>
                      <pre className="text-slate-300 font-mono text-[10px] bg-[#050811] p-2.5 rounded-lg border border-white/[0.04] overflow-x-auto">
                        <code>{JSON.stringify(log.payload, null, 2)}</code>
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
