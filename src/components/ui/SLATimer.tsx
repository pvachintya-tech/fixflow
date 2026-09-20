'use client';

import { motion } from 'framer-motion';

interface SLATimerProps {
  hours: number;
  minutes: number;
  status: 'healthy' | 'warning' | 'breached';
}

const SLATimer = ({ hours, minutes, status }: SLATimerProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return '#22c55e'; // green-500
      case 'warning': return '#f59e0b'; // amber-500
      case 'breached': return '#ef4444'; // red-500
      default: return '#22c55e';
    }
  };

  const circumference = 2 * Math.PI * 40; // r = 40
  // Simplified calculation for demo purposes
  const totalMinutes = hours * 60 + minutes;
  const maxMinutes = 24 * 60; 
  const progress = Math.max(0, Math.min(1, totalMinutes / maxMinutes));
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="6"
        />
        <motion.circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke={getStatusColor()}
          strokeWidth="6"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col items-center justify-center font-mono text-white">
        <span className="text-lg font-bold leading-none">{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}</span>
        <span className="text-[10px] text-white/50 uppercase tracking-wider mt-1">SLA</span>
      </div>
    </div>
  );
};

export default SLATimer;
