import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`group relative shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/50 select-none overflow-hidden ${
        isDark
          ? 'bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 hover:text-white border border-white/[0.1] shadow-[0_0_12px_rgba(255,255,255,0.04)]'
          : 'bg-slate-100 hover:bg-slate-200/90 text-slate-700 hover:text-slate-950 border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
    >
      {/* Subtle Ambient Hover Glow */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-full transition-opacity duration-300 pointer-events-none opacity-0 group-hover:opacity-100 ${
          isDark
            ? 'bg-radial from-cyan-500/15 via-transparent to-transparent'
            : 'bg-radial from-amber-500/15 via-transparent to-transparent'
        }`}
      />

      <AnimatePresence initial={false}>
        {isDark ? (
          <motion.div
            key="dark-moon"
            initial={{ rotate: -90, scale: 0.3, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Moon size={15} strokeWidth={1.8} className="text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.45)]" />
          </motion.div>
        ) : (
          <motion.div
            key="light-sun"
            initial={{ rotate: 90, scale: 0.3, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Sun size={15} strokeWidth={1.8} className="text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
