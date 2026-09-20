'use client';

import type { ReactNode, MouseEvent } from 'react';
import { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

const GlowCard = ({ children, className = '' }: GlowCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(255,255,255,0.1), transparent 40%)`
  );

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`glass rounded-2xl relative overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background }}
      />
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
};

export default GlowCard;
