import type { CSSProperties, HTMLAttributes, Key, ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

interface RevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  key?: Key;
  className?: string;
  delay?: number;
  once?: boolean;
  amount?: number;
  y?: number;
  style?: CSSProperties;
  [key: string]: any;
}

const premiumEase = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, className = '', delay = 0, style, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay, ease: premiumEase }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps extends HTMLAttributes<HTMLDivElement> {
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
  ...rest
}: StaggerContainerProps) {
  return <div className={className} {...rest}>{children}</div>;
}

interface StaggerItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  key?: Key;
  className?: string;
  y?: number;
  style?: CSSProperties;
  [key: string]: any;
}

export function StaggerItem({ children, className = '', style, ...rest }: StaggerItemProps) {
  return <div className={className} style={style} {...rest}>{children}</div>;
}
