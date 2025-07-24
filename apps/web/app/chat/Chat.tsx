'use client';

import React, { useEffect, useState } from 'react';
import RoomSelector from './RoomSelector';
import ChatRoom from './ChatRoom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BlobGradient from '@/components/BlobGradient';
import { useChatStore } from '@/lib/chat-store';

export default function Chat() {

const {
  username,
  hasJoined,
  room,
  feeling,
  setUsername,
  setHasJoined,
  setRoom,
  setFeeling,
} = useChatStore();
const [hydrated, setHydrated] = useState(false);

useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  if (!hasJoined) {
    return (
      <div className="min-h-dvh md:min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <BlobGradient
            feeling={feeling}
            setFeeling={setFeeling}
            form={
              <Card className="w-full bg-[#0a0a0a]/90 border border-[#454545] p-4 z-10 pointer-events-auto mt-16">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (username.trim()) setHasJoined(true);
                  }}
                  className="flex flex-col gap-4"
                >
                  <div className="text-lg font-semibold text-white text-center">
                    Enter your Username
                  </div>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your username"
                    className="text-white border border-[#454545]"
                  />
                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </form>
              </Card>
            }
          />
        </div>
      </div>
    );
  }

  if (!room) return <RoomSelector setRoom={setRoom} />;

  return <ChatRoom username={username} room={room} feeling={feeling} setRoom={setRoom} />;
}
