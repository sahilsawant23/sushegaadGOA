export type FlagStatus = 'green' | 'yellow' | 'red' | 'purple';

export interface TideEvent {
  time: string;
  type: 'High Tide' | 'Low Tide';
  heightMeters: number;
}

export interface BeachSafetyData {
  beachId: string;
  beachName: string;
  region: 'North Goa' | 'South Goa' | 'Central Goa';
  flagStatus: FlagStatus;
  flagLabel: string;
  flagDescription: string;
  waveHeight: string; // e.g. "1.2 m"
  waterTemp: string; // e.g. "28°C"
  windSpeed: string; // e.g. "14 km/h"
  uvIndex: number; // e.g. 7
  ripCurrentAlert: boolean;
  jellyfishAlert: boolean;
  watersportsStatus: 'Operational' | 'Caution' | 'Suspended';
  lifeguardsOnDuty: number;
  rescueStationContact: string;
  tidesToday: TideEvent[];
  safetyTip: string;
}

export const BEACH_SAFETY_DATASET: BeachSafetyData[] = [
  {
    beachId: 'baga-beach',
    beachName: 'Baga Beach',
    region: 'North Goa',
    flagStatus: 'green',
    flagLabel: 'Green Flag (Safe for Swimming)',
    flagDescription: 'Gentle swell and safe shore break. Lifeguards actively patrolling from Tower 1 to 4.',
    waveHeight: '0.8 m',
    waterTemp: '28.5°C',
    windSpeed: '12 km/h W',
    uvIndex: 7,
    ripCurrentAlert: false,
    jellyfishAlert: false,
    watersportsStatus: 'Operational',
    lifeguardsOnDuty: 8,
    rescueStationContact: '+91 832 227 6000',
    tidesToday: [
      { time: '06:15 AM', type: 'High Tide', heightMeters: 2.1 },
      { time: '12:40 PM', type: 'Low Tide', heightMeters: 0.5 },
      { time: '07:10 PM', type: 'High Tide', heightMeters: 1.9 },
      { time: '01:20 AM', type: 'Low Tide', heightMeters: 0.3 }
    ],
    safetyTip: 'Ideal conditions for watersports! Always stay within the designated safe swimming zone marked by red & yellow boundary flags.'
  },
  {
    beachId: 'calangute-beach',
    beachName: 'Calangute Beach',
    region: 'North Goa',
    flagStatus: 'yellow',
    flagLabel: 'Yellow Flag (Exercise Caution)',
    flagDescription: 'Moderate shore waves and mild steep drop-off near central shack area.',
    waveHeight: '1.4 m',
    waterTemp: '28.0°C',
    windSpeed: '18 km/h NW',
    uvIndex: 8,
    ripCurrentAlert: true,
    jellyfishAlert: false,
    watersportsStatus: 'Caution',
    lifeguardsOnDuty: 10,
    rescueStationContact: '+91 832 227 6001',
    tidesToday: [
      { time: '06:20 AM', type: 'High Tide', heightMeters: 2.2 },
      { time: '12:45 PM', type: 'Low Tide', heightMeters: 0.6 },
      { time: '07:15 PM', type: 'High Tide', heightMeters: 2.0 },
      { time: '01:25 AM', type: 'Low Tide', heightMeters: 0.4 }
    ],
    safetyTip: 'Mild rip currents detected near the sandbar. Non-swimmers should stay knee-deep and avoid swimming past 6:30 PM.'
  },
  {
    beachId: 'anjuna-beach',
    beachName: 'Anjuna Beach (Rocky Coast)',
    region: 'North Goa',
    flagStatus: 'yellow',
    flagLabel: 'Yellow Flag (Submerged Rocks)',
    flagDescription: 'Slippery rock beds and sharp coral outcrops along Curlies and South Anjuna shoreline.',
    waveHeight: '1.2 m',
    waterTemp: '27.8°C',
    windSpeed: '15 km/h W',
    uvIndex: 8,
    ripCurrentAlert: false,
    jellyfishAlert: false,
    watersportsStatus: 'Operational',
    lifeguardsOnDuty: 6,
    rescueStationContact: '+91 832 227 6002',
    tidesToday: [
      { time: '06:10 AM', type: 'High Tide', heightMeters: 2.0 },
      { time: '12:35 PM', type: 'Low Tide', heightMeters: 0.4 },
      { time: '07:05 PM', type: 'High Tide', heightMeters: 1.8 },
      { time: '01:15 AM', type: 'Low Tide', heightMeters: 0.3 }
    ],
    safetyTip: 'Watch out for slippery volcanic rocks during low tide. Wear aqua shoes if walking near the shoreline cliffs.'
  },
  {
    beachId: 'palolem-beach',
    beachName: 'Palolem Beach',
    region: 'South Goa',
    flagStatus: 'green',
    flagLabel: 'Green Flag (Calm Bay)',
    flagDescription: 'Protected crescent bay with glass-like calm waters. Perfect for swimming and kayaking.',
    waveHeight: '0.4 m',
    waterTemp: '29.0°C',
    windSpeed: '8 km/h SW',
    uvIndex: 6,
    ripCurrentAlert: false,
    jellyfishAlert: false,
    watersportsStatus: 'Operational',
    lifeguardsOnDuty: 6,
    rescueStationContact: '+91 832 264 3000',
    tidesToday: [
      { time: '05:50 AM', type: 'High Tide', heightMeters: 1.9 },
      { time: '12:15 PM', type: 'Low Tide', heightMeters: 0.3 },
      { time: '06:45 PM', type: 'High Tide', heightMeters: 1.7 },
      { time: '12:55 AM', type: 'Low Tide', heightMeters: 0.2 }
    ],
    safetyTip: 'Extremely calm and safe for kids and beginner kayakers. Dolphin spotting boats operating smoothly.'
  },
  {
    beachId: 'morjim-beach',
    beachName: 'Morjim Beach (Turtle Nesting Site)',
    region: 'North Goa',
    flagStatus: 'purple',
    flagLabel: 'Purple Flag (Marine Life Eco Zone)',
    flagDescription: 'Protected Olive Ridley turtle nesting sanctuary. Blue jelly sightings near river mouth.',
    waveHeight: '1.0 m',
    waterTemp: '28.2°C',
    windSpeed: '11 km/h W',
    uvIndex: 7,
    ripCurrentAlert: false,
    jellyfishAlert: true,
    watersportsStatus: 'Caution',
    lifeguardsOnDuty: 5,
    rescueStationContact: '+91 832 227 6005',
    tidesToday: [
      { time: '06:25 AM', type: 'High Tide', heightMeters: 2.1 },
      { time: '12:50 PM', type: 'Low Tide', heightMeters: 0.5 },
      { time: '07:20 PM', type: 'High Tide', heightMeters: 1.9 },
      { time: '01:30 AM', type: 'Low Tide', heightMeters: 0.4 }
    ],
    safetyTip: 'Jellyfish sting alert near the Chapora river estuary. Avoid swimming without rashguards. Loud music and high-power lights strictly banned.'
  },
  {
    beachId: 'vagator-beach',
    beachName: 'Vagator & Ozran Beach',
    region: 'North Goa',
    flagStatus: 'yellow',
    flagLabel: 'Yellow Flag (Moderate Swell)',
    flagDescription: 'Strong undertow near Little Vagator cliff cove.',
    waveHeight: '1.6 m',
    waterTemp: '27.9°C',
    windSpeed: '16 km/h WNW',
    uvIndex: 8,
    ripCurrentAlert: true,
    jellyfishAlert: false,
    watersportsStatus: 'Caution',
    lifeguardsOnDuty: 7,
    rescueStationContact: '+91 832 227 6006',
    tidesToday: [
      { time: '06:12 AM', type: 'High Tide', heightMeters: 2.1 },
      { time: '12:38 PM', type: 'Low Tide', heightMeters: 0.5 },
      { time: '07:08 PM', type: 'High Tide', heightMeters: 1.9 },
      { time: '01:18 AM', type: 'Low Tide', heightMeters: 0.3 }
    ],
    safetyTip: 'Do not jump off cliff rocks into the sea! Deep underwater currents exist around Shiva Face rock.'
  }
];
