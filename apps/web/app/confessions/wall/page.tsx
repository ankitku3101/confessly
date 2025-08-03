'use client';

import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ShineBorder } from '@/components/magicui/shine-border';

interface Confession {
  id: number;
  title?: string;
  content: string;
  confession_type: string;
  username: string;
  created_at: string;
}

export default function Page() {
  const [confessions, setConfessions] = useState<Confession[] | null>(null);
  const [selectedConfession, setSelectedConfession] = useState<Confession | null>(null);

  const words = `They say walls have ears — this one has a heart on the other side too!`;

  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        const res = await fetch('https://confessly.onrender.com/confessions');
        const data = await res.json();
        setConfessions(data);
      } catch (error) {
        console.error('Failed to fetch confessions:', error);
        setConfessions([]);
      }
    };
    fetchConfessions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const Skeleton = () => (
    <div className="w-full h-50 rounded-xl bg-neutral-800/40 animate-pulse" />
  );

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  const truncateContent = (text: string, wordLimit: number) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...   See more';
  };

  const shineColorMap: Record<string, string[]> = {
    love: ['#2b0f1a', '#ff3e75', '#4d1f2d'],
    rant: ['#230808', '#e53935', '#4c1b1b'],
    regret: ['#2f2503', '#f4c430', '#5c4510'],
    funny: ['#322a00', '#ffcc33', '#5b4e16'],
    sad: ['#08131f', '#2196f3', '#1d3242'],
    wholesome: ['#0d1e14', '#4caf50', '#24432d'],
    random: ['#160d26', '#9c27b0', '#3b2a50'],
  };


  const tagColorMap: Record<string, string> = {
    love: '#4b1f28',   
    rant: '#3d1412',   
    regret: '#4a3a10',   
    funny: '#4c3f0e',   
    sad: '#1b2a36',   
    wholesome: '#1e3426',   
    random: '#2d1f3d',   
  };

  return (
    <div className="min-h-screen w-full text-white py-10">
      <div className="space-y-6 container">
        <div className="text-center">
          <SparklesText className="text-5xl md:text-7xl lg:text-8xl tracking-tighter font-medium">
            Confession Wall
          </SparklesText>
          <TextGenerateEffect className="text-rose-100 text-sm md:text-lg mt-4" words={words} />
        </div>

        <div className="my-16 max-w-6xl mx-auto">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex gap-4"
            columnClassName="space-y-4"
          >
            {(confessions === null ? Array.from({ length: 6 }) : confessions).map(
              (confession: any, index: number) => (
                <div
                  key={confession?.id || index}
                  className={cn(
                    'break-inside-avoid cursor-pointer rounded-xl border border-white/20 bg-black p-4 backdrop-blur-sm hover:bg-neutral-900/40 transition-all duration-300 hover:scale-[1.02]',
                  )}
                  onClick={() => confession && setSelectedConfession(confession)}
                >
                  {confession ? (
                    <>
                      <ShineBorder
                        shineColor={shineColorMap[confession.confession_type] || ['#A07CFE', '#FE8FB5', '#FFBE7B']}
                      />
                      <div className="flex justify-between items-center text-xs text-neutral-500 mb-2">
                        <span
                          className="capitalize px-3 py-1 rounded-xl text-xs text-white"
                          style={{
                            backgroundColor:
                            tagColorMap[confession.confession_type] || 'rgba(255,255,255,0.08)',
                          }}
                          >
                          {confession.confession_type}
                        </span>
                        <span>{formatDate(confession.created_at)}</span>
                      </div>
                      {confession?.title && (
                        <h3 className="text-lg font-semibold text-white px-2 pb-1">{confession.title}</h3>
                      )}
                      <div className="font-sans text-neutral-200 whitespace-pre-wrap p-2">
                        {truncateContent(confession.content, 120)}
                      </div>
                      <div className="mt-2 mb-2 text-xs text-right font-sans italic text-neutral-300">{confession.username}</div>
                    </>
                  ) : (
                    <Skeleton />
                  )}
                </div>
              ),
            )}
          </Masonry>
        </div>
      </div>

      {selectedConfession && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md transition-all duration-300" />
      )}

      <Dialog open={!!selectedConfession} onOpenChange={() => setSelectedConfession(null)}>
        <DialogContent
          className={cn(
            'md:max-h-3/4 max-h-[calc(100vh-6rem)] w-[calc(100vw-3rem)] md:min-w-2xl lg:min-w-4xl md:rounded-xl bg-transparent backdrop-blur-sm z-50 overflow-y-auto',
            'transition-all duration-300 px-4 md:px-6 py-4 md:py-6'
          )}
          style={{
            boxShadow: selectedConfession
              ? `0 0 200px ${shineColorMap[selectedConfession.confession_type]?.[1] ?? '#ffffff'}`
              : undefined,
          }}
        >
          {selectedConfession && (
            <>
              <DialogHeader className="mb-4">
                <DialogTitle>
                  <div className="flex gap-4 items-center text-xs text-neutral-500">
                    <span
                      className="capitalize px-3 py-1 rounded-xl text-white"
                      style={{
                        backgroundColor:
                          tagColorMap[selectedConfession.confession_type] || 'rgba(255,255,255,0.08)',
                      }}
                    >
                      {selectedConfession.confession_type}
                    </span>
                    <span>{formatDate(selectedConfession.created_at)}</span>
                  </div>
                </DialogTitle>
              </DialogHeader>

              {selectedConfession?.title?.trim() ? (
                <h3 className="text-xl font-semibold text-white mb-3">
                  {selectedConfession.title}
                </h3>
              ) : (
                <h3 className="text-xl font-semibold text-white mb-3">
                  Anonymous Confession
                </h3>
              )}

              <div className="font-sans text-neutral-200 whitespace-pre-wrap mb-4">
                {selectedConfession.content}
              </div>

              <div className="text-xs text-right font-sans italic text-neutral-300">
                {selectedConfession.username}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
