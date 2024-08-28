import { Server as SocketIOServer } from "socket.io";


const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: [process.env.ORIGIN],
            credentials: true
        }
    });

    const userSocktets = new Map();

    io.on('connection', (socket) => {
        console.log(`Socket connection established with id ${socket.id}`);
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocktets.set(userId, socket.id);
            console.log(`User ${userId} connected with socket ${socket.id}`);
        }

        socket.on('disconnect', () => {
            console.log('Socket connection disconnected');
            userSocktets.forEach((value, key) => {
                if (value === socket.id) {
                    userSocktets.delete(key);
                    console.log(`User ${key} disconnected`);
                }
            });
        });
    });
};

export default setupSocket;