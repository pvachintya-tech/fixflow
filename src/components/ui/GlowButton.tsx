'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: 'cyan' | 'amber';
}

const GlowButton = ({ children, onClick, href, className = '', variant = 'cyan' }: GlowButtonProps) => {
  const isCyan = variant === 'cyan';
  
  const baseClasses = `rounded-full px-8 py-3 text-white font-semibold inline-block transition-all shadow-lg ${className} ${
    isCyan 
      ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 hover:shadow-cyan-500/50' 
      : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:shadow-amber-500/50'
  }`;

  const motionProps = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  };

  if (href) {
    return (
      <motion.a 
        href={href} 
        className={baseClasses}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button 
      onClick={onClick} 
      className={baseClasses}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
};

export default GlowButton;
