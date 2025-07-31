'use client';

import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Confession {
  id: number;
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

  const getConfessionIcon = (type: string) => {
    const iconClass = 'h-4 w-4 text-neutral-400';
    switch (type.toLowerCase()) {
      case 'love':
        return <span className={iconClass}>💕</span>;
      case 'secret':
        return <span className={iconClass}>🤫</span>;
      case 'guilt':
        return <span className={iconClass}>😔</span>;
      case 'fear':
        return <span className={iconClass}>😰</span>;
      case 'joy':
        return <span className={iconClass}>😊</span>;
      default:
        return <span className={iconClass}>💭</span>;
    }
  };

  const Skeleton = () => (
    <div className="w-full h-30 rounded-xl bg-neutral-800/40 animate-pulse" />
  );

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
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
                    'break-inside-avoid cursor-pointer rounded-xl border border-white/20 bg-black p-4 backdrop-blur-sm hover:bg-neutral-900/50 transition-all duration-300 hover:scale-[1.02]',
                  )}
                  onClick={() => confession && setSelectedConfession(confession)}
                >
                  {confession ? (
                    <>
                      <div className="flex justify-between items-center text-xs text-neutral-500 mb-2">
                        <span className="capitalize bg-neutral-800 px-2 py-1 rounded-full text-xs">
                          {confession.confession_type}
                        </span>
                        <span>{formatDate(confession.created_at)}</span>
                      </div>
                      {getConfessionIcon(confession.confession_type)}
                      <div className="font-sans text-neutral-200 whitespace-pre-wrap">
                        {confession.content}
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

      {/* Dialog for full confession */}
      <Dialog open={!!selectedConfession} onOpenChange={() => setSelectedConfession(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedConfession?.username} ·{' '}
              <span className="text-xs text-neutral-400 lowercase">
                {selectedConfession?.confession_type}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-neutral-200 whitespace-pre-wrap mt-4">
            {selectedConfession?.content}
          </div>
          <div className="text-xs text-neutral-500 mt-4 text-right">
            {selectedConfession && formatDate(selectedConfession.created_at)}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
