import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '@/components/layout/Logo';
import { RefreshCw, Home, ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface SleekLoaderProps {
  fullScreen?: boolean;
  compact?: boolean;
  message?: string;
  timeoutMs?: number;
}

export function SleekLoader({
  fullScreen = true,
  compact = false,
  message,
  timeoutMs = 4000,
}: SleekLoaderProps) {
  const [showFailsafe, setShowFailsafe] = useState(false);

  let isDark = true;
  try {
    const themeContext = useTheme();
    isDark = themeContext.theme === 'dark';
  } catch {
    isDark = typeof document !== 'undefined' && !document.documentElement.classList.contains('light');
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFailsafe(true);
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [timeoutMs]);

  const handleHardRefresh = () => {
    try {
      sessionStorage.clear();
    } catch {
      // Ignore storage errors
    }
    window.location.reload();
  };

  const isFull = fullScreen && !compact;

  const containerClasses = isFull
    ? `fixed inset-0 z-[99999] flex min-h-screen w-full flex-col items-center justify-center overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#05070B] text-slate-200' : 'bg-[#FAFAFA] text-slate-800'
      }`
    : 'flex min-h-[50vh] w-full flex-col items-center justify-center py-16 bg-transparent';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
      className={`${containerClasses} transition-opacity duration-300`}
      style={{
        backgroundColor: isFull ? (isDark ? '#05070B' : '#FAFAFA') : 'transparent',
      }}
    >
      {/* Top Ambient Progress Line */}
      {isFull && (
        <div
          className={`fixed top-0 left-0 right-0 z-[100000] h-[2.5px] overflow-hidden ${
            isDark ? 'bg-brand-blue/20' : 'bg-slate-200'
          }`}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-brand-blue to-brand-cyan shadow-[0_0_14px_rgba(6,182,212,0.8)]"
          />
        </div>
      )}

      {/* Atmospheric Radial Glow for Fullscreen Mode */}
      {isFull && (
        <div
          className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-700"
          style={{
            background: isDark
              ? 'radial-gradient(circle at 50% 48%, rgba(6, 182, 212, 0.16) 0%, rgba(59, 130, 246, 0.08) 35%, transparent 70%)'
              : 'radial-gradient(circle at 50% 48%, rgba(6, 182, 212, 0.10) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%)',
          }}
        />
      )}

      {/* Subtle Digital Energy Atmosphere */}
      {isFull && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: (i % 2 === 0 ? 1 : -1) * (40 + i * 20),
                y: (i % 3 === 0 ? 1 : -1) * (30 + i * 15),
              }}
              animate={{
                opacity: isDark ? [0, 0.25, 0] : [0, 0.15, 0],
                x: [0, (i % 2 === 0 ? 20 : -20)],
                y: [0, (i % 3 === 0 ? -20 : 20)],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.4,
              }}
              className={`absolute top-1/2 left-1/2 w-1 h-1 rounded-full blur-[0.5px] ${
                isDark ? 'bg-brand-cyan' : 'bg-brand-blue'
              }`}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-md">
        {/* Animated Brand Pulse */}
        <div className="relative mb-6">
          {/* Subtle Outer Halo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.9, 1.18, 0.9],
              opacity: isDark ? [0.25, 0.65, 0.25] : [0.15, 0.45, 0.15],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -inset-5 rounded-full bg-gradient-to-tr from-brand-blue/30 to-brand-cyan/30 blur-xl"
          />

          {/* Original Logo Center */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0.92 }}
            animate={{
              scale: [0.97, 1.03, 0.97],
              opacity: [0.94, 1, 0.94],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative flex items-center justify-center p-2"
          >
            <img
              src="/assets/logo.png"
              alt="Jawrah Pixel"
              width="144"
              height="144"
              loading="eager"
              decoding="sync"
              className={`pointer-events-none object-contain mx-auto transition-all duration-300 ${
                compact ? 'h-24 w-24' : 'h-32 w-32 sm:h-36 sm:w-36'
              } ${
                isDark
                  ? 'brightness-110 drop-shadow-[0_0_24px_rgba(6,182,212,0.35)]'
                  : 'brightness-100 drop-shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
              }`}
            />
          </motion.div>
        </div>

        {/* Dynamic Status Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-ping" />
            <p
              className={`text-[11px] font-mono uppercase tracking-[0.28em] font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {message || 'INITIALIZING EXPERIENCE'}
            </p>
          </div>
        </div>

        {/* Failsafe Quick Recovery Options */}
        <AnimatePresence>
          {showFailsafe && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`mt-8 flex flex-col items-center gap-3 pt-4 border-t w-full ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}
            >
              <p
                className={`text-[11px] font-sans leading-relaxed ${
                  isDark ? 'text-brand-gray/90' : 'text-slate-600'
                }`}
              >
                Loading taking longer than expected?
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleHardRefresh}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider border transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm ${
                    isDark
                      ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <RefreshCw size={12} className="text-brand-cyan" />
                  Quick Refresh
                </button>
                <a
                  href="/lk"
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider border transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm ${
                    isDark
                      ? 'border-brand-blue/30 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-cyan'
                      : 'border-brand-blue/30 bg-blue-50 hover:bg-blue-100 text-brand-blue'
                  }`}
                >
                  <Home size={12} />
                  Home
                  <ArrowRight size={11} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
