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

export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay, ease: premiumEase }}
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
}: StaggerContainerProps) {
  return <div className={className}>{children}</div>;
}

interface StaggerItemProps {
  children: ReactNode;
  key?: Key;
  className?: string;
  y?: number;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return <div className={className}>{children}</div>;
}
