'use client';
import { useEffect, useState } from 'react';
import Player from 'react-lottie-player';

import happyAnim from '@/public/lotties/happy.json';
import neutralAnim from '@/public/lotties/neutral.json';
import sadAnim from '@/public/lotties/sad.json';

type Props = {
  feeling: number;
};

export const FeelingLottie = ({ feeling }: Props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 1500);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const animationData =
    feeling === 0 ? sadAnim : feeling === 1 ? neutralAnim : happyAnim;

  return (
    <div
      className="w-[32px] h-[32px] mx-1 shrink-0 relative group cursor-pointer"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <div className="absolute inset-0">
        <Player
          play={visible}
          loop
          animationData={animationData}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};
