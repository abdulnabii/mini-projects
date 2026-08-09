'use client';

import React from 'react';
import { Severity } from '@/types';
import { ShieldAlert, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface IssueBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md';
}

export default function IssueBadge({ severity, size = 'md' }: IssueBadgeProps) {
  const configs = {
    CRITICAL: {
      label: 'CRITICAL',
      color: 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse',
      icon: ShieldAlert,
    },
    MAJOR: {
      label: 'MAJOR',
      color: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
      icon: AlertTriangle,
    },
    MINOR: {
      label: 'MINOR',
      color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      icon: AlertCircle,
    },
    INFO: {
      label: 'INFO',
      color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      icon: Info,
    },
  };

  const config = configs[severity] || configs.INFO;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-mono',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-mono font-bold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-wider ${config.color} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
}
