const { getIo, users } = require('../socket')

const sendMessage = (data) => {
    const { userId, fileId, status, url } = data
    const targetSocketId = users.get(userId);
    const io = getIo(); // Get the io instance
    if (targetSocketId) {
        io.to(targetSocketId).emit('updateStatus', { fileId, status, url });
    }
}

module.exports = sendMessage