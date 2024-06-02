const socketIo = require('socket.io');
const users = new Map(); // Map to store userId to socketId

let io;

const setupSocketIo = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        socket.on('register', (data) => {
            users.set(data.userId, socket.id); // Store the socket ID with the user ID
            console.log(`User ${data.userId} connected with socket ID ${socket.id}`);
        });

        socket.on('disconnect', () => {
            for (let [userId, socketId] of users.entries()) {
                if (socketId === socket.id) {
                    users.delete(userId);
                    break;
                }
            }
        });
    });

    io.listen(5000, () => {
        console.log('Socket connected on port 5000');
    });
};

module.exports = { setupSocketIo, users, getIo: () => io };
