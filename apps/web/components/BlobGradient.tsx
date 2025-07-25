'use client';

import { useEffect, useRef } from 'react';
import { Feeling } from '@/lib/chat-store';
import Player from 'react-lottie-player';
import happyAnim from '@/public/lotties/happy.json';
import neutralAnim from '@/public/lotties/neutral.json';
import sadAnim from '@/public/lotties/sad.json';


const feelingColorMap = {
  [Feeling.Sad]: ['#660000', '#991b1b', '#faa79d'],
  [Feeling.Neutral]: ['#1e5c00', '#3f8f1e', '#beffce'],
  [Feeling.Happy]: ['#995c00', '#a68f0c', '#fcfb86'],
};


const feelingToAnimation = {
  [Feeling.Happy]: happyAnim,
  [Feeling.Neutral]: neutralAnim,
  [Feeling.Sad]: sadAnim,
};

const feelingLabelMap = {
  [Feeling.Sad]: 'Need Virtual Hugs',
  [Feeling.Neutral]: 'Me Good',
  [Feeling.Happy]: 'Happy Happy Happy',
};

const feelingToValueMap: Record<Feeling, number> = {
  [Feeling.Sad]: 1,
  [Feeling.Neutral]: 2,
  [Feeling.Happy]: 3,
};

const valueToFeelingMap: Record<number, Feeling> = {
  1: Feeling.Sad,
  2: Feeling.Neutral,
  3: Feeling.Happy,
};

export default function BlobGradient({
  feeling,
  setFeeling,
  form,
}: {
  feeling: Feeling;
  setFeeling: (feeling: Feeling) => void;
  form?: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const colors = feelingColorMap[feeling];
    if (!colors) return;
    const [a, b, c] = colors;
    wrapperRef.current.style.setProperty('--color-a', a);
    wrapperRef.current.style.setProperty('--color-b', b);
    wrapperRef.current.style.setProperty('--color-c', c);
  }, [feeling]);

  return (
    <div
      ref={wrapperRef}
      style={{
        backgroundImage: `linear-gradient(to bottom right, var(--color-a), var(--color-b), var(--color-c))`,
      }}
      className="relative shadow-2xl mx-auto h-full w-[360px] max-w-full overflow-hidden rounded-2xl p-4 text-white duration-500 ease-in 
        [transition-property:_--color-a,_--color-b,_--color-c] before:absolute before:left-[20%] before:top-[10%] before:h-[50%] before:w-[70%] 
        before:origin-[60%] before:animate-blob before:rounded-3xl before:bg-gradient-to-br before:from-[--color-a] before:to-[--color-b] 
        before:blur-[50px] before:brightness-125 after:absolute after:left-[40%] after:top-[30%] after:h-[80%] after:w-[70%] 
        after:origin-[60%] after:animate-blob-reverse after:rounded-3xl after:bg-gradient-to-br after:from-[--color-a] 
        after:to-[--color-b] after:blur-[50px] after:brightness-125"
    >
      <div className="relative z-10 flex flex-col h-full justify-center items-center w-full gap-2">
        <h1 className="mb-4 text-4xl font-medium leading-tight text-center">
          How are you <br/> feeling today?
        </h1>

        <Player
          play
          loop
          animationData={feelingToAnimation[feeling]}
          className="w-24 h-24 mb-4 drop-shadow-2xl"
        />

        <h2 className="text-2xl font-medium text-center mb-2">
          {feelingLabelMap[feeling]}
        </h2>

        <input
          className="range w-full"
          type="range"
          min={1}
          max={3}
          step={1}
          value={feelingToValueMap[feeling] ?? 2}
          onChange={(ev) => {
            const value = Number(ev.target.value);
            const mappedFeeling = valueToFeelingMap[value];
            if (mappedFeeling) {
              setFeeling(mappedFeeling);
            }
          }}
        />

        {form}
      </div>
    </div>
  );
}

