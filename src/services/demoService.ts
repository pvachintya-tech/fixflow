// FixFlow Demo Service
// Deterministic AI simulation for the interactive demo.
// TODO: Replace each function with real API calls when backend is connected.

import { API_CONFIG } from '../config/apiConfig';
import { getIdToken } from './authService';
import type { AnalysisResult, DemoIncident, LocationConflict } from '../data/demoData';
import { DEMO_INCIDENTS, DEMO_LOCATIONS } from '../data/demoData';

// ── Keyword Maps ───────────────────────────────────────────────

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  NETWORK: ['wifi', 'internet', 'network', 'connection', 'connect', 'online', 'offline', 'bandwidth', 'router', 'ethernet', 'portal', 'loading'],
  ELECTRICAL: ['power', 'electric', 'light', 'flickering', 'outage', 'voltage', 'generator', 'switch', 'wiring', 'blackout'],
  WATER: ['water', 'tap', 'supply', 'leak', 'pipe', 'plumbing', 'drain', 'flooding', 'shower', 'toilet'],
  FACILITIES: ['ac', 'air conditioning', 'heating', 'broken', 'maintenance', 'door', 'window', 'elevator', 'lift', 'cleaning', 'hot', 'cold', 'temperature'],
  SECURITY: ['theft', 'stolen', 'security', 'lock', 'cctv', 'suspicious', 'break-in', 'trespass'],
};

const LOCATION_KEYWORDS: Record<string, string[]> = {
  BLOCK_A: ['block a', 'block-a', 'a block', 'a-block'],
  BLOCK_B: ['block b', 'block-b', 'b block', 'b-block'],
  BLOCK_C: ['block c', 'block-c', 'c block', 'c-block', 'c-204'],
  BLOCK_D: ['block d', 'block-d', 'd block', 'd-block'],
  BLOCK_E: ['block e', 'block-e', 'e block', 'e-block'],
  HOSTEL_1: ['hostel 1', 'hostel-1', 'hostel block 1'],
  HOSTEL_2: ['hostel 2', 'hostel-2', 'hostel block 2'],
  HOSTEL_3: ['hostel 3', 'hostel-3', 'hostel block 3'],
  HOSTEL_4: ['hostel 4', 'hostel-4', 'hostel block 4'],
  CENTRAL_LIBRARY: ['library', 'central library'],
  ENGINEERING_BLOCK: ['engineering', 'engineering block'],
  COMPUTER_LAB: ['computer lab', 'comp lab'],
  ADMIN_BUILDING: ['admin', 'administration', 'admin building'],
};

const AREA_KEYWORDS: Record<string, string> = {
  'exam lab': 'Exam Lab',
  'exam': 'Exam Lab',
  'lab': 'Lab Area',
  'hostel': 'Hostel Area',
  'second floor': '2nd Floor',
  'third floor': '3rd Floor',
  'east side': 'East Wing',
  'west side': 'West Wing',
  'ground floor': 'Ground Floor',
  'library': 'Library',
  'cafeteria': 'Cafeteria',
};

// ── Category Detection ─────────────────────────────────────────

function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  let bestCategory = 'OTHER';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.filter(kw => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}

// ── Location Detection from Text ───────────────────────────────

function detectLocationInText(text: string): string | null {
  const lower = text.toLowerCase();

  for (const [locationId, keywords] of Object.entries(LOCATION_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return locationId;
      }
    }
  }
  return null;
}

// ── Affected Area Detection ────────────────────────────────────

function detectAffectedArea(text: string, locationId: string): string {
  const lower = text.toLowerCase();

  for (const [keyword, area] of Object.entries(AREA_KEYWORDS)) {
    if (lower.includes(keyword)) {
      return area;
    }
  }

  const loc = DEMO_LOCATIONS.find(l => l.id === locationId);
  return loc ? loc.name : 'General Area';
}

// ── Urgency Detection ──────────────────────────────────────────

function detectUrgency(text: string, category: string): 'HIGH' | 'MEDIUM' | 'LOW' {
  const lower = text.toLowerCase();
  const urgentKeywords = ['exam', 'emergency', 'urgent', 'critical', 'completely', 'cannot', "can't", 'broken', 'stopped', 'down', 'outage'];
  const urgentCount = urgentKeywords.filter(kw => lower.includes(kw)).length;

  if (urgentCount >= 2 || category === 'NETWORK' || category === 'SECURITY') return 'HIGH';
  if (urgentCount >= 1 || category === 'ELECTRICAL' || category === 'WATER') return 'MEDIUM';
  return 'LOW';
}

// ── Generate Summary ───────────────────────────────────────────

function generateSummary(text: string, category: string, locationId: string, affectedArea: string): string {
  const loc = DEMO_LOCATIONS.find(l => l.id === locationId);
  const locationName = loc?.name ?? locationId;
  const categoryLabel = category.charAt(0) + category.slice(1).toLowerCase();

  if (text.length < 60) return text;

  return `${categoryLabel} issue at ${locationName}${affectedArea !== locationName ? ` affecting ${affectedArea}` : ''}`;
}

// ── Incident Matching ──────────────────────────────────────────

function findMatchingIncident(category: string, locationId: string, incidents: DemoIncident[]): DemoIncident | null {
  // Match by category + location (simulates semantic similarity)
  const match = incidents.find(
    inc => inc.category === category && inc.locationId === locationId
  );
  return match ?? null;
}

// ── Location Conflict Detection ────────────────────────────────

function checkLocationConflict(text: string, selectedLocationId: string): LocationConflict | null {
  const mentionedLocationId = detectLocationInText(text);

  if (mentionedLocationId && mentionedLocationId !== selectedLocationId) {
    const mentioned = DEMO_LOCATIONS.find(l => l.id === mentionedLocationId);
    const selected = DEMO_LOCATIONS.find(l => l.id === selectedLocationId);

    if (mentioned && selected) {
      return {
        mentionedLocation: mentioned.name,
        selectedLocation: selected.name,
      };
    }
  }
  return null;
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Analyze a complaint and return structured analysis + incident match.
 *
 * TODO: Replace with real API call:
 * POST ${API_CONFIG.bedrockEndpoint}/complaints/analyze
 * Body: { text, locationId }
 * Headers: { 'x-api-key': API_CONFIG.apiKey }
 */
export async function analyzeComplaint(
  text: string,
  selectedLocationId: string,
): Promise<AnalysisResult> {
  // Simulate API latency
  if (API_CONFIG.useMockData) {
    const category = detectCategory(text);
    const detectedLocation = detectLocationInText(text) ?? selectedLocationId;
    const affectedArea = detectAffectedArea(text, detectedLocation);
    const urgency = detectUrgency(text, category);
    const summary = generateSummary(text, category, detectedLocation, affectedArea);
    const locationConflict = checkLocationConflict(text, selectedLocationId);
    const matchedIncident = findMatchingIncident(category, detectedLocation, DEMO_INCIDENTS);

    const locationObj = DEMO_LOCATIONS.find(l => l.id === detectedLocation);

    return {
      category,
      location: locationObj?.name ?? detectedLocation,
      affectedArea,
      urgency,
      summary,
      matchedIncident,
      isNewIncident: !matchedIncident,
      locationConflict,
    };
  }

  const token = await getIdToken();

  if (!token) {
    throw new Error('Please sign in before submitting a complaint.');
  }

  const createResponse = await fetch(
    `${API_CONFIG.apiBaseUrl}/complaints`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        text,
        location: selectedLocationId,
      }),
    },
  );

  const createData = await createResponse.json();

  if (!createResponse.ok) {
    throw new Error(
      createData.message || `Complaint submission failed (${createResponse.status}).`,
    );
  }

  const aiAnalysis = createData.aiAnalysis ?? {};
  const locationId =
    aiAnalysis.locationFromText || selectedLocationId;

  let matchedIncident: DemoIncident | null = null;
  let liveIncident: any = null;

  const incidentsResponse = await fetch(
    `${API_CONFIG.apiBaseUrl}/incidents`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    },
  );

  if (incidentsResponse.ok) {
    const incidentsData = await incidentsResponse.json();
    liveIncident = (incidentsData.incidents ?? []).find(
      (item: any) => item.incidentId === createData.incidentId,
    );

    if (
      liveIncident &&
      createData.fusion?.decision === 'SAME_INCIDENT'
    ) {
      matchedIncident = {
        incidentId: liveIncident.incidentId,
        title: `${liveIncident.category} Incident — ${liveIncident.location}`,
        category: liveIncident.category ?? 'OTHER',
        locationId: liveIncident.location ?? locationId,
        severity: liveIncident.severity ?? 'LOW',
        confidence: liveIncident.fusionConfidence ?? 'LOW',
        status: liveIncident.status ?? 'UNCONFIRMED',
        reportCount: Number(liveIncident.reportCount ?? 1),
        uniqueReporterCount: Number(liveIncident.uniqueReporterCount ?? 1),
        locationPopulation: 0,
        estimatedImpact: liveIncident.impactLevel ?? 'LOW',
        assignedTeam: 'Unassigned',
        fusion: {
          semanticSimilarity: Number(
            liveIncident.fusion?.similarityScore ?? 0,
          ),
          locationMatch: true,
          categoryMatch: true,
          timeCorrelation: true,
          evidenceSignal: false,
        },
        reports: liveIncident.complaintIds ?? [],
      };
    }
  }

  const selectedLocation = DEMO_LOCATIONS.find(
    (location) => location.id === selectedLocationId,
  );

  const mentionedLocation = DEMO_LOCATIONS.find(
    (location) => location.id === aiAnalysis.locationFromText,
  );

  const locationConflict =
    mentionedLocation &&
    mentionedLocation.id !== selectedLocationId &&
    selectedLocation
      ? {
          mentionedLocation: mentionedLocation.name,
          selectedLocation: selectedLocation.name,
        }
      : null;

  const incidentSeverity = liveIncident?.severity;

  const urgency =
    incidentSeverity === 'CRITICAL' || incidentSeverity === 'HIGH'
      ? 'HIGH'
      : incidentSeverity === 'MEDIUM'
        ? 'MEDIUM'
        : aiAnalysis.urgencySignals?.length
          ? 'HIGH'
          : 'LOW';

  return {
    category: aiAnalysis.category ?? 'OTHER',
    location:
      selectedLocation?.name ??
      mentionedLocation?.name ??
      locationId,
    affectedArea:
      aiAnalysis.affectedArea ??
      selectedLocation?.name ??
      locationId,
    urgency,
    summary: aiAnalysis.summary ?? text,
    matchedIncident,
    isNewIncident: createData.fusion?.decision !== 'SAME_INCIDENT',
    locationConflict,
  };
}
