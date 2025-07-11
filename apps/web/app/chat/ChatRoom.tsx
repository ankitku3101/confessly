'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Image, SendHorizontal, Smile, Sticker } from 'lucide-react'
import { io, Socket } from 'socket.io-client';
import { Feeling } from '@/components/BlobGradient';

type Message = {
  user?: string;
  text: string;
  timestamp?: string;
  room?: string;
  isSystem?: boolean;
  feeling?: Feeling; 
};

interface Props {
  username: string;
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  feeling: Feeling;
}

let socket: Socket | null = null;

export default function ChatRoom({ username, room, setRoom, feeling }: Props) {
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
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('system_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('user_typing', (typingUser) => {
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
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const msg: Message = {
        user: username,
        text: input.trim(),
        room,
        feeling,
        timestamp: new Date().toISOString(),
      };
      socket?.emit('message', msg);
      setInput('');
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInput(text);
    socket?.emit('typing', { username, room });
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen w-full flex items-center justify-center text-white overflow-hidden">
      <Card className="h-full md:h-4/5 w-full md:max-w-5xl flex flex-col bg-[#0a0a0a] text-white md:rounded-xl md:shadow-[0_0_25px_2px_rgba(69,69,69,0.5)]">

        {/* Header */}
        <div className="p-4 border-b border-[#454545] flex justify-between items-center text-sm font-semibold shrink-0">
          <div>Username: {username}</div>
          <div>Room: {room}</div>
          <Button
            variant="destructive"
            onClick={() => {
              socket?.disconnect();
              setRoom('');
            }}
          >
            Leave Room
          </Button>
        </div>

        {/* Message list area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2" ref={scrollRef}>
          {messages.map((msg, idx) =>
            msg.isSystem ? (
              <div key={idx} className="text-center text-[#BBBBBB] text-xs my-4">
                {msg.text}
                {msg.timestamp && (
                  <span className="ml-2 text-[10px]">{formatTime(msg.timestamp)}</span>
                )}
              </div>
            ) : (
              <div
                key={idx}
                className={`flex items-start ${msg.user === username ? 'justify-end' : 'justify-start'}`}
              >
                {/* RECEIVER's avatar */}
                {msg.user !== username && (
                  <Avatar className="mr-2 text-black">
                    <AvatarFallback>{msg.user?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}

                {/* SENDER's block with avatar, msg and emoji */}
                {msg.user === username ? (
                  <>
                    <div className="flex items-start">
                      {msg.feeling !== undefined && (
                        <Avatar className="mx-1">
                          <AvatarFallback className="bg-transparent">
                            <span className="text-[22px]">
                              {msg.feeling === Feeling.Sad ? '🥺' :
                              msg.feeling === Feeling.Neutral ? '😐' :
                              '😄'}
                            </span>
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="max-w-md rounded-lg px-3 py-2 bg-blue-700 text-white ml-1">
                        <div className="text-sm text-white">{msg.text}</div>
                      </div>
                    </div>
                    <Avatar className="ml-2 text-black">
                      <AvatarFallback>{msg.user?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </>
                ) : (
                  <>
                    {/* RECEIVER's msg and emoji block */}
                    <div className="max-w-md rounded-lg px-3 py-2 bg-[#454545] text-white">
                      <div className="text-sm font-semibold text-white">{msg.user}</div>
                      <div className="text-sm text-white">{msg.text}</div>
                    </div>
                    {msg.feeling !== undefined && (
                      <Avatar className="mx-1">
                        <AvatarFallback className="bg-transparent">
                          <span className="text-[22px]">
                            {msg.feeling === Feeling.Sad ? '🥺' :
                            msg.feeling === Feeling.Neutral ? '😐' :
                            '😄'}
                          </span>
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </>
                )}
              </div>
            )
          )}
        </div>

        {/* Input and Typing Indicators */}
        <form
          onSubmit={sendMessage}
          className="flex flex-col gap-4 p-4 border-t border-[#454545]"
        >
          {/* Typing Indicator */}
          <div className="h-5 text-[#BBBBBB] text-sm text-center transition-opacity duration-200 ease-in-out">
            {userTyping ? `${userTyping} is typing...` : ''}
          </div>

          {/* Input Row */}
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center px-4 py-2 rounded-md border border-[#454545] bg-[#0a0a0a] text-white focus-within:ring-1 ring-[#BBBBBB]">
              {/* Input */}
              <input
                type="text"
                value={input}
                onChange={handleTyping}
                placeholder="Type your message…"
                className="flex-1 bg-transparent border-none focus:outline-none text-sm placeholder:text-[#BBBBBB] p-1"
              />
              
              {/* Emoji Icon */}
              <button type="button" className="mx-[5px] text-[#BBBBBB] hover:text-white">
                <Smile className="w-5 h-5" />
              </button>

              {/* GIF Icon */}
              <button type="button" className="mx-[5px] text-[#BBBBBB] hover:text-white">
                <Image className="w-5 h-5" />
              </button>

              {/* Sticker Icon */}
              <button type="button" className="mx-[5px] text-[#BBBBBB] hover:text-white">
                <Sticker className="w-5 h-5" />
              </button>

              {/* Send Icon */}
              <button
                type="submit"
                className="ml-2 text-[#BBBBBB] hover:text-white"
              >
                <SendHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>

      </Card>
    </div>
  );
}
