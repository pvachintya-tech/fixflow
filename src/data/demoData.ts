// FixFlow Demo Data
// Isolated mock data for the interactive demo experience.
// Replace with API calls when backend is connected.

// ── Types ──────────────────────────────────────────────────────

export interface DemoIncident {
  incidentId: string;
  title: string;
  category: string;
  locationId: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: string;
  status: string;
  reportCount: number;
  uniqueReporterCount: number;
  locationPopulation: number;
  estimatedImpact: string;
  assignedTeam: string;
  fusion: {
    semanticSimilarity: number;
    locationMatch: boolean;
    categoryMatch: boolean;
    timeCorrelation: boolean;
    evidenceSignal: boolean;
  };
  reports: string[];
}

export interface DemoLocation {
  id: string;
  name: string;
  population: number;
}

export interface AnalysisResult {
  category: string;
  location: string;
  affectedArea: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  summary: string;
  matchedIncident: DemoIncident | null;
  isNewIncident: boolean;
  locationConflict: LocationConflict | null;
}

export interface LocationConflict {
  mentionedLocation: string;
  selectedLocation: string;
}

// ── Locations ──────────────────────────────────────────────────

export const DEMO_LOCATIONS: DemoLocation[] = [
  { id: 'BLOCK_A', name: 'Block A', population: 120 },
  { id: 'BLOCK_B', name: 'Block B', population: 150 },
  { id: 'LIBRARY', name: 'Library', population: 240 },
  { id: 'CANTEEN', name: 'Canteen', population: 180 },
  { id: 'ADMIN_BLOCK', name: 'Admin Block', population: 50 },
];
// ── Category Metadata ──────────────────────────────────────────

export const CATEGORY_META: Record<string, { label: string; color: string; bgColor: string; borderColor: string }> = {
  NETWORK: { label: 'Network', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
  ELECTRICAL: { label: 'Electrical', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' },
  WATER: { label: 'Water', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30' },
  FACILITIES: { label: 'Facilities', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
  SECURITY: { label: 'Security', color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' },
  OTHER: { label: 'Other', color: 'text-slate-400', bgColor: 'bg-slate-500/10', borderColor: 'border-slate-500/30' },
};

export const SEVERITY_META: Record<string, { color: string; bgColor: string; borderColor: string }> = {
  CRITICAL: { color: 'text-red-400', bgColor: 'bg-red-500/15', borderColor: 'border-red-500/30' },
  HIGH: { color: 'text-amber-400', bgColor: 'bg-amber-500/15', borderColor: 'border-amber-500/30' },
  MEDIUM: { color: 'text-blue-400', bgColor: 'bg-blue-500/15', borderColor: 'border-blue-500/30' },
  LOW: { color: 'text-green-400', bgColor: 'bg-green-500/15', borderColor: 'border-green-500/30' },
};

// ── Demo Incidents ─────────────────────────────────────────────

export const DEMO_INCIDENTS: DemoIncident[] = [
  {
    incidentId: 'INC-184',
    title: 'WiFi Outage — Block C',
    category: 'NETWORK',
    locationId: 'BLOCK_C',
    severity: 'CRITICAL',
    confidence: 'PROBABLE',
    status: 'ACTIVE',
    reportCount: 24,
    uniqueReporterCount: 18,
    locationPopulation: 100,
    estimatedImpact: 'HIGH',
    assignedTeam: 'IT Operations',
    fusion: { semanticSimilarity: 0.94, locationMatch: true, categoryMatch: true, timeCorrelation: true, evidenceSignal: true },
    reports: [
      'WiFi in Block C has stopped working since morning',
      'No internet in C block hostel',
      'Campus network is down near C-204',
      'The exam lab cannot connect to the network',
    ],
  },
  {
    incidentId: 'INC-201',
    title: 'Water Supply Interruption — Hostel 4',
    category: 'WATER',
    locationId: 'HOSTEL_4',
    severity: 'HIGH',
    confidence: 'HIGH',
    status: 'ACTIVE',
    reportCount: 17,
    uniqueReporterCount: 14,
    locationPopulation: 92,
    estimatedImpact: 'HIGH',
    assignedTeam: 'Facilities',
    fusion: { semanticSimilarity: 0.91, locationMatch: true, categoryMatch: true, timeCorrelation: true, evidenceSignal: false },
    reports: [
      'Water supply stopped in Hostel 4',
      'No water from taps on Hostel 4 second floor',
    ],
  },
  {
    incidentId: 'INC-219',
    title: 'Electrical Issue — Central Library',
    category: 'ELECTRICAL',
    locationId: 'CENTRAL_LIBRARY',
    severity: 'MEDIUM',
    confidence: 'PROBABLE',
    status: 'INVESTIGATING',
    reportCount: 8,
    uniqueReporterCount: 7,
    locationPopulation: 240,
    estimatedImpact: 'MEDIUM',
    assignedTeam: 'Electrical',
    fusion: { semanticSimilarity: 0.88, locationMatch: true, categoryMatch: true, timeCorrelation: true, evidenceSignal: false },
    reports: [
      'Library lights are flickering',
      'Power issue affecting the east side of library',
    ],
  },
  {
    incidentId: 'INC-225',
    title: 'Broken AC Units — Computer Lab',
    category: 'FACILITIES',
    locationId: 'COMPUTER_LAB',
    severity: 'LOW',
    confidence: 'CONFIRMED',
    status: 'IN_PROGRESS',
    reportCount: 5,
    uniqueReporterCount: 4,
    locationPopulation: 60,
    estimatedImpact: 'LOW',
    assignedTeam: 'Facilities',
    fusion: { semanticSimilarity: 0.85, locationMatch: true, categoryMatch: true, timeCorrelation: false, evidenceSignal: false },
    reports: [
      'AC not working in computer lab',
      'Computer lab is extremely hot, AC broken',
    ],
  },
];
