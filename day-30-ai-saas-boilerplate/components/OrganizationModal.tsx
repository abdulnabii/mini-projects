'use client';

import { useState } from 'react';
import { Organization, PlanTier, UserRole } from '@/types';
import {
  Building2,
  Users,
  Plus,
  Check,
  X,
  UserPlus,
  Shield,
  Trash2,
  Mail,
  Sparkles,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  organizations: Organization[];
  activeOrg: Organization;
  onSelectOrg: (org: Organization) => void;
  onCreateOrg: (name: string, slug: string) => void;
  onAddMember: (name: string, email: string, role: UserRole) => void;
  onNavigateToBilling?: () => void;
}

const WORKSPACE_LIMITS: Record<PlanTier, number> = {
  free: 2,
  pro: 5,
  enterprise: 15,
};

export default function OrganizationModal({
  isOpen,
  onClose,
  organizations,
  activeOrg,
  onSelectOrg,
  onCreateOrg,
  onAddMember,
  onNavigateToBilling,
}: Props) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgSlug, setNewOrgSlug] = useState('');

  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('member');

  if (!isOpen) return null;

  const maxWorkspaces = WORKSPACE_LIMITS[activeOrg.plan] || 2;
  const isLimitReached = organizations.length >= maxWorkspaces;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim() || isLimitReached) return;
    const slug = newOrgSlug.trim() || newOrgName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    onCreateOrg(newOrgName.trim(), slug);
    setNewOrgName('');
    setNewOrgSlug('');
    setShowCreateForm(false);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#10b981'],
    });
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    onAddMember(inviteName.trim(), inviteEmail.trim(), inviteRole);
    setInviteName('');
    setInviteEmail('');
    setShowInviteForm(false);
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.7 },
      colors: ['#10b981', '#f59e0b'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-mono text-xs">
      <div className="bg-[#090d16] border border-white/[0.08] rounded-2xl p-6 max-w-xl w-full space-y-5 shadow-2xl my-8 text-slate-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-mono">
                Multi-Tenant Workspace &amp; Members
              </h3>
              <p className="text-[10px] text-slate-400">
                Manage organizations and role-based permissions (Clerk / Supabase RLS)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md bg-[#0f1422] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Organization Switcher with Quota Limits */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Workspaces:
              </label>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isLimitReached
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
              }`}>
                {organizations.length} / {maxWorkspaces} ({activeOrg.plan.toUpperCase()})
              </span>
            </div>

            {isLimitReached ? (
              <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                Limit Reached
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <Plus className="w-3 h-3" />
                <span>New Workspace</span>
              </button>
            )}
          </div>

          {/* Limit Reached Warning & Upgrade Prompt */}
          {isLimitReached && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-amber-300 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] leading-tight">
                  Workspace cap reached ({organizations.length}/{maxWorkspaces}). Upgrade your subscription tier to create more workspaces.
                </span>
              </div>
              {onNavigateToBilling && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToBilling();
                  }}
                  className="px-2.5 py-1 rounded bg-amber-500 text-black font-extrabold text-[10px] hover:bg-amber-400 shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>Upgrade</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {showCreateForm && !isLimitReached ? (
            <form onSubmit={handleCreateSubmit} className="p-3.5 rounded-xl bg-[#04060a] border border-indigo-500/30 space-y-2.5">
              <input
                type="text"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                placeholder="Workspace name (e.g. Stealth AI)"
                className="w-full p-2 rounded bg-[#0f1422] border border-white/[0.08] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-2.5 py-1 text-slate-400 text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newOrgName.trim() || isLimitReached}
                  className="px-3 py-1 rounded bg-indigo-500 text-white font-bold text-[11px] disabled:opacity-50"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
              {organizations.map((org) => {
                const isActive = org.id === activeOrg.id;
                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => {
                      onSelectOrg(org);
                      onClose();
                    }}
                    className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0f1422] border-emerald-500/50 text-white'
                        : 'bg-[#04060a] border-white/[0.06] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">{org.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({org.slug})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                        {Math.min(org.creditsTotal, Math.max(0, org.creditsRemaining))}/{org.creditsTotal} cred
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] uppercase font-bold">
                        {org.plan}
                      </span>
                      {isActive && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Team Members & Roles */}
        <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {activeOrg.name} — Members ({activeOrg.members.length}):
            </label>
            <button
              type="button"
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <UserPlus className="w-3 h-3" />
              <span>Invite Member</span>
            </button>
          </div>

          {showInviteForm && (
            <form onSubmit={handleInviteSubmit} className="p-3.5 rounded-xl bg-[#04060a] border border-emerald-500/30 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Full Name"
                  className="p-2 rounded bg-[#0f1422] border border-white/[0.08] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email Address"
                  className="p-2 rounded bg-[#0f1422] border border-white/[0.08] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="p-1.5 rounded bg-[#0f1422] border border-white/[0.08] text-xs text-white focus:outline-none"
                >
                  <option value="member">Role: Member</option>
                  <option value="admin">Role: Admin</option>
                  <option value="billing">Role: Billing Manager</option>
                </select>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteForm(false)}
                    className="px-2.5 py-1 text-slate-400 text-[11px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!inviteName.trim() || !inviteEmail.trim()}
                    className="px-3 py-1 rounded bg-emerald-500 text-black font-bold text-[11px] disabled:opacity-50"
                  >
                    Send Invitation
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
            {activeOrg.members.map((member) => (
              <div
                key={member.id}
                className="p-2.5 rounded-lg bg-[#04060a] border border-white/[0.04] flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{member.name}</span>
                    <span className="text-[10px] text-slate-500">({member.email})</span>
                  </div>
                  <span className="text-[9px] text-slate-500 block">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded bg-[#0f1422] border border-white/[0.08] text-slate-300 text-[9px] uppercase font-bold">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
