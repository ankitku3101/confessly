import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { facetimeHandler } from './facetimeHandler';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

const rooms = new Map<string, Set<string>>();

io.on('connection', (socket) => {
  let joinedRoom: string | null = null;
  let username: string | null = null;

  facetimeHandler(io, socket);

  socket.emit('active_rooms', Array.from(rooms.keys()));

  socket.on('join_room', (data: { username: string; room: string }) => {
    username = data.username;
    joinedRoom = data.room;

    socket.join(joinedRoom);

    if (!rooms.has(joinedRoom)) {
      rooms.set(joinedRoom, new Set());
    }
    rooms.get(joinedRoom)!.add(socket.id);

    io.to(joinedRoom).emit('system_message', {
      text: `${username} joined the room`,
      timestamp: new Date().toISOString(),
      isSystem: true,
    });

    emitActiveRooms();
  });

  socket.on('message', (msg: { user: string; text: string; room: string }) => {
    if (msg.room) {
      io.to(msg.room).emit('message', {
        ...msg,
        timestamp: new Date().toISOString(),
      });
    }
  });

  socket.on('typing', ({ username, room }: { username: string; room: string }) => {
    socket.to(room).emit('user_typing', username);
  });

  socket.on('disconnect', () => {
    if (joinedRoom !== null && rooms.has(joinedRoom)) {
      const userSet = rooms.get(joinedRoom)!;
      userSet.delete(socket.id);

      if (userSet.size === 0) {
        rooms.delete(joinedRoom);
      }

      io.to(joinedRoom).emit('system_message', {
        text: `${username} left the room`,
        timestamp: new Date().toISOString(),
        isSystem: true,
      });

      emitActiveRooms();
    }
  });

  function emitActiveRooms() {
    const activeRoomList = Array.from(rooms.keys());
    io.emit('active_rooms', activeRoomList);
  }
});

const PORT = 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
