import { motion } from 'framer-motion';
import type { LocationConflict as ILocationConflict } from '../../data/demoData';

interface LocationConflictProps {
  conflict: ILocationConflict;
}

export default function LocationConflict({ conflict }: LocationConflictProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex gap-4"
    >
      <div className="shrink-0 text-amber-500 mt-0.5">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div>
        <h3 className="text-amber-500 font-semibold mb-1">Location Conflict Detected</h3>
        <p className="text-amber-200/80 text-sm mb-1">
          The complaint mentions <strong className="text-amber-100">{conflict.mentionedLocation}</strong>, 
          but the selected location is <strong className="text-amber-100">{conflict.selectedLocation}</strong>.
        </p>
        <p className="text-amber-200/60 text-xs">Please verify the location before submitting.</p>
      </div>
    </motion.div>
  );
}
