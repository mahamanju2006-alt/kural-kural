import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import complaintRoutes from './routes/complaintRoutes.js';
import officerRoutes from './routes/officerRoutes.js';
import { seedInitialData } from './db/seed.js';

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`⚡ Socket.IO client connected: ${socket.id}`);
});

// Mount Routes
app.use('/api', complaintRoutes);
app.use('/api/officer', officerRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', platform: 'KURAL KURAL Backend', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

// Start Server Listening Immediately
server.listen(PORT, () => {
  console.log(`🚀 KURAL KURAL Express Server listening immediately on http://localhost:${PORT}`);
});

// Connect Database Asynchronously
async function initDatabase() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kural_kural';
  try {
    console.log('Connecting to local MongoDB:', MONGO_URI);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('✅ Local MongoDB connected.');
  } catch (err) {
    console.warn('⚠️ Local MongoDB not found. Starting Mongo Memory Server...');
    try {
      const mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      await mongoose.connect(memUri);
      console.log('✅ Mongo Memory Server connected at:', memUri);
    } catch (memErr) {
      console.error('MongoMemoryServer error:', memErr);
    }
  }

  // Seed demo data
  await seedInitialData();
}

initDatabase();
