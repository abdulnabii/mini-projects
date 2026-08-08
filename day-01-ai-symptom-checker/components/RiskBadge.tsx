'use client';

import React from 'react';
import { RiskLevel } from '@/types';
import { ShieldCheck, AlertCircle, AlertTriangle, Flame } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

export default function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const configs = {
    LOW: {
      label: 'Low Risk — Self Care',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: ShieldCheck,
    },
    MEDIUM: {
      label: 'Medium Risk — GP Consultation',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: AlertCircle,
    },
    HIGH: {
      label: 'High Risk — Urgent Care',
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      icon: AlertTriangle,
    },
    EMERGENCY: {
      label: 'EMERGENCY — Immediate ER Care',
      color: 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse',
      icon: Flame,
    },
  };

  const config = configs[level] || configs.LOW;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold tracking-wide ${config.color} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'lg' ? 'w-5 h-5' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      <span>{config.label}</span>
    </span>
  );
}
