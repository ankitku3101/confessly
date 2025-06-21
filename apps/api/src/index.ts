import express, {Request, Response} from 'express'
import { createServer } from 'http';
import { Server } from 'socket.io'

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: { origin : '*'},
})

const users = new Map();

io.on('connection', (socket) => {

    socket.on('user_joined', (username) => {
        users.set(socket.id, username)
        io.emit('system_message', {
            text: `${username} joined the chat`,
            username,
            timestamp: new Date().toISOString(),
            isSystem: true,
        })
    })

    socket.on('message', (msg) => {
        io.emit('message', msg);
    })

    socket.on('disconnect', () => {
    const username = users.get(socket.id);
        if (username) {
        io.emit('system_message', {
            text: `${username} left the chat`,
            username,
            timestamp: new Date().toISOString(),
            isSystem: true,
        });
        users.delete(socket.id);
        }    })
})

const PORT = 5000;
httpServer.listen(PORT, () => {
    console.log(`API Server running on http://localhost:${PORT}`);
});

