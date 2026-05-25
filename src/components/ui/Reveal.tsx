import type { Key, ReactNode } from 'react';
import { motion } from 'motion/react';

interface RevealProps {
  children: ReactNode;
  key?: Key;
  className?: string;
  delay?: number;
  once?: boolean;
  amount?: number;
  y?: number;
}

const premiumEase = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, className = '', delay = 0, once = true, amount = 0.18, y = 40 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, amount, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.78, delay, ease: premiumEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  key?: Key;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
}

export function StaggerContainer({
  children,
  className = '',
  delay = 0,
  stagger = 0.08,
  once = true,
  amount = 0.14,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin: '0px 0px -90px 0px' }}
      variants={{
        hidden: {},
        show: {
          transition: {
            delayChildren: delay,
            staggerChildren: stagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  key?: Key;
  className?: string;
  y?: number;
}

export function StaggerItem({ children, className = '', y = 36 }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y, filter: 'blur(10px)' },
        show: { opacity: 1, y: 0, filter: 'blur(0px)' },
      }}
      transition={{ duration: 0.72, ease: premiumEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
