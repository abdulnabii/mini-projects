export type Room =
  | 'All Rooms'
  | 'Living Room'
  | 'Master Bedroom'
  | 'Kitchen'
  | 'Home Office'
  | 'Security & Entry'
  | 'Patio & Outdoor';

export type DeviceType =
  | 'light'
  | 'thermostat'
  | 'lock'
  | 'camera'
  | 'tv'
  | 'coffee'
  | 'speaker'
  | 'plug';

export interface Device {
  id: string;
  name: string;
  room: Exclude<Room, 'All Rooms'>;
  type: DeviceType;
  isOn: boolean;
  brightness?: number; // 0 - 100
  color?: string; // Hex color
  temperature?: number; // Current temp °F
  targetTemperature?: number; // Setpoint temp °F
  hvacMode?: 'cool' | 'heat' | 'eco' | 'off';
  humidity?: number; // Percentage
  isLocked?: boolean; // Door locks
  volume?: number; // Audio volume 0 - 100
  powerWatts: number; // Current live power consumption
  cameraFeedUrl?: string; // Simulated video or image feed
  motionDetected?: boolean; // Security motion
  lastUpdated: string;
}

export interface Scene {
  id: string;
  name: string;
  icon: string;
  description: string;
  badge: string;
  deviceUpdates: {
    deviceId: string;
    updates: Partial<Device>;
  }[];
}

export interface VoiceCommandAction {
  deviceId: string;
  deviceName: string;
  action: string;
  value: any;
  unit?: string;
}

export interface VoiceCommandResult {
  transcript: string;
  actions: VoiceCommandAction[];
  confirmation: string;
  aiExplanation?: string;
}

export interface AutomationRule {
  id: string;
  title: string;
  enabled: boolean;
  icon: string;
  triggerDescription: string;
  actionDescription: string;
  trigger: {
    type: 'time' | 'motion' | 'temperature' | 'door_open';
    value: string;
  };
  deviceUpdates: {
    deviceId: string;
    updates: Partial<Device>;
  }[];
}

export interface HourlyEnergyPoint {
  hour: string;
  wattage: number;
  costCents: number;
  activeCount: number;
}

export interface EnergyOverview {
  currentDrawWatts: number;
  todayKwh: number;
  estMonthlyCostUsd: number;
  carbonOffsetKg: number;
  hourlyBreakdown: HourlyEnergyPoint[];
  topConsumingDevices: {
    deviceName: string;
    room: string;
    kwh: number;
    percent: number;
  }[];
}
