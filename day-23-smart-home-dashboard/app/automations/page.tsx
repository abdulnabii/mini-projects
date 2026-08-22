'use client';

import { useState, useEffect } from 'react';
import { getStoredDevices } from '@/lib/deviceStore';
import { Device } from '@/types';
import AutomationBuilder from '@/components/AutomationBuilder';

export default function AutomationsPage() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    setDevices(getStoredDevices());
  }, []);

  return (
    <div className="w-full min-w-0">
      <AutomationBuilder devices={devices} />
    </div>
  );
}
