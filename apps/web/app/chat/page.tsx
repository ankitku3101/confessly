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
  isSystem?: boolean;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [hasJoined, setHasJoined] = useState(false); 
  const scrollRef = useRef<HTMLDivElement>(null);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!hasJoined) return;

    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () => {
      console.log("Connected to WebSocket server");
      socket.current?.emit('user_joined', username); 
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
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
  }, [hasJoined]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && socket.current) {
      const msg: Message = { user: username, text: input };
      socket.current.emit("message", msg);
      // setMessages(prev => [...prev, msg]);
      setInput("");
    }
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10 flex flex-col">
      {!hasJoined ? (
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
      ) : (
        <>
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
          <Separator />
          <form onSubmit={sendMessage} className="flex p-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 mr-2"
            />
            <Button type="submit">Send</Button>
          </form>
        </>
      )}
    </Card>
  );
}
