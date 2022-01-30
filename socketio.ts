import { knex } from "./server";
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

        if(userId){
            console.log("SOCKET ID=>", socket.id);
            console.log("SOCKET USER ID=>", socket.handshake.auth.userId);

            // JOIN CAMPAIGNS ROOM
            socket.on('addRoom', (roomId) => {
                if (roomId && typeof roomId === "string") {
                    socket.join(roomId);
                } else if (roomId && typeof roomId === "number") {
                    socket.join(roomId.toString());
                }
            });

            // EMIT REAL-TIME-VOTING
            socket.on("voting", async (userId, roomId, pollOptionId) => {

                if (userId && roomId) {
                    await knex.raw(
                        `insert into votes (user_id, poll_options_id)
                        values (:userId, :pollOptionId);`,
                        { userId, pollOptionId }
                    )
                    io.sockets.in(roomId.toString()).emit("voting", userId, roomId, pollOptionId);
                }
            });
        }
    })
}
