import express, {Request, Response} from 'express'
import { createServer } from 'http';
import { Server } from 'socket.io'

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: { origin : '*'},
})

io.on('connection', (socket) => {
    console.log("User Connected: ", socket.id);
    
    socket.on('message', (msg) => {
        io.emit('message', msg);
    })

    socket.on('disconnect', () => {
        console.log('User Disconnected:', socket.id);        
    })
})

const PORT = 5000;
httpServer.listen(PORT, () => {
    console.log(`API Server running on http://localhost:${PORT}`);
});

