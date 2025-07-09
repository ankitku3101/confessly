'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { cn } from '@/lib/utils';

const TAGLINES = [
  'say it, forget it',
  'share without shame',
  'anonymity meets honesty',
];

export const TextRevealCard = ({
  text,
  textClassName,
  className,
}: {
  text: string;
  textClassName?: string;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hovering, setHovering] = useState(false);
  const [revealText, setRevealText] = useState(TAGLINES[0]);

  const x = useMotionValue(0);
  const clip = useTransform(x, (val) => `inset(0 ${100 - val}% 0 0)`);
  const rotate = useTransform(x, (val) => `${(val - 50) * 0.1}deg`);
  const opacityStick = useTransform(x, (val) => (val > 0 ? 1 : 0));

  const [width, setWidth] = useState(1);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const { width, left } = containerRef.current.getBoundingClientRect();
      setWidth(width);
      setLeft(left);
    }
  }, []);

  const getNewTagline = () => {
    let newTag = TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
    while (newTag === revealText) {
      newTag = TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
    }
    setRevealText(newTag);
  };

  const handleEnter = () => {
    setHovering(true);
    getNewTagline();
  };

  const handleLeave = () => {
    setHovering(false);
    animate(x, 0, { duration: 0.3, ease: 'easeOut' });
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as any).clientX;
    const relativeX = clientX - left;
    const percent = Math.min(Math.max((relativeX / width) * 100, 0), 100);
    x.set(percent);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      onTouchStart={handleEnter}
      onTouchEnd={handleLeave}
      onTouchMove={handleMove}
      className={cn(
        'relative w-3xl h-[3.2rem] sm:h-[3.5rem] md:h-[4rem]',
        className
      )}
    >
      {/* Revealed text */}
      <motion.p
        style={{
          clipPath: clip,
          opacity: hovering ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={cn(
          'absolute inset-0 z-20 text-center bg-gradient-to-b from-white via-white/80 to-white/60 bg-clip-text text-transparent pointer-events-nonec',
          textClassName
        )}
      >
        {revealText}
      </motion.p>

      <motion.div
        style={{
          left: useTransform(x, (val) => `${val}%`),
          rotate,
          opacity: opacityStick,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className=""
      />

      {/* Base text */}
      <motion.p
        animate={{
          opacity: hovering ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={cn(
          'absolute inset-0 text-center bg-[#323238] bg-clip-text text-transparent pointer-events-none',
          textClassName
        )}
      >
        {text}
      </motion.p>
    </div>
  );
};
