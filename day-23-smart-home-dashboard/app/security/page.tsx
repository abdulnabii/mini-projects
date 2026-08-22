'use client';

import { useState, useEffect } from 'react';
import { getStoredDevices, saveDevicesToStorage } from '@/lib/deviceStore';
import { Device } from '@/types';
import SecurityGrid from '@/components/SecurityGrid';

export default function SecurityPage() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    setDevices(getStoredDevices());
  }, []);

  const handleUpdateDevice = (id: string, updates: Partial<Device>) => {
    const updated = devices.map((d) =>
      d.id === id ? { ...d, ...updates, lastUpdated: new Date().toISOString() } : d
    );
    setDevices(updated);
    saveDevicesToStorage(updated);
  };

  return (
    <div className="w-full min-w-0">
      <SecurityGrid devices={devices} onUpdateDevice={handleUpdateDevice} />
    </div>
  );
}
