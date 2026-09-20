'use client';

import { motion } from 'framer-motion';

interface FrameProps {
  progress: number;
  active: boolean;
}

export default function InterceptFrame({ active, progress: _progress }: FrameProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center px-6">
      <motion.h2 
        className="text-4xl md:text-5xl font-bold text-white mb-16 max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        FixFlow intercepts and understands the chaos.
      </motion.h2>

      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={active ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.2 }}
          className="relative flex items-center justify-center w-40 h-40"
        >
          {/* Outer glow */}
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse"></div>
          
          {/* Animated SVG Ring */}
          <motion.svg 
            viewBox="0 0 200 200" 
            className="absolute inset-0 w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <circle 
              cx="100" cy="100" r="80" 
              fill="none" 
              stroke="#22d3ee" 
              strokeWidth="4"
              strokeDasharray="40 20 10 20"
              className="opacity-80"
            />
            <circle 
              cx="100" cy="100" r="90" 
              fill="none" 
              stroke="#06b6d4" 
              strokeWidth="1"
              strokeDasharray="5 15"
              className="opacity-40"
            />
          </motion.svg>
          
          <span className="text-cyan-400 font-bold tracking-widest z-10 text-xl">FIX</span>
        </motion.div>
        
        <motion.div 
          className="mt-8 text-cyan-400 text-sm tracking-widest uppercase font-semibold"
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 }}
        >
          Incident Fusion Engine
        </motion.div>
      </div>
    </div>
  );
}
