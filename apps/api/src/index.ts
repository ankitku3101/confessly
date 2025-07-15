import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { 
    origin: ['https://confessly-web.vercel.app'] ,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

const rooms = new Map<string, Set<string>>();

const users = new Map<string, { username: string; room: string; feeling?: number }>();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.emit('active_rooms', Array.from(rooms.keys()));

  socket.on('join_room', (data: { username: string; room: string; feeling?: number }) => {
    const { username, room, feeling } = data;

    socket.join(room);
    users.set(socket.id, { username, room, feeling });

    if (!rooms.has(room)) {
      rooms.set(room, new Set());
    }
    rooms.get(room)!.add(socket.id);

    io.to(room).emit('system_message', {
      text: `${username} joined the room`,
      timestamp: new Date().toISOString(),
      isSystem: true,
    });

    emitActiveRooms();
  });

  socket.on('message', (msg: { user: string; text: string; room: string; feeling?: number }) => {
    const timestamp = new Date().toISOString();
    io.to(msg.room).emit('message', { ...msg, timestamp });
  });

  socket.on('typing', ({ username, room }: { username: string; room: string }) => {
    socket.to(room).emit('user_typing', username);
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (!user) return;

    const { username, room } = user;
    users.delete(socket.id);

    const roomSet = rooms.get(room);
    if (roomSet) {
      roomSet.delete(socket.id);
      if (roomSet.size === 0) {
        rooms.delete(room);
      }
    }

    io.to(room).emit('system_message', {
      text: `${username} left the room`,
      timestamp: new Date().toISOString(),
      isSystem: true,
    });

    emitActiveRooms();
  });

  function emitActiveRooms() {
    const activeRoomList = Array.from(rooms.keys());
    io.emit('active_rooms', activeRoomList);
  }
});

const PORT = 5000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
