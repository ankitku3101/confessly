'use client';

import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Player from 'react-lottie-player';
import happyAnim from '@/public/lotties/happy.json';
import neutralAnim from '@/public/lotties/neutral.json';
import sadAnim from '@/public/lotties/sad.json';
import { Feeling } from '@/lib/chat-store'; 
import { useState } from 'react';

interface FeelingSelectorProps {
  handleFeelingChange: (feeling: Feeling) => void;
}

export function FeelingSelector({ handleFeelingChange }: FeelingSelectorProps) {
  const [hovered, setHovered] = useState<Feeling | null>(null);

  const feelings = [
    { type: Feeling.Happy, animation: happyAnim },
    { type: Feeling.Neutral, animation: neutralAnim },
    { type: Feeling.Sad, animation: sadAnim },
  ];

  return (
    <DialogContent className="bg-[#0f0f0f] border border-[#333] text-[#CCCCCC]">
      <DialogHeader>
        <DialogTitle className="text-white">Set Status</DialogTitle>
      </DialogHeader>

      <div className="mt-6 flex justify-between items-center gap-4">
        {feelings.map(({ type, animation }) => (
          <button
            key={type}
            className="w-20 h-20 rounded-md hover:scale-110 transition-transform cursor-pointer"
            onMouseEnter={() => setHovered(type)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleFeelingChange(type)}
          >
            <Player
              animationData={animation}
              play
              loop={true}
              className="w-full h-full"
            />
          </button>
        ))}
      </div>
    </DialogContent>
  );
}
