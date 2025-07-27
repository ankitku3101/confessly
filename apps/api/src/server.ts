import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import { setupSocket } from './socket/talkroom';

const PORT = process.env.PORT || 3001;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'https://confessly-web.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  path: '/talkrooms',
});

setupSocket(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
