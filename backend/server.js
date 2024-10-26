require('dotenv').config();
console.log('MONGODB_URI:', process.env.MONGODB_URI); // Add this line
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const donationRoutes = require('./routes/donationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donations', donationRoutes);
app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
