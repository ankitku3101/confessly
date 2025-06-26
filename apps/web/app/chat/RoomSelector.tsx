'use client'

import React, { useState } from "react";
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function RoomSelector({setRoom} : {setRoom: any}) {
  const [roomInput, setRoomInput] = useState('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <Card className="w-full max-w-md mx-auto mt-10 flex flex-col">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (roomInput.trim()) setRoom(roomInput.trim());
          }}
          className="w-full p-4 flex flex-col items-center"
        >
          <label className="mb-2 font-semibold">Enter or select a room:</label>
          <Input
            value={roomInput}
            onChange={e => setRoomInput(e.target.value)}
            placeholder="Room name"
            className="mb-2"
          />
          <Button type="submit">Join Room</Button>
        </form>
      </Card>
    </div>
  );
}
