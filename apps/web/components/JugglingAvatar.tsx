'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Player from 'react-lottie-player';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import happyAnim from '@/public/lotties/happy.json';
import neutralAnim from '@/public/lotties/neutral.json';
import sadAnim from '@/public/lotties/sad.json';

type Props = {
  username: string;
  feeling: number;
};

export const JugglingAvatar = ({ username, feeling }: Props) => {
  const [showLottie, setShowLottie] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const animationData =
    feeling === 1 ? sadAnim : feeling === 2 ? neutralAnim : happyAnim;

  const handleMouseEnter = () => {
    // Show animation
    setShowLottie(true);

    // Clear existing timeout if any
    if (timeoutId) clearTimeout(timeoutId);

    // Hide after 6 seconds
    const id = setTimeout(() => {
      setShowLottie(false);
    }, 6000);

    setTimeoutId(id);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return (
    <div
      className="w-7 h-7 sm:w-8 sm:h-8 relative cursor-pointer overflow-hidden"
      onMouseEnter={handleMouseEnter}
    >
      <AnimatePresence mode="wait">
        {showLottie ? (
          <motion.div
            key="lottie"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Player
              play
              loop
              animationData={animationData}
              style={{ width: '100%', height: '100%' }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="avatar"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Avatar className="w-full h-full">
              <AvatarFallback className="text-black">
                {username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
