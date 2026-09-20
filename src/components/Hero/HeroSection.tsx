'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ParticleCanvas from './ParticleCanvas';
import TypewriterText from './TypewriterText';

export default function HeroSection() {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  const handlePhaseChange = useCallback((newPhase: number) => {
    setPhase(newPhase as 0 | 1 | 2 | 3);
  }, []);

  const handleComplete = useCallback(() => {
    setAnimationComplete(true);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-950">
      <ParticleCanvas phase={phase} />
      
      {/* Text sits above the ring — offset upward by -160px */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4">
        <TypewriterText 
          onPhaseChange={handlePhaseChange} 
          onComplete={handleComplete} 
        />
      </div>

      {animationComplete && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 flex flex-col items-center"
        >
          <span className="text-sm mb-2 font-medium tracking-wider">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
