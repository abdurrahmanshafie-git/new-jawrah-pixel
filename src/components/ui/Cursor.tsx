import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { cn } from '@/lib/utils';

export function Cursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverType, setHoverType] = useState<'default' | 'premium' | 'text'>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const isPremium = target.closest('[data-cursor="premium"]');
      const isText = target.closest('h1, h2, h3, p, span:not(button span, a span)');
      const isClickable = target.closest('button, a, input, select, textarea, [role="button"]');
      
      if (isPremium) {
        setHoverType('premium');
        setIsHovered(true);
      } else if (isText && !isClickable) {
        setHoverType('text');
        setIsHovered(true);
      } else {
        setHoverType('default');
        setIsHovered(!!isClickable);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <motion.div
        className={cn(
          "fixed top-0 left-0 border border-white/20 rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center",
          hoverType === 'premium' && "border-brand-blue/40 bg-brand-blue/5 backdrop-blur-sm"
        )}
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          width: hoverType === 'premium' ? 80 : 32,
          height: hoverType === 'premium' ? 80 : 32,
          scale: hoverType === 'text' ? 1.5 : isHovered ? (hoverType === 'premium' ? 1.2 : 2.5) : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
            scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            width: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
            height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.2 }
        }}
      >
        {hoverType === 'premium' && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-white"
          >
            View
          </motion.span>
        )}
      </motion.div>
      <motion.div
        className={cn(
          "fixed top-0 left-0 w-1.5 h-1.5 bg-brand-blue rounded-full pointer-events-none z-[9999]",
          hoverType === 'premium' && "opacity-0"
        )}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isClicking ? 0.8 : 1,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
}
