import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  'Analyzing complaint...',
  'Understanding issue...',
  'Detecting location...',
  'Identifying affected area...',
  'Checking existing incidents...'
];

interface ProcessingStateProps {
  onComplete: () => void;
}

export default function ProcessingState({ onComplete }: ProcessingStateProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (currentStepIndex < STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
        <div className="space-y-4">
          {STEPS.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isPast = idx < currentStepIndex;
            const isFuture = idx > currentStepIndex;
            
            if (isFuture) return null;

            return (
              <motion.div 
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-3 ${isActive ? 'text-white' : 'text-slate-400'}`}
              >
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  {isPast ? (
                    <motion.svg 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="w-5 h-5 text-green-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  ) : isActive ? (
                    <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  ) : null}
                </div>
                <span className={`font-medium ${isActive ? 'animate-pulse' : ''}`}>{step}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
