'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FrameProps {
  progress: number;
  active: boolean;
}

interface TicketEntry {
  id: number;
  text: string;
  badge?: 'SLA BREACHED' | 'DUPLICATE';
}

const complaints = [
  "WiFi down in Block C",
  "No internet access",
  "Network error",
  "Can't connect to server",
  "Email not working",
  "Printer offline 3rd floor",
  "AC broken Room 204"
];

export default function StatusQuoFrame({ active, progress: _progress }: FrameProps) {
  const [entries, setEntries] = useState<TicketEntry[]>([]);
  
  useEffect(() => {
    if (!active) return;
    
    let counter = 0;
    const interval = setInterval(() => {
      if (counter >= 20) {
        clearInterval(interval);
        return;
      }
      
      const newEntry: TicketEntry = {
        id: Date.now() + counter,
        text: complaints[Math.floor(Math.random() * complaints.length)],
      };
      
      const r = Math.random();
      if (r < 0.2) newEntry.badge = 'SLA BREACHED';
      else if (r < 0.4) newEntry.badge = 'DUPLICATE';
      
      setEntries(prev => [newEntry, ...prev].slice(0, 8)); // keep top 8 for visual
      counter++;
    }, 400);
    
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
      <div className="w-full md:w-1/2">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Organizations are drowning in operational noise.
        </motion.h2>
        <motion.p 
          className="text-lg text-slate-400"
          initial={{ opacity: 0, y: 20 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Noise isn't just volume—it's redundancy. It's 50 different employees reporting the same downed server, fragmented alerts across departments, and manual triage bottlenecks.
        </motion.p>
      </div>
      
      <div className="w-full md:w-1/2">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 shadow-2xl overflow-hidden h-[400px] flex flex-col backdrop-blur-md">
          <div className="text-xs font-semibold text-slate-500 mb-4 tracking-wider uppercase">Legacy Ticket Queue</div>
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence>
              {entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: 20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-3 bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 backdrop-blur-sm"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-slate-200 text-sm">{entry.text}</span>
                    <span className="text-slate-500 text-xs">Just now</span>
                  </div>
                  {entry.badge && (
                    <div className="mt-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        entry.badge === 'SLA BREACHED' 
                          ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' 
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}>
                        {entry.badge}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
