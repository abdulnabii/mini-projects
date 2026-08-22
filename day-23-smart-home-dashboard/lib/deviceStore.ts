import { Device, Scene, AutomationRule } from '@/types';

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'lr_light_main',
    name: 'Living Room Chandelier',
    room: 'Living Room',
    type: 'light',
    isOn: true,
    brightness: 80,
    color: '#ffaa44',
    powerWatts: 45,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'lr_tv_light',
    name: 'TV Ambient Backlight',
    room: 'Living Room',
    type: 'light',
    isOn: true,
    brightness: 60,
    color: '#38bdf8',
    powerWatts: 18,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'lr_thermostat',
    name: 'Living Room Climate',
    room: 'Living Room',
    type: 'thermostat',
    isOn: true,
    temperature: 71,
    targetTemperature: 70,
    hvacMode: 'cool',
    humidity: 46,
    powerWatts: 850,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'br_light_ceiling',
    name: 'Master Bedroom Glow',
    room: 'Master Bedroom',
    type: 'light',
    isOn: false,
    brightness: 30,
    color: '#f43f5e',
    powerWatts: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'br_ac',
    name: 'Bedroom Whisper AC',
    room: 'Master Bedroom',
    type: 'thermostat',
    isOn: true,
    temperature: 69,
    targetTemperature: 68,
    hvacMode: 'cool',
    humidity: 42,
    powerWatts: 620,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'kt_light_island',
    name: 'Kitchen Island Pendant',
    room: 'Kitchen',
    type: 'light',
    isOn: true,
    brightness: 100,
    color: '#ffffff',
    powerWatts: 35,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'kt_espresso',
    name: 'Smart Espresso Maker',
    room: 'Kitchen',
    type: 'coffee',
    isOn: false,
    powerWatts: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'of_light_key',
    name: 'Studio Key Light',
    room: 'Home Office',
    type: 'light',
    isOn: true,
    brightness: 90,
    color: '#06b6d4',
    powerWatts: 65,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'of_speaker',
    name: 'Spatial Soundbar',
    room: 'Home Office',
    type: 'speaker',
    isOn: true,
    volume: 35,
    powerWatts: 22,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sec_front_lock',
    name: 'Front Door Smart Lock',
    room: 'Security & Entry',
    type: 'lock',
    isOn: true,
    isLocked: true,
    powerWatts: 2,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sec_porch_cam',
    name: 'Front Porch 4K Camera',
    room: 'Security & Entry',
    type: 'camera',
    isOn: true,
    cameraFeedUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    motionDetected: false,
    powerWatts: 8,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sec_backyard_flood',
    name: 'Backyard Floodlight',
    room: 'Patio & Outdoor',
    type: 'light',
    isOn: false,
    brightness: 100,
    color: '#ffffff',
    powerWatts: 0,
    lastUpdated: new Date().toISOString(),
  },
];

export const PRESET_SCENES: Scene[] = [
  {
    id: 'scene_movie',
    name: 'Movie Night',
    icon: '🎬',
    description: 'Warm dim illumination, TV backlighting on, front door locked, soundbar optimized',
    badge: 'Entertainment',
    deviceUpdates: [
      { deviceId: 'lr_light_main', updates: { isOn: true, brightness: 15, color: '#ff6b35', powerWatts: 10 } },
      { deviceId: 'lr_tv_light', updates: { isOn: true, brightness: 75, color: '#06b6d4', powerWatts: 20 } },
      { deviceId: 'br_light_ceiling', updates: { isOn: false, powerWatts: 0 } },
      { deviceId: 'sec_front_lock', updates: { isLocked: true } },
      { deviceId: 'of_speaker', updates: { isOn: true, volume: 50, powerWatts: 30 } },
    ],
  },
  {
    id: 'scene_sleep',
    name: 'Sleep Sanctuary',
    icon: '😴',
    description: 'All interior lights off, bedroom climate 68°F, perimeter locked, security armed',
    badge: 'Rest & Recovery',
    deviceUpdates: [
      { deviceId: 'lr_light_main', updates: { isOn: false, powerWatts: 0 } },
      { deviceId: 'lr_tv_light', updates: { isOn: false, powerWatts: 0 } },
      { deviceId: 'kt_light_island', updates: { isOn: false, powerWatts: 0 } },
      { deviceId: 'of_light_key', updates: { isOn: false, powerWatts: 0 } },
      { deviceId: 'br_light_ceiling', updates: { isOn: false, powerWatts: 0 } },
      { deviceId: 'br_ac', updates: { isOn: true, targetTemperature: 68, hvacMode: 'cool', powerWatts: 600 } },
      { deviceId: 'sec_front_lock', updates: { isLocked: true } },
    ],
  },
  {
    id: 'scene_away',
    name: 'Away / Lock Down',
    icon: '🏃',
    description: 'Non-essential appliances powered down, HVAC in eco mode, full security monitoring',
    badge: 'Security',
    deviceUpdates: [
      { deviceId: 'lr_light_main', updates: { isOn: false, powerWatts: 0 } },
      { deviceId: 'lr_tv_light', updates: { isOn: false, powerWatts: 0 } },
      { deviceId: 'kt_espresso', updates: { isOn: false, powerWatts: 0 } },
      { deviceId: 'of_speaker', updates: { isOn: false, powerWatts: 0 } },
      { deviceId: 'lr_thermostat', updates: { hvacMode: 'eco', targetTemperature: 76, powerWatts: 200 } },
      { deviceId: 'sec_front_lock', updates: { isLocked: true } },
      { deviceId: 'sec_porch_cam', updates: { motionDetected: true } },
    ],
  },
  {
    id: 'scene_morning',
    name: 'Morning Rise',
    icon: '☀️',
    description: 'Kitchen lights energized to 80%, smart espresso machine warming, climate 72°F',
    badge: 'Productivity',
    deviceUpdates: [
      { deviceId: 'kt_light_island', updates: { isOn: true, brightness: 80, color: '#fffaed', powerWatts: 28 } },
      { deviceId: 'kt_espresso', updates: { isOn: true, powerWatts: 1200 } },
      { deviceId: 'br_light_ceiling', updates: { isOn: true, brightness: 50, color: '#ffeedd', powerWatts: 15 } },
      { deviceId: 'lr_thermostat', updates: { targetTemperature: 72, hvacMode: 'heat', powerWatts: 700 } },
    ],
  },
  {
    id: 'scene_focus',
    name: 'Deep Focus Work',
    icon: '💼',
    description: 'Office keylight 100% crisp white, background audio calibrated, climate steady',
    badge: 'Focus',
    deviceUpdates: [
      { deviceId: 'of_light_key', updates: { isOn: true, brightness: 100, color: '#ffffff', powerWatts: 75 } },
      { deviceId: 'of_speaker', updates: { isOn: true, volume: 25, powerWatts: 15 } },
      { deviceId: 'lr_light_main', updates: { isOn: false, powerWatts: 0 } },
    ],
  },
  {
    id: 'scene_eco',
    name: 'Eco Saver',
    icon: '🌿',
    description: 'Lights dimmed 40%, thermostat set to high efficiency curve, idle draw trimmed',
    badge: 'Green Energy',
    deviceUpdates: [
      { deviceId: 'lr_light_main', updates: { isOn: true, brightness: 40, powerWatts: 20 } },
      { deviceId: 'kt_light_island', updates: { isOn: true, brightness: 40, powerWatts: 15 } },
      { deviceId: 'of_light_key', updates: { isOn: true, brightness: 45, powerWatts: 30 } },
      { deviceId: 'lr_thermostat', updates: { hvacMode: 'eco', targetTemperature: 74, powerWatts: 250 } },
    ],
  },
];

export const INITIAL_AUTOMATIONS: AutomationRule[] = [
  {
    id: 'rule_sunset',
    title: 'Sunset Ambience Trigger',
    enabled: true,
    icon: '🌅',
    triggerDescription: 'Every day at sunset (6:45 PM)',
    actionDescription: 'Turn on Living Room Chandelier & TV Backlight to warm glow',
    trigger: { type: 'time', value: '18:45' },
    deviceUpdates: [
      { deviceId: 'lr_light_main', updates: { isOn: true, brightness: 65, color: '#ffaa44', powerWatts: 35 } },
      { deviceId: 'lr_tv_light', updates: { isOn: true, brightness: 50, color: '#38bdf8', powerWatts: 15 } },
    ],
  },
  {
    id: 'rule_night_lock',
    title: 'Auto-Lock Perimeter at 11:00 PM',
    enabled: true,
    icon: '🔒',
    triggerDescription: 'Every night at 11:00 PM',
    actionDescription: 'Lock Front Door Deadbolt & arm security cameras',
    trigger: { type: 'time', value: '23:00' },
    deviceUpdates: [
      { deviceId: 'sec_front_lock', updates: { isLocked: true } },
      { deviceId: 'sec_porch_cam', updates: { motionDetected: true } },
    ],
  },
  {
    id: 'rule_temp_eco',
    title: 'Peak Energy Savings Throttling',
    enabled: true,
    icon: '⚡',
    triggerDescription: 'When grid power draw exceeds 2,500 Watts',
    actionDescription: 'Switch HVAC to Eco mode and dim non-essential lighting',
    trigger: { type: 'temperature', value: '2500W' },
    deviceUpdates: [
      { deviceId: 'lr_thermostat', updates: { hvacMode: 'eco', targetTemperature: 75 } },
      { deviceId: 'br_light_ceiling', updates: { isOn: false } },
    ],
  },
];

const DEVICE_STORAGE_KEY = 'aurahome_device_states';

export function getStoredDevices(): Device[] {
  if (typeof window === 'undefined') return INITIAL_DEVICES;
  try {
    const raw = localStorage.getItem(DEVICE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(INITIAL_DEVICES));
      return INITIAL_DEVICES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load device states:', e);
    return INITIAL_DEVICES;
  }
}

export function saveDevicesToStorage(devices: Device[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(devices));
  } catch (e) {
    console.error('Failed to save device states:', e);
  }
}
