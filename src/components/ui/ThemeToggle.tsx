import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
      style={{
        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.05)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.08)'}`,
        backdropFilter: 'blur(12px)',
      }}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
    >
      <motion.div
        className="absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center"
        initial={false}
        animate={{
          x: isDark ? 0 : 32,
          backgroundColor: '#3b82f6',
          boxShadow: isDark 
            ? '0 4px 12px rgba(59, 130, 246, 0.4)' 
            : '0 4px 12px rgba(59, 130, 246, 0.3)',
        }}
        transition={{
          duration: 0,
        }}
      >
        <motion.span
          initial={false}
          animate={{
            opacity: isDark ? 1 : 0,
            scale: isDark ? 1 : 0.5,
            rotate: isDark ? 0 : -45,
          }}
          transition={{ duration: 0 }}
          className="text-white text-xs"
        >
          ☾
        </motion.span>
        <motion.span
          initial={false}
          animate={{
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0.5 : 1,
            rotate: isDark ? 45 : 0,
          }}
          transition={{ duration: 0 }}
          className="absolute text-white text-xs"
        >
          ☀
        </motion.span>
      </motion.div>
    </button>
  );
};
