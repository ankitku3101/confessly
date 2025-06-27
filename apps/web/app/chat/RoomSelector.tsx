'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { io } from 'socket.io-client';

interface Props {
  setRoom: React.Dispatch<React.SetStateAction<string>>;
}

export default function RoomSelector({ setRoom }: Props) {
  const [roomInput, setRoomInput] = useState('');
  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('active_rooms', (roomList: string[]) => {
      setRooms(roomList);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomInput.trim()) {
      setRoom(roomInput.trim());
    }
  };

  const handleCreateRoom = () => {
    const newRoomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setRoom(newRoomCode);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <Card className="w-full max-w-md mx-auto mt-10 flex flex-col p-4 space-y-2">
        <form onSubmit={handleJoinRoom} className="flex flex-col w-full space-y-2">
          <label className="font-semibold">Enter a Room ID</label>
          <Input
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            placeholder="6-digit Room ID"
            className="text-black"
          />
          <Button type="submit" className="w-full">
            Join Room
          </Button>
        </form>

        <Button onClick={handleCreateRoom} className="w-full">
          Create New Room
        </Button>

        {rooms.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Active Rooms:</h2>
            <ul className="space-y-2">
              {rooms.map((room) => (
                <li key={room} className="flex justify-between items-center px-4 py-2 rounded-xl bg-gray-200/50">
                  <span>Room ID: {room}</span>
                  <Button size="sm" onClick={() => setRoom(room)}>
                    Join
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}
