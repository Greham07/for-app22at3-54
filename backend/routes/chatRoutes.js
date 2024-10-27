// backend/routes/chatRoutes.js
io.on('connection', (socket) => {
    socket.on('sendMessage', async ({ sender, receiver, message }) => {
      try {
        const newChat = new Chat({ sender, receiver, message });
        await newChat.save();
        io.to(receiver).emit('messageReceived', newChat); // Emit to receiver
      } catch (err) {
        console.error(err);
      }
    });
  });
  