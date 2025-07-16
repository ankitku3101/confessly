'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Image, SendHorizontal, Smile, Sticker, LogOut, Users, Settings, SmilePlusIcon, CircleUserRound, House, Home } from 'lucide-react'
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
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Mobile keyboard handling
  useEffect(() => {
    const handleResize = () => {
      if (inputRef.current && document.activeElement === inputRef.current) {
        // Small delay to ensure viewport has updated
        setTimeout(() => {
          inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="min-w-dvw md:w-screen min-h-dvh md:h-screen flex items-center justify-center">
      <Card className="w-full lg:py-2 py-0
        min-h-dvh
        lg:min-h-4/5
        flex flex-col
        bg-[#0a0a0a] text-white
        lg:max-w-5xl
        lg:rounded-xl
        lg:shadow-[0_0_25px_2px_rgba(69,69,69,0.5)]
        border-0
        md:border md:border-[#454545]
        transition-all
        overflow-hidden"
      >

        {/* Header */}
        <div className="p-4 lg:p-3 border-b border-[#454545] grid grid-cols-3 items-center text-sm font-semibold shrink-0 w-full text-[#BBBBBB] bg-[#0a0a0a]">
          
          {/* Left: Username & Room ID */}
          <div className="flex items-center gap-4 truncate text-xs sm:text-sm">
            <div className="flex items-center gap-1 min-w-0">
              <CircleUserRound className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">{username}</span>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <Home className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">{room}</span>
            </div>
          </div>

          {/* Center: Room Name */}
          <div className="text-center text-base sm:text-lg md:text-2xl text-white truncate">
            TalkRooms
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-3 justify-end text-[#BBBBBB]">
            {/* All icons as before */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-white cursor-pointer">
                  <SmilePlusIcon className="w-5 h-5" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#0f0f0f] border border-[#333] text-[#CCCCCC]">
                <DialogHeader>
                  <DialogTitle className="text-white">Set Status</DialogTitle>
                </DialogHeader>
                <div className="text-sm mt-2">(Status modal)</div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-white cursor-pointer">
                  <Users className="w-5 h-5" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#0f0f0f] border border-[#333] text-[#CCCCCC]">
                <DialogHeader>
                  <DialogTitle className="text-white">Online Users</DialogTitle>
                </DialogHeader>
                <div className="text-sm mt-2">(List of online users)</div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-white cursor-pointer">
                  <Settings className="w-5 h-5" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#0f0f0f] border border-[#333] text-[#CCCCCC]">
                <DialogHeader>
                  <DialogTitle className="text-white">Room Settings</DialogTitle>
                </DialogHeader>
                <div className="text-sm mt-2">(Room settings)</div>
              </DialogContent>
            </Dialog>

            <button
              onClick={() => {
                socket?.disconnect();
                setRoom('');
              }}
              className="text-red-500 hover:text-white cursor-pointer"
              title="Leave Room"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message list area*/}
        <div 
          className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4 space-y-2 overscroll-contain" 
          ref={scrollRef}
          style={{ 
            minHeight: 0,
            WebkitOverflowScrolling: 'touch'
          }}
        >
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
                  <Avatar className="mr-2 text-black shrink-0">
                    <AvatarFallback>{msg.user?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}

                {/* SENDER's block with avatar, msg and emoji */}
                {msg.user === username ? (
                  <>
                    <div className="flex items-start">
                      {msg.feeling !== undefined && (
                        <Avatar className="mx-1 shrink-0">
                          <AvatarFallback className="bg-transparent">
                            <span className="text-[22px]">
                              {msg.feeling === Feeling.Sad ? '🥺' :
                              msg.feeling === Feeling.Neutral ? '😐' :
                              '😄'}
                            </span>
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="max-w-[75%] sm:max-w-[70%] lg:max-w-md rounded-lg px-2 sm:px-3 py-2 bg-blue-700 text-white ml-1">
                        <div className="text-xs sm:text-sm text-white break-words">{msg.text}</div>
                      </div>
                    </div>
                    <Avatar className="ml-2 text-black shrink-0">
                      <AvatarFallback>{msg.user?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </>
                ) : (
                  <>
                    {/* RECEIVER's msg and emoji block */}
                    <div className="max-w-[75%] sm:max-w-[70%] md:max-w-md rounded-lg px-2 sm:px-3 py-2 bg-[#454545] text-white">
                      <div className="text-xs sm:text-sm font-semibold text-white truncate">{msg.user}</div>
                      <div className="text-xs sm:text-sm text-white break-words">{msg.text}</div>
                    </div>
                    {msg.feeling !== undefined && (
                      <Avatar className="mx-1 shrink-0">
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
        <div className="shrink-0 border-t border-[#454545] lg:border-t-0">
          <form
            onSubmit={sendMessage}
            className="flex flex-col gap-1 sm:gap-2 p-4 sm:p-4 lg:p-5"
          >
            {/* Typing Indicator */}
            <div className="h-3 sm:h-4 lg:h-5 text-[#BBBBBB] text-xs sm:text-sm text-left transition-opacity duration-200 ease-in-out">
              {userTyping ? `${userTyping} is typing...` : ''}
            </div>

            {/* Input Row */}
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex flex-1 items-center px-2 sm:px-3 lg:px-4 py-2 rounded-md border border-[#454545] bg-[#0a0a0a] text-white focus-within:ring-1 ring-[#BBBBBB]">
                
                {/* Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleTyping}
                  placeholder="Type your message…"
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm sm:text-base placeholder:text-[#BBBBBB] p-1 min-w-0"
                  style={{
                    fontSize: '16px',
                  }}
                />
                
                {/* Mobile-optimized icon buttons */}
                <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 shrink-0">
                  {/* Emoji Icon */}
                  <button 
                    type="button" 
                    className="p-1 text-[#BBBBBB] hover:text-white touch-manipulation"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>


                  {/* Sticker Icon - Hidden on very small screens */}
                  <button 
                    type="button" 
                    className="p-1 text-[#BBBBBB] hover:text-white touch-manipulation"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Sticker className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Send Icon */}
                  <button
                    type="submit"
                    className="p-1 text-[#BBBBBB] hover:text-white touch-manipulation"
                  >
                    <SendHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

      </Card>
    </div>
  );
}