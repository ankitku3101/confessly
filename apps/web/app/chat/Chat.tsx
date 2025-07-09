'use client';

import React, { useState } from 'react';
import RoomSelector from './RoomSelector';
import ChatRoom from './ChatRoom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Feeling } from '@/components/BlobGradient';
import BlobGradient from '@/components/BlobGradient';

export default function Chat() {
  const [username, setUsername] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [room, setRoom] = useState('');
  const [feeling, setFeeling] = useState<Feeling>(Feeling.Sad);

  if (!hasJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
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
