'use client';

import { motion } from 'framer-motion';

interface FrameProps {
  progress: number;
  active: boolean;
}

export default function ClarityFrame({ active, progress: _progress }: FrameProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center px-6">
      <motion.h2 
        className="text-4xl md:text-5xl font-bold text-white mb-16 text-center max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-cyan-400">184</span> fragmented complaints. <br className="hidden md:block"/> <span className="text-cyan-400">1</span> actionable incident.
      </motion.h2>

      <motion.div
        className="w-full max-w-2xl bg-slate-900/60 border border-cyan-500/30 rounded-xl p-6 shadow-[0_0_30px_rgba(34,211,238,0.15)] backdrop-blur-xl relative overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={active ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
        
        <div className="flex justify-between items-start mb-4">
          <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-2 py-0.5 rounded-full font-bold tracking-wide">
            CRITICAL
          </span>
          <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs px-2 py-0.5 rounded-full font-bold tracking-wide flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            ACTIVE
          </span>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2">INC-184 — Block C Network Outage</h3>
        
        <div className="flex flex-wrap items-center gap-3 text-slate-400 text-sm mb-6">
          <span>184 reports</span>
          <span className="text-slate-600">•</span>
          <span>18 unique reporters</span>
          <span className="text-slate-600">•</span>
          <span>Est. 500 affected</span>
        </div>
        
        <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Block C, Campus Main
          </div>
        </div>
      </motion.div>
    </div>
  );
}
