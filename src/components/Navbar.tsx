'use client';

import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-white tracking-tight hover:opacity-90 transition-opacity"
        >
          <span className="text-cyan-400">Fix</span>Flow
        </Link>

        {/* CTA */}
        <Link to={isLanding ? '/demo' : '/'}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              px-6 py-2.5 rounded-full font-semibold text-sm transition-all
              ${isLanding
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/15'
              }
            `}
            aria-label={isLanding ? 'Try Live Demo' : 'Back to Home'}
          >
            {isLanding ? 'Try Live Demo' : '← Back to Home'}
          </motion.button>
        </Link>
      </div>
    </motion.nav>
  );
}
