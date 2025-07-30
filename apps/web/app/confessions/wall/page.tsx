'use client';

import React, { useEffect, useState } from 'react';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { Card, CardContent } from '@/components/ui/card';

interface Confession {
  id: number;
  content: string;
  confession_type: string;
  username: string;
  created_at: string;
}

export default function Page() {
  const [confessions, setConfessions] = useState<Confession[]>([]);

  const words = `They say walls have ears — this one has a heart on the other side too!`;

  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        const res = await fetch('https://confessly.onrender.com/confessions');
        const data = await res.json();
        setConfessions(data);
      } catch (error) {
        console.error('Failed to fetch confessions:', error);
      }
    };
    fetchConfessions();
  }, []);

  return (
    <div className="min-h-screen w-full text-white py-10">
      <div className="space-y-6">
        <div className="text-center">
          <SparklesText className="text-5xl md:text-7xl lg:text-8xl tracking-tighter font-medium">
            Confession Wall
          </SparklesText>
          <TextGenerateEffect className="text-rose-100 text-lg mt-4" words={words} />
        </div>

        <div className="container px-40 py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(180px,_auto)]">
          {confessions.map((confession, i) => (
            <Card
              key={confession.id}
              className={`bg-zinc-900 text-zinc-100 shadow-lg hover:scale-[1.01] transition-all border border-zinc-800 rounded-2xl ${
                i % 5 === 0
                  ? 'row-span-2 col-span-2'
                  : i % 3 === 0
                  ? 'col-span-1 row-span-2'
                  : ''
              }`}
            >
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <p className="text-sm text-zinc-400 mb-2 capitalize">{confession.confession_type}</p>
                <p className="text-base mb-4">{confession.content}</p>
                <div className="text-xs text-right text-zinc-500">
                  — {confession.username || 'Anonymous'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
