import { Server, Socket } from 'socket.io';

let waitingUser: Socket | null = null;
export function facetimeHandler(io: Server, socket: Socket) {
    console.log("facetimeHandler attached:", socket.id);

    //This part of code lets the users find partners 
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
    // ...till here

    // This part is pure WebRTC stuff for sending ICE candidates and SDP.
    socket.on("offer", ({target, sdp}) => {
        io.to(target).emit('offer', { sdp, sender: socket.id })
    })

    socket.on("answer", ({target, sdp}) => {
        io.to(target).emit('answer', { sdp, sender: socket.id })
    })

    socket.on("ice-candidate", ({target, candidate}) => {
        io.to(target).emit('answer', { candidate, sender: socket.id })
    })
}