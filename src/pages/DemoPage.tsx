import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { analyzeComplaint } from '../services/demoService';
import type { AnalysisResult, DemoIncident } from '../data/demoData';
import DemoDashboard from '../components/Demo/DemoDashboard';
import LoginScreen from '../components/Auth/LoginScreen';
import { getIdToken } from '../services/authService';
import ComplaintForm from '../components/Demo/ComplaintForm';
import ProcessingState from '../components/Demo/ProcessingState';
import AnalysisCard from '../components/Demo/AnalysisCard';
import IncidentDetail from '../components/Demo/IncidentDetail';

type ViewState = 'dashboard' | 'form' | 'processing' | 'result' | 'incident-detail';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export default function DemoPage() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<DemoIncident | null>(null);

  useEffect(() => {
    getIdToken().then((token) => setAuthenticated(Boolean(token)));
  }, []);

  const handleAnalyze = async (text: string, locationId: string) => {
    try {
      setErrorMessage('');
      const result = await analyzeComplaint(text, locationId);
      setAnalysisResult(result);
      setCurrentView('processing');
    } catch (error) {
      console.error('Error analyzing complaint:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to submit complaint.'
      );
    }
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 text-slate-50 flex items-center justify-center">
        <div className="text-slate-400">Checking authentication…</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 text-slate-50">
        <LoginScreen onSuccess={() => setAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="header"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="mb-8 text-center"
            >
              <h1 className="text-4xl font-bold mb-4 tracking-tight">FixFlow Live Demo</h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                See how FixFlow transforms complaints into actionable incidents.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {errorMessage && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
            {errorMessage}
          </div>
        )}

        <main className="relative pb-16">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div
                key="dashboard"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <DemoDashboard onSubmitComplaint={() => setCurrentView('form')} />
              </motion.div>
            )}

            {currentView === 'form' && (
              <motion.div
                key="form"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ComplaintForm
                  onAnalyze={handleAnalyze}
                  onBack={() => setCurrentView('dashboard')}
                />
              </motion.div>
            )}

            {currentView === 'processing' && (
              <motion.div
                key="processing"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ProcessingState onComplete={() => setCurrentView('result')} />
              </motion.div>
            )}

            {currentView === 'result' && analysisResult && (
              <motion.div
                key="result"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <AnalysisCard
                  result={analysisResult}
                  onSubmitAnother={() => setCurrentView('form')}
                  onViewIncident={(incident) => {
                    setSelectedIncident(incident);
                    setCurrentView('incident-detail');
                  }}
                />
              </motion.div>
            )}

            {currentView === 'incident-detail' && selectedIncident && (
              <motion.div
                key="incident-detail"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <IncidentDetail
                  incident={selectedIncident}
                  onBack={() => setCurrentView('result')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
