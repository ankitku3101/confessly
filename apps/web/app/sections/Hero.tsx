'use client';

import React, { useEffect, useState } from 'react';
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
import { TextRevealCard } from '@/components/ui/text-reveal-card';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { LoaderOne } from '@/components/ui/loader';

const TAGLINES = [
  'say it, forget it',
  'share without shame',
  'anonymity meets honesty',
];

const COLORS_TOP = ['#13FFAA', '#1E67C6', '#CE84CF', '#DD335C'];

export default function Hero() {
  const color = useMotionValue(COLORS_TOP[0]);
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});

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

  const handleButtonClick = (index: number) => {
    setLoadingStates(prev => ({ ...prev, [index]: true }));
    
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [index]: false }));
    }, 2000);
  };

  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative grid min-h-dvh md:min-h-screen place-content-center overflow-hidden bg-black px-4 py-20 text-gray-200"
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
          className="max-w-4xl p-1 bg-gradient-to-b from-white via-white/80 to-white/60 bg-clip-text text-transparent text-center text-5xl sm:text-7xl md:text-8xl font-semibold leading-tight tracking-tight"
        >
          confessly
        </motion.h1>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.9 }}
        >
          <TextRevealCard
            text="where secrets spark conversations"
            textClassName="mt-4 italic text-white/60 text-base sm:text-lg text-center tracking-wide"
          />
        </motion.span>

        {/* Mini Cards Section */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Talkrooms',
              subtitle: 'Topic-based group chats. Fully anonymous.',
              href: '/talkrooms',
              cta: 'Join Rooms',
            },
            {
              title: 'Confession Wall',
              subtitle: 'Read and write real, raw, anonymous confessions.',
              href: '/confessions/wall',
              cta: 'View Confessions',
            },
            {
              title: 'Talk with a Stranger',
              subtitle: 'One-on-one anonymous chats. No identity, no pressure. (in progress)',
              href: '/stranger-chat',
              cta: 'Start Chatting',
            },
          ].map(({ title, subtitle, href, cta }, index) => (
            <CardSpotlight
              key={index}
              className="h-auto w-72 flex flex-col justify-between p-8 text-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:scale-[1.015] transition-transform duration-200"
            >
              <div className="relative z-20 flex flex-col flex-grow justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                  <p className="text-white/70 mt-2 text-sm">{subtitle}</p>
                </div>

                <Link href={href} className="mt-6">
                  <motion.button
                    style={{ border, boxShadow }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handleButtonClick(index)}
                    disabled={loadingStates[index]}
                    className="group relative flex items-center justify-center gap-2 rounded-full bg-[#1f1f1f]/60 px-4 py-2 text-xs text-white transition-colors hover:bg-[#1f1f1f]/80 cursor-none min-w-[120px] h-8"
                  >
                    {loadingStates[index] ? (
                      <LoaderOne />
                    ) : (
                      <>
                        {cta}
                        <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
                      </>
                    )}
                  </motion.button>
                </Link>
              </div>
            </CardSpotlight>
          ))}
        </div>
      </div>

      <StarsBackground className="z-0" />
      <ShootingStars className="z-0 pointer-events-none" />
    </motion.section>
  );
}