import { Server, Socket } from 'socket.io';

const users = new Map(); 
const roomList = new Map<string, Set<string>>();

export function handleSocketEvents(io: Server, socket: Socket) {
  console.log('User connected:', socket.id);

  socket.on('join_room', ({ username, room }) => {
    socket.join(room);
    users.set(socket.id, { username, room });

    if (!roomList.has(room)) {
      roomList.set(room, new Set());
    }
    roomList.get(room)!.add(username);

    socket.to(room).emit('system_message', {
      text: `${username} joined.`,
      isSystem: true,
      timestamp: new Date().toISOString(),
    });

    io.emit('active_rooms', Array.from(roomList.keys()));
  });

  socket.on('message', (msg) => {
    const { room } = msg;
    io.to(room).emit('message', msg);
  });

  socket.on('typing', ({ username, room }) => {
    socket.to(room).emit('user_typing', username);
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (!user) return;

    const { username, room } = user;
    users.delete(socket.id);

    socket.to(room).emit('system_message', {
      text: `${username} left.`,
      isSystem: true,
      timestamp: new Date().toISOString(),
    });

    const roomUsers = roomList.get(room);
    if (roomUsers) {
      roomUsers.delete(username);
      if (roomUsers.size === 0) {
        roomList.delete(room); 
      }
    }

    io.emit('active_rooms', Array.from(roomList.keys()));
  });
}
