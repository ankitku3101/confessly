'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useClientIdStore } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '@/components/ui/card';
import { LoaderFive } from "@/components/ui/loader";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SendHorizontal, Smile, Sticker, LogOut, Users, Settings, SmilePlusIcon, CircleUserRound, Home } from 'lucide-react'
import { EmojiPicker, EmojiPickerSearch, EmojiPickerContent, EmojiPickerFooter } from "@/components/ui/emoji-picker";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { io, Socket } from 'socket.io-client';
import { Feeling } from '@/lib/chat-store';
import { BorderBeam } from '@/components/magicui/border-beam';
import GifPicker from 'gif-picker-react';
import { ComicText } from '@/components/magicui/comic-text';
import { JugglingAvatar } from '@/components/JugglingAvatar';


type Message = {
  user?: string;
  text: string;
  timestamp?: string;
  room?: string;
  isSystem?: boolean;
  feeling?: Feeling; 
  replyTo?: Message;
};

type ActiveUser = {
  username: string;
  room: string;
  feeling?: Feeling;
};

interface Props {
  username: string;
  room: string;
  setRoom: (room: string) => void;
  feeling: Feeling;
}

let socket: Socket | null = null;

export default function ChatRoom({ username, room, setRoom, feeling }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userTyping, setUserTyping] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [gifOpen, setGifOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<null | { user?: string; text: string }>(null);
  const tenorApiKey = process.env.NEXT_PUBLIC_TENOR_API_KEY
  const { clientId, setClientId } = useClientIdStore();


  useEffect(() => {

    let id = clientId;

    if (!id) {
      id = uuidv4();
      setClientId(id);
    }

    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_API_URL, {
        query: {clientId: id},
      });
    }

    socket.emit('join_room', { username, room });

    socket.on('message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('system_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);

      if (msg.text?.toLowerCase().includes('joined the room')) {
        setHasJoined(true);
      }
    });

    socket.on('user_typing', (typingUser) => {
      if (typingUser !== username) {
        setUserTyping(typingUser);
        setTimeout(() => setUserTyping(null), 2000);
      }
    });

    socket.on('active_users', (userList) => {
      setActiveUsers(userList)
    })

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
        replyTo: replyTo || undefined,
      };
      socket?.emit('message', msg);
      setInput('');
      setReplyTo(null);
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
      <Card className="w-full lg:py-2 py-0 gap-[2px]
        min-h-dvh
        max-h-dvh
        lg:max-h-4/5
        lg:min-h-4/5
        flex flex-col
        bg-[#0a0a0a] text-white
        lg:max-w-5xl
        lg:rounded-xl
        lg:shadow-[0_0_25px_2px_rgba(69,69,69,0.5)]
        border-0
        md:border md:border-[#454545]
        transition-all
        relative
        overflow-hidden"
      >

        {/* Header */}
        <div className="p-4 border-b border-[#454545] flex justify-between text-sm font-semibold shrink-0 w-full text-[#BBBBBB] bg-[#0a0a0a]">
          
          {/* Center: Room Name */}
          <div className="text-center text-base sm:text-lg md:text-2xl">
            <ComicText>TalkRooms</ComicText>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-4 justify-end text-[#BBBBBB]">
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
                {activeUsers.length === 0 ? (
                  <div className="text-sm mt-2 italic text-[#888]">No Users Online</div>
                ) : (
                  <ul className='mt-2 space-y-1 text-sm'>
                    {activeUsers.map((user, index) => (
                      <li key={index} className="text-[#DDDDDD]">
                        • {user.username}
                      </li>
                    ))}
                  </ul>
                )}
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
                <div className="flex flex-col gap-4 truncate text-xs sm:text-sm">
                  <div className="flex items-center gap-1 min-w-0">
                    <CircleUserRound className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span className="truncate">Username: {username}</span>
                  </div>
                  <div className="flex items-center gap-1 min-w-0">
                    <Home className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span className="truncate">Room ID: {room}</span>
                  </div>
                </div>
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
          className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4 space-y-2 overscroll-contain mt-2" 
          ref={scrollRef}
          style={{ 
            minHeight: 0,
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {!hasJoined ? (
            <div className="flex justify-center items-center h-full">
              <LoaderFive text="Connecting to the server..." />
            </div>
          ) : (
            <>
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
                    className={`group relative flex items-end gap-2 ${
                      msg.user === username ? 'justify-end' : 'justify-start'
                    }`}
                    onClick={() => setReplyTo(msg)}
                  >
                    {/* Receiver's avatar */}
                    {msg.user !== username && (
                      <JugglingAvatar
                        feeling={msg.feeling ?? Feeling.Neutral}
                        username={msg.user as string}
                      />
                    )}

                    {/* Message bubble */}
                    <div className="flex flex-col items-start max-w-[75%] sm:max-w-[70%] lg:max-w-md space-y-1">
                      {msg.user !== username && (
                        <div className="text-xs sm:text-sm font-semibold text-white">
                          {msg.user}
                        </div>
                      )}

                      {/* Reply context (if any) */}
                      {msg.replyTo && (
                        <div className="bg-[#2e2e2e] rounded-md p-2 text-xs text-gray-300 border-l-4 border-blue-500">
                          <span className="font-semibold">{msg.replyTo.user}</span>: {msg.replyTo.text}
                        </div>
                      )}

                      {/* Main text or image */}
                      {msg.text.match(/\.(gif|webp|png|jpg)$/i) ? (
                        <img
                          src={msg.text}
                          alt="Media"
                          className="rounded-md object-contain max-w-full"
                        />
                      ) : (
                        <div
                          className={`rounded-lg px-2 sm:px-3 py-2 break-words text-xs sm:text-sm ${
                            msg.user === username
                              ? 'bg-blue-700 text-white'
                              : 'bg-[#454545] text-white'
                          }`}
                        >
                          {msg.text}
                        </div>
                      )}
                    </div>

                    {/* Sender's avatar */}
                    {msg.user === username && (
                      <JugglingAvatar
                        feeling={msg.feeling ?? Feeling.Neutral}
                        username={msg.user as string}
                      />
                    )}

                    {/* Tooltip or hint */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:block text-[10px] text-gray-400">
                      Click to reply
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </div>

        {/* Typing Indicator */}
        <div className="h-8 p-1 mx-4 text-[#BBBBBB] text-xs sm:text-sm text-left transition-opacity duration-200 ease-in-out">
          {userTyping ? `${userTyping} is typing...` : ''}
        </div>

        {replyTo && (
          <div className="flex items-center justify-between bg-[#333333] text-white px-4 py-2 rounded-md mb-2">
            <div className="text-xs">
              Replying to <span className="font-semibold">{replyTo.user}</span>: {replyTo.text}
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="text-red-400 text-xs hover:underline"
            >
              Cancel
            </button>
          </div>
        )}


        {/* Input and Typing Indicators */}
        <div className="shrink-0 border-t border-[#454545] lg:border-t-0">
          <form
            onSubmit={sendMessage}
            className="flex flex-col gap-1 sm:gap-2 p-4 lg:p-5"
          >

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
                  <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="p-1 text-[#BBBBBB] hover:text-teal-400 touch-manipulation cursor-pointer"
                      >
                        <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-0 m-4 md:mr-22">
                      <EmojiPicker
                        className="h-[342px]"
                        onEmojiSelect={({ emoji }) => {
                          setInput((prev) => prev + emoji);
                          setEmojiOpen(false);
                          inputRef?.current?.focus(); 
                        }}
                      >
                        <EmojiPickerSearch />
                        <EmojiPickerContent/>
                        <EmojiPickerFooter />
                      </EmojiPicker>
                    </PopoverContent>
                  </Popover>

                  {/* GIF Icon */}
                  <Dialog open={gifOpen} onOpenChange={setGifOpen}>
                    
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="p-1 text-[#BBBBBB] hover:text-teal-400 touch-manipulation cursor-pointer"
                      >
                        <Sticker className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0a0a0a] border border-[#454545] rounded-lg max-w-md">
                      <DialogTitle>Select a GIF</DialogTitle>
                      <GifPicker
                        tenorApiKey={tenorApiKey as string}
                        width={'full'}
                        onGifClick={(gif) => {
                          const gifMsg: Message = {
                            user: username,
                            text: gif.url,
                            room,
                            feeling,
                            timestamp: new Date().toISOString(),
                          };
                          socket?.emit('message', gifMsg);
                          setGifOpen(false);
                          inputRef?.current?.focus();
                        }}
                      />
                    </DialogContent>
                  </Dialog>

                  {/* Send Icon */}
                  <button
                    type="submit"
                    className="p-1 text-[#BBBBBB] hover:text-blue-400 touch-manipulation cursor-pointer"
                  >
                    <SendHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <BorderBeam
          duration={7}
          delay={3}
          size={800}
          className="from-transparent via-purple-500 to-transparent"
        />
        <BorderBeam
          duration={7}
          delay={6}
          size={800}
          className="from-transparent via-pink-500 to-transparent"
        />
      </Card>
    </div>
  );
}