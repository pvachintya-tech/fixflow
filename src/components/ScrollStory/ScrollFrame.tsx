'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ScrollFrameProps {
  children: ReactNode;
  active: boolean;
  progress: number;
  className?: string;
}

export default function ScrollFrame({ children, active, progress: _progress, className = '' }: ScrollFrameProps) {
  return (
    <motion.div
      className={`absolute inset-0 flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none'
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
