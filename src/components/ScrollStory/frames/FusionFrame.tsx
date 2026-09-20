'use client';

import { motion } from 'framer-motion';

interface FrameProps {
  progress: number;
  active: boolean;
}

const tickets = [
  "WiFi down",
  "No internet",
  "Network error",
  "Connection dropped",
  "Offline"
];

export default function FusionFrame({ active, progress }: FrameProps) {
  // Use progress to drive the tickets into the center
  // progress goes 0 to 1 during this frame's lifecycle
  
  return (
    <div className="w-full flex flex-col items-center justify-center text-center px-6 relative h-full">
      <motion.h2 
        className="absolute top-32 text-4xl md:text-5xl font-bold text-white max-w-3xl"
        initial={{ opacity: 0, y: -20 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        AI-driven semantic and spatial fusion.
      </motion.h2>

      <div className="relative flex items-center justify-center w-full h-[400px]">
        {/* Center Engine */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl"></div>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="10 5" />
            </svg>
          </div>
        </div>

        {/* Floating Tickets */}
        {tickets.map((ticket, i) => {
          const angle = (i / tickets.length) * Math.PI * 2;
          const radiusStart = 250;
          const radiusEnd = 0;
          
          // Custom interpolation based on progress
          const currentRadius = radiusStart - (radiusStart - radiusEnd) * Math.min(progress * 1.5, 1);
          const opacity = active ? (progress > 0.8 ? 0 : 1) : 0;
          
          const x = Math.cos(angle) * currentRadius;
          const y = Math.sin(angle) * currentRadius;
          const rotation = angle * (180 / Math.PI) + 90;

          return (
            <motion.div
              key={i}
              className="absolute bg-slate-800/60 border border-slate-700 backdrop-blur-md rounded-md px-3 py-1.5 text-xs text-slate-300 z-20"
              style={{
                x,
                y,
                rotate: rotation,
                opacity
              }}
              transition={{ type: "tween" }}
            >
              {ticket}
            </motion.div>
          );
        })}
      </div>

      <div className="absolute bottom-32 flex flex-col items-center gap-3">
        <motion.div 
          className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-mono"
          initial={{ opacity: 0, y: 20 }}
          animate={active && progress > 0.3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        >
          Location match: BLOCK_C
        </motion.div>
        <motion.div 
          className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-mono"
          initial={{ opacity: 0, y: 20 }}
          animate={active && progress > 0.5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        >
          Semantic similarity: 0.94
        </motion.div>
        <motion.div 
          className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-full text-sm font-mono"
          initial={{ opacity: 0, y: 20 }}
          animate={active && progress > 0.7 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        >
          Time correlation detected
        </motion.div>
      </div>
    </div>
  );
}
