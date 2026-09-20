import { useState } from 'react';
import { motion } from 'framer-motion';
import { DEMO_LOCATIONS } from '../../data/demoData';

interface ComplaintFormProps {
  onAnalyze: (text: string, locationId: string) => void;
  onBack: () => void;
}

export default function ComplaintForm({ onAnalyze, onBack }: ComplaintFormProps) {
  const [text, setText] = useState("WiFi has been completely down in Block C since morning and students in the exam lab cannot connect.");
  const [locationId, setLocationId] = useState('BLOCK_C');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8"
    >
      <button 
        onClick={onBack}
        className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back
      </button>

      <h2 className="text-2xl font-bold text-white mb-6">Submit a Complaint</h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="complaint-text" className="sr-only">Complaint Description</label>
          <textarea
            id="complaint-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe the issue you're experiencing..."
            className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
          />
        </div>

        <div>
          <label htmlFor="location-select" className="sr-only">Select Location</label>
          <select
            id="location-select"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
          >
            {DEMO_LOCATIONS.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => onAnalyze(text, locationId)}
          disabled={!text.trim()}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all"
        >
          Analyze Complaint
        </button>
      </div>
    </motion.div>
  );
}
