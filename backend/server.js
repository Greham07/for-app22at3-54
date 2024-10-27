require('dotenv').config();
console.log('MONGODB_URI:', process.env.MONGODB_URI);
const express = require('express');
const http = require('http'); // Import http to create the server
const socketIo = require('socket.io'); // Import Socket.IO
const connectDB = require('./config/db');
const cors = require('cors');
const donationRoutes = require('./routes/donationRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
connectDB();

// CORS options
const corsOptions = {
  origin: 'http://localhost:3000', // Ensure this matches your frontend
  methods: ['GET', 'POST'],
  credentials: true, // Allow credentials if needed
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api', userRoutes);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Ensure this matches your frontend
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinChat', ({ donorId, doneeId }) => {
    socket.join(`chat_${donorId}_${doneeId}`);
    console.log(`User joined chat room: chat_${donorId}_${doneeId}`);
  });

  socket.on('sendMessage', (messageData) => {
    // Emit the message to both the donor and donee
    io.to(`chat_${messageData.receiver}_${messageData.sender}`).emit('messageReceived', messageData);
    io.to(`chat_${messageData.sender}_${messageData.receiver}`).emit('messageReceived', messageData);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
