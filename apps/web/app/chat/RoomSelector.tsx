'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { io } from 'socket.io-client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface Props {
  setRoom: React.Dispatch<React.SetStateAction<string>>;
}

const RoomSchema = z.object({
  roomId: z
    .string()
    .refine((val) => /^\d{6}$/.test(val), {
      message: 'Room ID must be a 6-digit number',
    }),
});

type RoomSchemaType = z.infer<typeof RoomSchema>;

export default function RoomSelector({ setRoom }: Props) {
  const [rooms, setRooms] = useState<string[]>([]);
  const [showError, setShowError] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomSchemaType>({
    resolver: zodResolver(RoomSchema),
  });

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.on('active_rooms', (roomList: string[]) => {
      setRooms(roomList);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const onSubmit = (data: RoomSchemaType) => {
    if (rooms.includes(data.roomId)) {
      setRoom(data.roomId);
    } else {
      setShowError(true);
    }
  };

  const handleCreateRoom = () => {
    const newRoomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setRoom(newRoomCode);
  };

  return (
    <div className="min-h-dvh md:min-h-screen flex flex-col items-center justify-center text-white">
      <Card className="w-full max-w-sm md:max-w-md mx-auto mt-10 flex flex-col p-4 space-y-2 bg-[#0a0a0a] border border-[#454545]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full space-y-2">
          <label className="font-semibold text-white">Enter a Room ID</label>
          <Input
            {...register('roomId')}
            placeholder="6-digit Room ID"
            className="text-white border border-[#454545]"
          />
          {errors.roomId && (
            <p className="text-red-500 text-sm mt-1">{errors.roomId.message}</p>
          )}
          <Button type="submit" className="w-full">
            Join Room
          </Button>
        </form>

        <Button onClick={handleCreateRoom} className="w-full">
          Create New Room
        </Button>

        {rooms.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2 text-white">Active Rooms:</h2>
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
      <Dialog open={showError} onOpenChange={setShowError}>
        <DialogContent className='bg-black'>
          <DialogHeader>
            <DialogTitle className="text-red-500">Room Not Found</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-300">
            The room ID you entered doesn't exist. Please check and try again.
          </p>
          <Button onClick={() => setShowError(false)} className="mt-4">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
