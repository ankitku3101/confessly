'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
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
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card className="w-full h-screen
  border-0 rounded-none shadow-none
  lg:h-[85vh] lg:max-w-5xl lg:rounded-xl lg:shadow-[0_0_25px_2px_rgba(69,69,69,0.5)] lg:border lg:border-[#454545] lg:mx-auto
  bg-[#0a0a0a] text-white flex flex-col
  transition-all">

        {/* Header */}
        <div className="p-3 lg:p-4 border-b border-[#454545] flex justify-between items-center text-sm font-semibold shrink-0">
          <div className="truncate text-xs sm:text-sm">Username: {username}</div>
          <div className="truncate mx-2 text-xs sm:text-sm">Room: {room}</div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              socket?.disconnect();
              setRoom('');
            }}
            className="shrink-0 text-xs sm:text-sm px-2 sm:px-3"
          >
            Leave
          </Button>
        </div>

        {/* Message list area - Key changes here */}
        <div 
          className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4 space-y-2 overscroll-contain" 
          ref={scrollRef}
          style={{ 
            // Ensure messages area takes remaining space
            minHeight: 0,
            // Prevent overscroll bounce on iOS
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

        {/* Input and Typing Indicators - Key changes here */}
        <div className="shrink-0 border-t border-[#454545] lg:border-t-0">
          <form
            onSubmit={sendMessage}
            className="flex flex-col gap-1 sm:gap-2 p-2 sm:p-3 lg:p-5"
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
                    // Prevent zoom on iOS
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

                  {/* GIF Icon - Hidden on very small screens */}
                  <button 
                    type="button" 
                    className="p-1 text-[#BBBBBB] hover:text-white touch-manipulation hidden sm:block"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Image className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Sticker Icon - Hidden on very small screens */}
                  <button 
                    type="button" 
                    className="p-1 text-[#BBBBBB] hover:text-white touch-manipulation hidden sm:block"
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