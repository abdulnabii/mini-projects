'use client';

import { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Lock,
  UserCheck,
  FileText,
  AlertCircle,
  Filter,
  Search,
  KeyRound,
  Users,
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  actor: string;
  role: string;
  action: string;
  resource: string;
  ip: string;
  timestamp: string;
  status: 'allowed' | 'denied';
}

export default function SecurityAuditPanel() {
  const [filterQuery, setFilterQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const permissions = [
    {
      action: 'Invoke Gemini AI Generation Pipeline',
      category: 'Inference',
      owner: true,
      admin: true,
      member: true,
      billing: false,
    },
    {
      action: 'Modify Stripe Subscriptions & Billing',
      category: 'Billing',
      owner: true,
      admin: true,
      member: false,
      billing: true,
    },
    {
      action: 'Provision & Revoke API Secret Keys',
      category: 'Developer',
      owner: true,
      admin: true,
      member: false,
      billing: false,
    },
    {
      action: 'Manage Organization Members & Roles',
      category: 'Administration',
      owner: true,
      admin: true,
      member: false,
      billing: false,
    },
    {
      action: 'Toggle Feature Flags & Traffic Canary',
      category: 'Developer',
      owner: true,
      admin: true,
      member: false,
      billing: false,
    },
    {
      action: 'Inspect Immutable Security Audit Logs',
      category: 'Governance',
      owner: true,
      admin: true,
      member: false,
      billing: false,
    },
    {
      action: 'Transfer Ownership or Purge Workspace',
      category: 'Administration',
      owner: true,
      admin: false,
      member: false,
      billing: false,
    },
  ];

  const auditLogs: AuditLogEntry[] = [
    {
      id: 'aud-1092',
      actor: 'abdul.nabi@saasforge.ai',
      role: 'Owner',
      action: 'api_key.create',
      resource: 'sf_live_demo_prod_key',
      ip: '24.189.91.***',
      timestamp: '2 mins ago',
      status: 'allowed',
    },
    {
      id: 'aud-1091',
      actor: 'sarah.c@saasforge.ai',
      role: 'Admin',
      action: 'feature_flag.update',
      resource: 'flag_vector_rag_beta',
      ip: '172.56.21.***',
      timestamp: '14 mins ago',
      status: 'allowed',
    },
    {
      id: 'aud-1090',
      actor: 'finance@saasforge.ai',
      role: 'Billing Manager',
      action: 'subscription.tier_upgrade',
      resource: 'sub_enterprise_q1',
      ip: '68.199.12.***',
      timestamp: '1 hour ago',
      status: 'allowed',
    },
    {
      id: 'aud-1089',
      actor: 'dev.intern@saasforge.ai',
      role: 'Member',
      action: 'api_key.revoke',
      resource: 'sf_live_prod_01',
      ip: '198.51.100.***',
      timestamp: '3 hours ago',
      status: 'denied',
    },
    {
      id: 'aud-1088',
      actor: 'abdul.nabi@saasforge.ai',
      role: 'Owner',
      action: 'member.role_update',
      resource: 'alex.m -> Admin',
      ip: '24.189.91.***',
      timestamp: '5 hours ago',
      status: 'allowed',
    },
  ];

  const filteredLogs = auditLogs.filter((entry) => {
    const matchesText =
      entry.actor.toLowerCase().includes(filterQuery.toLowerCase()) ||
      entry.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
      entry.resource.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || entry.role.toLowerCase().includes(roleFilter.toLowerCase());
    return matchesText && matchesRole;
  });

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#090d16] border border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold mb-2 text-[10px]">
            <Shield className="w-3 h-3" />
            <span>ENTERPRISE GOVERNANCE & COMPLIANCE</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            RBAC Matrix & Immutable Audit Trail
          </h2>
          <p className="text-slate-400 text-xs mt-1 max-w-2xl">
            Strict role-based access control policies, SAML single sign-on integration, and cryptographically verified chronological security telemetry.
          </p>
        </div>
      </div>

      {/* Security Posture Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-bold text-[10px]">AUTH ENFORCEMENT</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
              ACTIVE
            </span>
          </div>
          <p className="text-white font-bold text-sm">Mandatory 2FA & Hardware Keys</p>
          <p className="text-slate-400 text-[11px]">
            100% of tenant seats have enrolled WebAuthn / FIDO2 security credentials.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-bold text-[10px]">COMPLIANCE STATUS</span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[9px] font-bold">
              VERIFIED
            </span>
          </div>
          <p className="text-white font-bold text-sm">SOC 2 Type II & HIPAA Ready</p>
          <p className="text-slate-400 text-[11px]">
            Audited zero-retention AI data processing pipelines with end-to-end TLS 1.3.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-bold text-[10px]">IDENTITY FEDERATION</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[9px] font-bold">
              SAML 2.0
            </span>
          </div>
          <p className="text-white font-bold text-sm">Okta & Azure AD Connected</p>
          <p className="text-slate-400 text-[11px]">
            Automated user lifecycle provisioning via SCIM protocol enabled.
          </p>
        </div>
      </div>

      {/* Section 1: RBAC Permission Matrix */}
      <div className="p-6 rounded-2xl bg-[#090d16] border border-white/[0.08] space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Role-Based Access Control (RBAC) Matrix</span>
          </h3>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Pre-configured least-privilege permission matrix enforced across API endpoints and web portal.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Permission Scope</th>
                <th className="py-3 px-4 text-center">Owner</th>
                <th className="py-3 px-4 text-center">Admin</th>
                <th className="py-3 px-4 text-center">Member</th>
                <th className="py-3 px-4 text-center">Billing Mgr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{p.action}</div>
                    <span className="text-[9px] text-slate-500 uppercase">{p.category}</span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    {p.owner ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-600 inline" />
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {p.admin ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-600 inline" />
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {p.member ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-600 inline" />
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {p.billing ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-600 inline" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Real-time Immutable Security Audit Trail */}
      <div className="p-6 rounded-2xl bg-[#090d16] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-400" />
              <span>Security & Administrative Audit Trail</span>
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Append-only tamper-proof log of identity actions, API operations, and billing events.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search audit trail..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-[#04060c] border border-white/[0.08] text-white focus:outline-none focus:border-rose-400 text-xs font-mono"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#04060c] border border-white/[0.08] text-slate-300 text-xs focus:outline-none font-mono"
            >
              <option value="all">All Roles</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="billing">Billing Mgr</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Client IP</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Policy Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 text-[10px]">{log.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{log.actor}</div>
                    <span className="text-[9px] text-slate-400">{log.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/[0.08] font-mono text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300 text-[11px]">{log.resource}</td>
                  <td className="py-3 px-4 text-slate-500 text-[10px]">{log.ip}</td>
                  <td className="py-3 px-4 text-slate-400 text-[10px]">{log.timestamp}</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        log.status === 'allowed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
