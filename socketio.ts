import socketIO from "socket.io";

export let io: socketIO.Server;

export interface User {
    userId?: number;
    socketId?: string;
}

export function setSocketIO(value: socketIO.Server) {
    io = value;
    io.on("connection", async (socket) => {
        console.log("ALL SOCKET", await io.allSockets());

        const { userId } = socket.handshake.auth;

        let user: User = {
            userId: userId,
            socketId: socket.id,
        }

        if(userId){
            
        }
    })
}
