'use client';

import React, { useState, useRef, useEffect } from "react";
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from "@/components/ui/separator";
import { io, Socket } from "socket.io-client";

type Message = {
  user?: string;
  text: string;
  timestamp?: string;
  room?: string;
  isSystem?: boolean;
};

interface Props {
  username: string;
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
}

let socket: Socket | null = null;

export default function ChatRoom({ username, room, setRoom }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userTyping, setUserTyping] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_API_URL);
    }

    socket.emit('join_room', { username, room });

    socket.on('message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('system_message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on("user_typing", (typingUser) => {
      if (typingUser !== username) {
        setUserTyping(typingUser);
        setTimeout(() => setUserTyping(null), 2000);
      }
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [room, username]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const msg: Message = {
        user: username,
        text: input.trim(),
        room,
      };
      socket?.emit("message", msg);
      setInput('');
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInput(text);
    socket?.emit("typing", { username, room });
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <Card className="w-full max-w-md mx-auto mt-10 flex flex-col">
        <div className="p-4 border-b border-muted-foreground flex justify-between items-center text-sm font-semibold">
          <div>Username: {username}</div>
          <div>Room: {room}</div>
          <Button
            variant="destructive"
            onClick={() => {
              socket?.disconnect();
              setRoom(""); 
            }}
          >
            Leave Room
          </Button>
        </div>

        <ScrollArea className="h-80 p-4 flex-1">
          <div ref={scrollRef}>
            {messages.map((msg, idx) =>
              msg.isSystem ? (
                <div key={idx} className="text-center text-muted-foreground text-xs my-2">
                  {msg.text}
                  {msg.timestamp && (
                    <span className="ml-2 text-[10px]">{formatTime(msg.timestamp)}</span>
                  )}
                </div>
              ) : (
                <div
                  key={idx}
                  className={`flex mb-2 ${msg.user === username ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.user !== username && (
                    <Avatar className="mr-2">
                      <AvatarFallback>{msg.user?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 ${
                      msg.user === username
                        ? 'bg-blue-500 text-white ml-auto'
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    {msg.user !== username && (
                      <div className="text-sm font-semibold">{msg.user}</div>
                    )}
                    <div className="text-sm">{msg.text}</div>
                  </div>

                  {msg.user === username && (
                    <Avatar className="ml-2">
                      <AvatarFallback>{msg.user?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )
            )}
          </div>
        </ScrollArea>

        {userTyping && (
          <div className="text-sm text-muted-foreground px-4 py-2 text-center">
            {userTyping} is typing...
          </div>
        )}

        <Separator />

        <form onSubmit={sendMessage} className="flex p-2 gap-2">
          <Input
            value={input}
            onChange={handleTyping}
            placeholder="Type your message…"
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </Card>
    </div>
  );
}
