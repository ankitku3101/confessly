'use client'

import React, { useState } from "react";
import RoomSelector from "./RoomSelector";
import ChatRoom from "./ChatRoom";
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Chat() {
  const [username, setUsername] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [room, setRoom] = useState("");

  if (!hasJoined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <Card className="w-full max-w-md mx-auto mt-10 flex flex-col">
          <form 
            onSubmit={e => {
              e.preventDefault();
              if (username.trim()) setHasJoined(true);
            }}
            className="w-full p-4 flex flex-col items-center"
          >
            <label className="mb-2 font-semibold">Enter your username:</label>
            <Input 
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              className="mb-2"
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

  return <ChatRoom username={username} room={room} />;
}
