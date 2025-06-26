'use client'

import React, { useState, useRef, useEffect } from "react";
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from "@/components/ui/separator";
import { io, Socket } from "socket.io-client"

type Message = {
  user?: string;
  text: string;
  timestamp?: string;
  room?: string;
  isSystem?: boolean;
};

export default function ChatRoom({ username, room } : {username: any, room: any}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [userTyping, setUserTyping] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () => {
      socket.current?.emit('join_room', { username, room });
    });

    socket.current.on("user_typing", (typingUser) => {
      if (typingUser !== username) {
        setUserTyping(typingUser);
        setTimeout(() => setUserTyping(null), 2500);
      }
    });

    socket.current.on('message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.current.on('system_message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [room, username]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && socket.current) {
      const msg: Message = { user: username, text: input, room };
      socket.current.emit("message", msg);
      setInput("");
    }
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <Card className="w-full max-w-md mx-auto mt-10 flex flex-col"> 
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
        <form onSubmit={sendMessage} className="flex p-2">
          <Input
            value={input}
            onChange={e => {
              setInput(e.target.value);
              socket.current?.emit("typing", { message: e.target.value, username, room });
            }}
            placeholder="Type your message…"
            className="flex-1 mr-2"
          />
          <Button type="submit">Send</Button>
        </form>
      </Card>
    </div>
  );
}
