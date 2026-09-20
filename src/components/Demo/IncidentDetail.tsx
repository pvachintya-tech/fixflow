import { motion } from 'framer-motion';
import type { DemoIncident } from '../../data/demoData';

interface IncidentDetailProps {
  incident: DemoIncident;
  onBack: () => void;
}

const TrueFalseIcon = ({ isTrue }: { isTrue: boolean }) => isTrue ? (
  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
) : (
  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

export default function IncidentDetail({ incident, onBack }: IncidentDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto space-y-6 pb-20"
    >
      <button 
        onClick={onBack}
        className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Dashboard
      </button>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-white/10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
              {incident.severity}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              {incident.status}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{incident.title}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-white font-semibold text-lg">{incident.reportCount}</span> reports
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600 hidden md:block" />
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-white font-semibold text-lg">{incident.uniqueReporterCount}</span> unique reporters
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600 hidden md:block" />
            <div className="flex items-center gap-2 text-amber-200/80">
              <span className="text-amber-400 font-semibold text-lg">{incident.locationPopulation}+</span> potentially affected
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-slate-900/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Fusion Signals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm text-slate-300">Semantic Similarity</span>
              <span className="text-cyan-400 font-mono font-semibold">{incident.fusion.semanticSimilarity}%</span>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm text-slate-300">Location Match</span>
              <TrueFalseIcon isTrue={incident.fusion.locationMatch} />
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm text-slate-300">Category Match</span>
              <TrueFalseIcon isTrue={incident.fusion.categoryMatch} />
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm text-slate-300">Time Correlation</span>
              <TrueFalseIcon isTrue={incident.fusion.timeCorrelation} />
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between md:col-span-2">
              <span className="text-sm text-slate-300">Evidence Signal</span>
              <TrueFalseIcon isTrue={incident.fusion.evidenceSignal} />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Related Reports</h3>
          <div className="space-y-3">
            {incident.reports.map((report, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-300">
                "{report}"
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
