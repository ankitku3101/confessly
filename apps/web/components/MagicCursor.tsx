'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const MagicCursor = () => {
  const [isMobile, setIsMobile] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 1000, damping: 100 });
  const springY = useSpring(mouseY, { stiffness: 1000, damping: 100 });

  useEffect(() => {
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  setIsMobile(isTouchDevice);

  if (!isTouchDevice) {
    const hero = document.querySelector('.hero') as HTMLElement | null;

    if (!hero) return;

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    hero.addEventListener('mousemove', move as EventListener);

    return () => {
      hero.removeEventListener('mousemove', move as EventListener);
    };
  }
}, [mouseX, mouseY]);


  if (isMobile) return null;

  return (
    <>
      <TrailParticles x={springX} y={springY} />

      <motion.img
        src="/assets/wand.png"
        alt="magic wand"
        style={{
          translateX: springX,
          translateY: springY,
        }}
        className="pointer-events-none fixed z-[9999] top-0 left-0 w-[80px] h-auto -translate-x-[50%] -translate-y-[20%]"
      />
    </>
  );
};

const TrailParticles = ({ x, y }: { x: any; y: any }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const dot = document.createElement('div');
      const offsetX = (Math.random() - 0.5) * 5;
      const offsetY = (Math.random() - 0.5) * 5;

      dot.className =
        'fixed w-[2.5px] h-[2.5px] rounded-full bg-white pointer-events-none z-[9998]';

      dot.style.left = `${x.get() + offsetX}px`;
      dot.style.top = `${y.get() + offsetY}px`;
      dot.style.opacity = '0.85';
      dot.style.transition = 'all 0.5s ease-out';
      dot.style.boxShadow = '0 0 6px 2px rgba(255,255,255,0.3)';

      document.body.appendChild(dot);

      requestAnimationFrame(() => {
        dot.style.opacity = '0';
        dot.style.transform = 'translateY(-6px)';
      });

      setTimeout(() => dot.remove(), 600);
    }, 10);

    return () => clearInterval(interval);
  }, [x, y]);

  return null;
};
