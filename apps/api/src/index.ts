import express, {Request, Response} from 'express'
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server =  createServer();

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log("Web socket connection established");
    
    ws.on('message', (message) => {
        console.log("Received: ", message.toString());
        wss.clients.forEach(client => {
            if (client.readyState === ws.OPEN) {
                 client.send(`Echo: ${message}`);                
            }
        });
    });

    ws.on('close', () => {
        console.log("Websocket connection closed");
    })
})

app.get('/', (_, res) => {
    res.send('Express + Websocket !')
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

