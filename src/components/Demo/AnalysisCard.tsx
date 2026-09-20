import { motion } from 'framer-motion';
import LocationConflict from './LocationConflict';
import type { AnalysisResult, DemoIncident } from '../../data/demoData';
import { CATEGORY_META } from '../../data/demoData';

interface AnalysisCardProps {
  result: AnalysisResult;
  onSubmitAnother: () => void;
  onViewIncident: (incident: DemoIncident) => void;
}

const URGENCY_COLORS: Record<string, string> = {
  HIGH: 'bg-red-500/20 text-red-400 border-red-500/30',
  MEDIUM: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  LOW: 'bg-green-500/20 text-green-400 border-green-500/30'
};

export default function AnalysisCard({ result, onSubmitAnother, onViewIncident }: AnalysisCardProps) {
  const categoryColor = (CATEGORY_META as any)[result.category]?.color || 'bg-slate-800 text-slate-300';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {result.locationConflict && (
        <LocationConflict conflict={result.locationConflict} />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            AI Analysis Complete
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-400 mb-1">Category</div>
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${categoryColor}`}>
                {result.category}
              </span>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Location</div>
              <div className="font-medium text-white">{result.location}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Affected Area</div>
              <div className="font-medium text-white">{result.affectedArea}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Urgency</div>
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${URGENCY_COLORS[result.urgency]}`}>
                {result.urgency}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 mb-1">Summary</div>
            <p className="text-sm text-slate-200 bg-white/5 p-3 rounded-xl border border-white/5">
              {result.summary}
            </p>
          </div>
        </div>

        {result.matchedIncident && (
          <div className="p-6 bg-cyan-900/20 border-t border-cyan-500/20">
            <div className="text-cyan-400 text-sm font-medium mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Related to existing incident
            </div>
            <button 
              onClick={() => onViewIncident(result.matchedIncident!)}
              className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-colors flex justify-between items-center group"
            >
              <div>
                <h4 className="text-white font-medium mb-1">{result.matchedIncident.title}</h4>
                <div className="text-xs text-slate-400">
                  {result.matchedIncident.reportCount + 1} reports total • {result.matchedIncident.locationPopulation}+ affected
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {result.isNewIncident && (
          <div className="p-4 bg-green-900/20 border-t border-green-500/20 text-green-400 text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            New incident created
          </div>
        )}

        <div className="p-6 border-t border-white/10">
          <button
            onClick={onSubmitAnother}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-colors border border-white/5"
          >
            Submit Another Complaint
          </button>
        </div>
      </motion.div>
    </div>
  );
}
