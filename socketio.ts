import socketIO from "socket.io";

export let io: socketIO.Server;

export function setSocketIO(value: socketIO.Server) {
    io = value;
    io.on("connection", async (socket) => {
        console.log("ALL SOCKET", await io.allSockets());

        const {}
    })
}
