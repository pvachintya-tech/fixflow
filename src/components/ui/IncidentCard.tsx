'use client';

import { motion } from 'framer-motion';
import GlowCard from './GlowCard';

interface IncidentCardProps {
  incidentId: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reportCount: number;
  location: string;
  status: string;
  className?: string;
}

const IncidentCard = ({ incidentId, title, severity, reportCount, location, status, className = '' }: IncidentCardProps) => {
  const getSeverityColors = () => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-500 border border-red-500/50';
      case 'HIGH': return 'bg-amber-500/20 text-amber-500 border border-amber-500/50';
      case 'MEDIUM': return 'bg-blue-500/20 text-blue-500 border border-blue-500/50';
      case 'LOW': return 'bg-green-500/20 text-green-500 border border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={className}
    >
      <GlowCard className="border border-white/10 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs text-white/50 font-mono mb-1 block">#{incidentId}</span>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-bold ${getSeverityColors()}`}>
            {severity}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
          <div>
            <span className="text-white/50 block text-xs">Location</span>
            <span>{location}</span>
          </div>
          <div>
            <span className="text-white/50 block text-xs">Status</span>
            <span>{status}</span>
          </div>
          <div>
            <span className="text-white/50 block text-xs">Reports</span>
            <span>{reportCount}</span>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
};

export default IncidentCard;
