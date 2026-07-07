import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';
import { Logo } from '@/components/layout/Logo';

export function SleekLoader() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center"
      style={{
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'var(--color-bg-primary)',
        backdropFilter: isDark ? 'blur(6px)' : undefined,
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.92, opacity: 0.85 }}
          animate={{ scale: [0.98, 1.02, 0.98], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          className="rounded-full p-2"
        >
          <Logo size="xl" className="mx-auto" />
        </motion.div>
      </div>
    </div>
  );
}
