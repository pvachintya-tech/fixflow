import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEMO_LOCATIONS, CATEGORY_META, SEVERITY_META } from '../../data/demoData';
import { API_CONFIG } from '../../config/apiConfig';
import { getIdToken } from '../../services/authService';
import type { DemoIncident } from '../../data/demoData';

interface DemoDashboardProps {
  onSubmitComplaint: () => void;
}

function getLocationName(id: string) {
  return DEMO_LOCATIONS.find(loc => loc.id === id)?.name || id;
}

function mapLiveIncident(raw: any): DemoIncident {
  const locationId = raw.location ?? 'OTHER';
  const location = DEMO_LOCATIONS.find((loc) => loc.id === locationId);

  return {
    incidentId: raw.incidentId,
    title: `${raw.category ?? 'OTHER'} Incident — ${location?.name ?? locationId}`,
    category: raw.category ?? 'OTHER',
    locationId,
    severity: raw.severity ?? 'LOW',
    confidence: raw.fusionConfidence ?? 'LOW',
    status: raw.status ?? 'UNCONFIRMED',
    reportCount: Number(raw.reportCount ?? 0),
    uniqueReporterCount: Number(raw.uniqueReporterCount ?? 0),
    locationPopulation: location?.population ?? 0,
    estimatedImpact: raw.impactLevel ?? 'LOW',
    assignedTeam: 'Unassigned',
    fusion: {
      semanticSimilarity: Number(raw.fusion?.similarityScore ?? 0),
      locationMatch: raw.fusion?.decision === 'SAME_INCIDENT',
      categoryMatch: true,
      timeCorrelation: true,
      evidenceSignal: false,
    },
    reports: raw.complaintIds ?? [],
  };
}

function ExpandedDetails({ incident }: { incident: DemoIncident }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="pt-4 space-y-4">
        {/* Team & Impact */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-xs text-slate-500 mb-1">Assigned Team</div>
            <div className="text-sm text-white font-medium">{incident.assignedTeam}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-xs text-slate-500 mb-1">Impact</div>
            <div className="text-sm text-white font-medium">{incident.estimatedImpact}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-xs text-slate-500 mb-1">Unique Reporters</div>
            <div className="text-sm text-white font-medium">{incident.uniqueReporterCount}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-xs text-slate-500 mb-1">Confidence</div>
            <div className="text-sm text-white font-medium">{incident.confidence}</div>
          </div>
        </div>

        {/* Fusion Signals */}
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Fusion Signals</div>
          <div className="flex flex-wrap gap-2">
            <FusionBadge label="Semantic" value={`${Math.round(incident.fusion.semanticSimilarity * 100)}%`} active />
            <FusionBadge label="Location" value={incident.fusion.locationMatch ? '✓' : '✗'} active={incident.fusion.locationMatch} />
            <FusionBadge label="Category" value={incident.fusion.categoryMatch ? '✓' : '✗'} active={incident.fusion.categoryMatch} />
            <FusionBadge label="Time" value={incident.fusion.timeCorrelation ? '✓' : '✗'} active={incident.fusion.timeCorrelation} />
            <FusionBadge label="Evidence" value={incident.fusion.evidenceSignal ? '✓' : '✗'} active={incident.fusion.evidenceSignal} />
          </div>
        </div>

        {/* Related Reports */}
        {incident.reports.length > 0 && (
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">
              Related Reports ({incident.reports.length})
            </div>
            <div className="space-y-2">
              {incident.reports.map((report, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-sm text-slate-300"
                >
                  "{report}"
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function FusionBadge({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
      active
        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
        : 'bg-slate-800/50 border-slate-700/50 text-slate-500'
    }`}>
      {label}
      <span className="font-bold">{value}</span>
    </span>
  );
}

export default function DemoDashboard({ onSubmitComplaint }: DemoDashboardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<DemoIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        setLoading(true);
        setError('');

        const token = await getIdToken();

        if (!token) {
          throw new Error('Please sign in before viewing incidents.');
        }

        const res = await fetch(`${API_CONFIG.apiBaseUrl}/incidents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || `Failed to load incidents (${res.status}).`
          );
        }

        setIncidents((data.incidents ?? []).map(mapLiveIncident));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Unable to load incidents.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, []);

  const activeIncidents = incidents.filter(
    (incident) => incident.status !== 'RESOLVED'
  );

  const activeIncidentsCount = activeIncidents.length;

  const totalReportsCount = activeIncidents.reduce(
    (acc, inc) => acc + inc.reportCount,
    0
  );

  const uniqueLocations = new Set(
    activeIncidents.map((inc) => inc.locationId)
  );

  const locationsAffectedCount = uniqueLocations.size;

  const estStudentsAffected = Array.from(uniqueLocations).reduce(
    (acc, locationId) =>
      acc +
      (DEMO_LOCATIONS.find((loc) => loc.id === locationId)?.population ?? 0),
    0
  );

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Incidents', value: activeIncidentsCount },
          { label: 'Total Reports', value: totalReportsCount },
          { label: 'Locations Affected', value: locationsAffectedCount },
          { label: 'Est. Students Affected', value: `${estStudentsAffected}+` },
        ].map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center"
          >
            <div className="text-3xl font-bold text-cyan-400 mb-2">{kpi.value}</div>
            <div className="text-sm text-slate-400">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-white">Active Incidents</h2>

      {/* Incident Cards */}
      {loading && (
        <div className="text-center text-slate-400 py-10">
          Loading live incidents…
        </div>
      )}

      {error && !loading && (
        <div className="text-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-5">
          {error}
        </div>
      )}

      {!loading && !error && activeIncidents.length === 0 && (
        <div className="text-center text-slate-400 py-10">
          No active incidents.
        </div>
      )}

      {!loading && !error && activeIncidents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeIncidents.map((incident, idx) => {
          const categoryMeta = CATEGORY_META[incident.category];
          const severityMeta = SEVERITY_META[incident.severity];
          const isExpanded = expandedId === incident.incidentId;

          return (
            <motion.div
              key={incident.incidentId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
              onClick={() => toggleExpand(incident.incidentId)}
              className={`bg-white/5 backdrop-blur-xl border rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-colors ${
                isExpanded ? 'border-cyan-500/40' : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Header badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${severityMeta?.bgColor || ''} ${severityMeta?.color || 'text-slate-300'} border ${severityMeta?.borderColor || 'border-slate-700'}`}>
                  {incident.severity}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${categoryMeta?.bgColor || ''} ${categoryMeta?.color || 'text-slate-300'} border ${categoryMeta?.borderColor || 'border-slate-700'}`}>
                  {categoryMeta?.label || incident.category}
                </span>
                <span className="ml-auto px-2 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {incident.status}
                </span>
              </div>

              {/* Title & Location */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{incident.title}</h3>
                <p className="text-slate-400 text-sm">{getLocationName(incident.locationId)}</p>
              </div>

              {/* Stats row */}
              <div className="mt-auto pt-4 border-t border-white/5 text-sm text-slate-300 flex items-center justify-between">
                <span>
                  <span className="font-medium text-white">{incident.reportCount}</span> reports • <span className="font-medium text-white">{incident.locationPopulation}+</span> potentially affected
                </span>
                {/* Expand indicator */}
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-slate-500"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.span>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && <ExpandedDetails incident={incident} />}
              </AnimatePresence>
            </motion.div>
          );
        })}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={onSubmitComplaint}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6 py-3 rounded-full font-medium shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105 active:scale-95 z-50 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        Submit New Complaint
      </button>
    </div>
  );
}
