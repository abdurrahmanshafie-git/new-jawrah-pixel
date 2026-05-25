import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;

    let frame = 0;
    const totalFrames = 56;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = () => {
      frame += 1;
      setDisplayValue(value * easeOut(Math.min(frame / totalFrames, 1)));
      if (frame < totalFrames) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <motion.span ref={ref} className={className} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
}
