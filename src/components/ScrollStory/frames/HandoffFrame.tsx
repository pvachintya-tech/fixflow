'use client';

import { motion } from 'framer-motion';
import ReportForm from '../../Hero/ReportForm';

interface FrameProps {
  progress: number;
  active: boolean;
}

export default function HandoffFrame({ active, progress: _progress }: FrameProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center px-6 text-center overflow-y-auto max-h-screen py-12">
      <motion.h2 
        className="text-4xl md:text-5xl font-bold text-white mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        Stop sorting. Start solving.
      </motion.h2>

      {/* Two-column layout: Ops panel + Report form */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-stretch gap-6 mb-10">
        {/* Operations Panel */}
        <motion.div
          className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl text-left"
          initial={{ opacity: 0, x: -30 }}
          animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-4 border-b border-slate-800 pb-2">
            Operations Status
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Assigned Team</span>
              <span className="text-white font-medium text-sm">Network Infrastructure</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Status</span>
              <span className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded text-xs font-semibold">ACTIVE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">SLA</span>
              <span className="text-slate-200 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                2h 45m remaining
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Priority</span>
              <span className="text-red-400 text-sm font-semibold">P1 — Critical</span>
            </div>
          </div>
        </motion.div>

        {/* Report Form */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 30 }}
          animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <ReportForm />
        </motion.div>
      </div>

      <motion.a
        href="/admin"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-bold rounded-full px-8 py-4 text-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ delay: 0.4 }}
      >
        Enter Admin Command Center
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </motion.a>
    </div>
  );
}
