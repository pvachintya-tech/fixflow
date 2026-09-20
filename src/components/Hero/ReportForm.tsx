'use client';

import { motion } from 'framer-motion';

interface ReportFormProps {
  className?: string;
}

export default function ReportForm({ className = '' }: ReportFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`glass-strong rounded-2xl p-8 max-w-lg mx-auto w-full backdrop-blur-md bg-white/10 border border-white/20 shadow-xl ${className}`}
    >
      <h2 className="text-xl font-semibold text-white mb-6">Report a Problem</h2>
      
      <div className="space-y-4">
        <textarea 
          disabled
          placeholder="Describe the issue you're experiencing..."
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-slate-400 placeholder:text-slate-400/70 resize-none h-32 focus:outline-none cursor-not-allowed"
        />
        
        <div 
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-slate-400 cursor-not-allowed flex items-center justify-between"
        >
          <span>Select Location</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        <button 
          disabled
          className="w-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl py-3 font-medium cursor-not-allowed opacity-50 transition-colors mt-2"
        >
          Report Problem
        </button>

        <p className="text-center text-slate-500 text-sm mt-4">Form coming soon</p>
      </div>
    </motion.div>
  );
}
