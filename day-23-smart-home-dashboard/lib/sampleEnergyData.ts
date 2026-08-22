import { EnergyOverview, HourlyEnergyPoint } from '@/types';

export const SAMPLE_HOURLY_ENERGY: HourlyEnergyPoint[] = [
  { hour: '00:00', wattage: 420, costCents: 6, activeCount: 3 },
  { hour: '02:00', wattage: 380, costCents: 5, activeCount: 3 },
  { hour: '04:00', wattage: 360, costCents: 5, activeCount: 3 },
  { hour: '06:00', wattage: 780, costCents: 11, activeCount: 6 },
  { hour: '08:00', wattage: 1450, costCents: 21, activeCount: 8 },
  { hour: '10:00', wattage: 1100, costCents: 16, activeCount: 7 },
  { hour: '12:00', wattage: 1620, costCents: 24, activeCount: 9 },
  { hour: '14:00', wattage: 1850, costCents: 27, activeCount: 10 },
  { hour: '16:00', wattage: 1720, costCents: 25, activeCount: 9 },
  { hour: '18:00', wattage: 2350, costCents: 35, activeCount: 11 },
  { hour: '20:00', wattage: 2100, costCents: 31, activeCount: 11 },
  { hour: '22:00', wattage: 950, costCents: 14, activeCount: 5 },
];

export const SAMPLE_ENERGY_OVERVIEW: EnergyOverview = {
  currentDrawWatts: 1680,
  todayKwh: 18.4,
  estMonthlyCostUsd: 82.5,
  carbonOffsetKg: 14.2,
  hourlyBreakdown: SAMPLE_HOURLY_ENERGY,
  topConsumingDevices: [
    { deviceName: 'Living Room Climate (HVAC)', room: 'Living Room', kwh: 9.8, percent: 53 },
    { deviceName: 'Bedroom Whisper AC', room: 'Master Bedroom', kwh: 4.6, percent: 25 },
    { deviceName: 'Smart Espresso Maker', room: 'Kitchen', kwh: 1.8, percent: 10 },
    { deviceName: 'Studio Key Light & Devices', room: 'Home Office', kwh: 1.2, percent: 7 },
    { deviceName: 'Perimeter Security & Cameras', room: 'Security & Entry', kwh: 1.0, percent: 5 },
  ],
};
