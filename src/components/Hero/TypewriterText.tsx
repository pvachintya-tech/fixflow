'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
  onPhaseChange: (phase: number) => void;
  onComplete: () => void;
}

export default function TypewriterText({ onPhaseChange, onComplete }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    
    const delay = (ms: number) => new Promise<void>(r => {
      const id = setTimeout(r, ms);
      if (cancelled) clearTimeout(id);
    });
    
    const type = async () => {
      // Phase 1: Chaos
      onPhaseChange(1);
      const str1 = "Convert Chaos";
      for (let i = 0; i <= str1.length; i++) {
        if (cancelled) return;
        setDisplayedText(str1.slice(0, i));
        await delay(50);
      }

      await delay(850); // Wait until 1.5s total approx

      // Phase 2: To Order
      onPhaseChange(2);
      for (let i = str1.length; i >= 0; i--) {
        if (cancelled) return;
        setDisplayedText(str1.slice(0, i));
        await delay(30);
      }
      
      const str2 = "To Order";
      for (let i = 0; i <= str2.length; i++) {
        if (cancelled) return;
        setDisplayedText(str2.slice(0, i));
        await delay(50);
      }

      await delay(1800); // Let particles fully converge before phase 3

      // Phase 3: FixFlow
      onPhaseChange(3);
      for (let i = str2.length; i >= 0; i--) {
        if (cancelled) return;
        setDisplayedText(str2.slice(0, i));
        await delay(30);
      }
      
      const str3 = "FixFlow";
      for (let i = 0; i <= str3.length; i++) {
        if (cancelled) return;
        setDisplayedText(str3.slice(0, i));
        await delay(50);
      }

      await delay(500);
      if (!cancelled) {
        setIsComplete(true);
        onComplete();
      }
    };

    type();

    return () => { cancelled = true; };
  }, [onPhaseChange, onComplete]);

  return (
    <motion.div
      initial={{ y: 0, scale: 1 }}
      animate={isComplete ? { y: -100, scale: 0.9 } : { y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="text-6xl md:text-8xl font-bold text-white text-center relative z-10"
    >
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block ml-1"
      >
        |
      </motion.span>
    </motion.div>
  );
}
