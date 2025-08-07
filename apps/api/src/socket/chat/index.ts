import { Server } from 'socket.io';
import { attachClientId } from '../../middleware/clientId';

const waitingQueue: string[] = [];
const matchedUsers = new Map<string, string>();

export function setupStrangerChat(io: Server) {
  io.use(attachClientId);

  function matchUsers() {
    while (waitingQueue.length >= 2) {
      const socketId1 = waitingQueue.shift()!;
      const socketId2 = waitingQueue.shift()!;

      const roomId = `stranger_${socketId1}_${socketId2}`;

      const socket1 = io.sockets.sockets.get(socketId1);
      const socket2 = io.sockets.sockets.get(socketId2);

      if (socket1 && socket2) {
        socket1.join(roomId);
        socket2.join(roomId);

        matchedUsers.set(socketId1, socketId2);
        matchedUsers.set(socketId2, socketId1);

        socket1.emit('match_found', { roomId, partner: socketId2 });
        socket2.emit('match_found', { roomId, partner: socketId1 });

        io.to(roomId).emit('system_message', {
          text: 'You are now connected to a stranger.',
          timestamp: new Date().toISOString(),
          isSystem: true,
        });

        console.log(`Matched ${socketId1} and ${socketId2} in room ${roomId}`);
      }
    }
  }

  io.on('connection', (socket) => {
    console.log('Stranger chat user connected:', socket.id);

    socket.on('join_random_chat', () => {
      console.log(`User ${socket.id} requested random chat`);

      if (waitingQueue.includes(socket.id)) return;
      waitingQueue.push(socket.id);
      matchUsers();
    });

    socket.on('private_message', (data: { roomId: string; text: string }) => {
      const timestamp = new Date().toISOString();
      io.to(data.roomId).emit('private_message', {
        sender: socket.id,
        text: data.text,
        timestamp,
      });
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`);

      // Remove from waiting queue
      const index = waitingQueue.indexOf(socket.id);
      if (index !== -1) {
        waitingQueue.splice(index, 1);
        console.log(`Removed ${socket.id} from waiting queue`);
      }

      // Notify matched partner
      const partnerId = matchedUsers.get(socket.id);
      if (partnerId) {
        const partnerSocket = io.sockets.sockets.get(partnerId);
        if (partnerSocket) {
          partnerSocket.emit('stranger_disconnected');
        }
        matchedUsers.delete(socket.id);
        matchedUsers.delete(partnerId);
        console.log(`Removed match between ${socket.id} and ${partnerId}`);
      }
    });
  });
}
