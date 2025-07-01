import { Server, Socket } from 'socket.io';

let waitingUser: Socket | null = null;
export function facetimeHandler(io: Server, socket: Socket) {
    console.log("facetimeHandler attached:", socket.id);

    socket.on("find_partner", () => {
        if (waitingUser === null) {
            waitingUser = socket;
            console.log("User waiting for matchmaking:", socket.id);
        } else {
            socket.emit('partner_found', waitingUser.id)
            waitingUser.emit('partner_found', socket.id)
            console.log(`Matched ${waitingUser.id} with ${socket.id}`);
            waitingUser = null;
        }
    })

    socket.on("disconnect", () => {
        if(waitingUser?.id === socket.id) {
            console.log("Waiting User disconnected: ", socket.id);
            waitingUser = null;
        }
    })
}