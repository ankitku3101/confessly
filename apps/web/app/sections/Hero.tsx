'use client';

import React, { useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from 'framer-motion';
import { StarsBackground } from '@/components/ui/stars-background';
import { ShootingStars } from '@/components/ui/shooting-stars';
import Link from 'next/link';

const COLORS_TOP = ['#13FFAA', '#1E67C6', '#CE84CF', '#DD335C'];

export default function Hero() {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: 'easeInOut',
      duration: 10,
      repeat: Infinity,
      repeatType: 'mirror',
    });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(110% 145% at 50% 0%, #000000 44%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative grid min-h-screen place-content-center overflow-hidden bg-black px-4 py-24 text-gray-200"
    >
      <div className="relative z-10 flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-2 inline-block rounded-full bg-[#1f1f1f]/70 px-3 py-1.5 text-sm text-white/60"
        >
          Under Development!
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.0, ease: 'easeOut' }}
          className="max-w-4xl p-1 bg-gradient-to-b from-white via-white/80 to-white/60 bg-clip-text text-transparent text-center text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold leading-tight tracking-tight"
        >
          confessly
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-4 italic text-white/60 text-base sm:text-lg text-center tracking-wide"
        >
          "where secrets spark conversations"
        </motion.p>

        <Link href={'/chat'}>
          <motion.button
            style={{ border, boxShadow }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.985 }}
            className="group mt-8 relative flex w-fit items-center gap-2 rounded-full bg-[#1f1f1f]/60 px-6 py-3 text-white transition-colors hover:bg-[#1f1f1f]/80 cursor-pointer"
          >
            Enter Anonymously
            <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
          </motion.button>
        </Link>
      </div>

      <StarsBackground className="z-0" />
      <ShootingStars className="z-0 pointer-events-none" />
    </motion.section>
  );
}
