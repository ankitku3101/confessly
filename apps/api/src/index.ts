import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { attachClientIdMiddleware } from './middleware';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'https://confessly-web.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const rooms = new Map<string, Set<string>>();
const users = new Map<string, { username: string; room: string; feeling?: string | number }>();

io.use(attachClientIdMiddleware);

function emitActiveRooms() {
  const activeRoomList = Array.from(rooms.keys());
  console.log("Emitting active_rooms:", activeRoomList);
  console.log("Total connected clients:", io.engine.clientsCount);
  io.emit('active_rooms', activeRoomList);
}

function emitRoomUsers(room: string) {
  const roomSet = rooms.get(room);
  if (!roomSet) {
    console.log(`No room set found for room: ${room}`);
    return;
  }

  const userList = Array.from(roomSet)
    .map((id) => users.get(id))
    .filter(Boolean);

  console.log(`Emitting active_users for room ${room}:`, userList);
  io.to(room).emit('active_users', userList);
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  console.log('Total rooms:', rooms.size);

  // Send active rooms immediately on connection
  socket.emit('active_rooms', Array.from(rooms.keys()));

  socket.on('join_room', (data: { username: string; room: string; feeling?: number }) => {
    console.log('Received join_room:', data);
    const { username, room, feeling } = data;

    if (!username || !room) {
      console.error('Missing username or room in join_room data:', data);
      return;
    }

    socket.join(room);
    users.set(socket.id, { username, room, feeling });

    if (!rooms.has(room)) {
      console.log(`Creating new room: ${room}`);
      rooms.set(room, new Set());
    }
    rooms.get(room)!.add(socket.id);

    console.log(`User ${username} joined room ${room}`);
    console.log(`Room ${room} now has ${rooms.get(room)!.size} users`);
    console.log('All rooms:', Array.from(rooms.keys()));

    io.to(room).emit('system_message', {
      text: `${username} joined the room`,
      timestamp: new Date().toISOString(),
      isSystem: true,
    });

    // Emit updated room lists
    emitActiveRooms();
    emitRoomUsers(room);
  });

  socket.on('message', (msg: { user: string; text: string; room: string; feeling?: number }) => {
    const timestamp = new Date().toISOString();
    io.to(msg.room).emit('message', { ...msg, timestamp });
  });

  socket.on('typing', ({ username, room }: { username: string; room: string }) => {
    socket.to(room).emit('user_typing', username);
  });

  socket.on('change_user_feeling', ({ username, room, feeling }: { username: string; room: string; feeling: string }) => {
    const user = users.get(socket.id);
    if (!user) {
      console.warn(`change_user_feeling: No user found for socket ${socket.id}`);
      return;
    }

    // Update user's feeling
    user.feeling = feeling;
    users.set(socket.id, user);

    console.log(`User ${username} updated feeling to ${feeling} in room ${room}`);

    io.to(room).emit('user_feeling_changed', { username, feeling });

    emitRoomUsers(room);
  });


  socket.on('get_active_rooms', () => {
    console.log('Client requested active rooms');
    socket.emit('active_rooms', Array.from(rooms.keys()));
  });

  socket.on('disconnect', () => {
    console.log('User disconnecting:', socket.id);
    const user = users.get(socket.id);
    if (!user) {
      console.log('No user data found for disconnecting socket');
      return;
    }

    const { username, room } = user;
    users.delete(socket.id);

    const roomSet = rooms.get(room);
    if (roomSet) {
      roomSet.delete(socket.id);
      console.log(`Removed user from room ${room}, remaining: ${roomSet.size}`);
      
      if (roomSet.size === 0) {
        console.log(`Deleting empty room: ${room}`);
        rooms.delete(room);
      }
    }

    io.to(room).emit('system_message', {
      text: `${username} left the room`,
      timestamp: new Date().toISOString(),
      isSystem: true,
    });

    emitActiveRooms();
    emitRoomUsers(room);
  });
});

const PORT = 5000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});