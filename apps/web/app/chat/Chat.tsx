'use client'

import React, { useState } from "react";
import RoomSelector from "./RoomSelector";
import ChatRoom from "./ChatRoom";
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { StarsBackground } from "@/components/ui/stars-background";

export default function Chat() {
  const [username, setUsername] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [room, setRoom] = useState("");

  if (!hasJoined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Card className="w-full max-w-md mx-auto mt-10 flex flex-col bg-[#0a0a0a] border border-[#454545] z-1">
          <form 
            onSubmit={e => {
              e.preventDefault();
              if (username.trim()) setHasJoined(true);
            }}
            className="w-full px-4 py-2 flex flex-col items-center"
          >
            <label className="mb-2 font-semibold text-white">Enter your username</label>
            <Input 
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              className="mb-4 text-white border border-[#454545]"
            />
            <Button type="submit">Join Chat</Button>
          </form>
        </Card>
      </div>
    );
  }

  if (!room) {
    return <RoomSelector setRoom={setRoom} />;
  }

  return <ChatRoom username={username} room={room} setRoom={setRoom}/>;
}
