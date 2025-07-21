import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import notificationRoutes from './routes/notificationRoutes';
import { connectToQueue, consumeFromQueue } from './services/queueService';
import { createNotification } from './controllers/notificationController';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notifications', notificationRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Connect to RabbitMQ and consume messages (optional for now)
connectToQueue()
  .then((channel) => {
    console.log('Connected to RabbitMQ');
    // Consume notifications from queue
    consumeFromQueue('notifications', async (message) => {
      try {
        const { userId, message: notificationMessage, data } = message.data;
        const type = message.type as 'post.created' | 'post.deleted';

        const notification = await createNotification(
          userId as string,
          type,
          notificationMessage as string,
          data as { postId?: string; reason?: string; sarcasmScore?: number; }
        );

        // Emit notification to connected clients
        io.emit(`notification:${userId}`, notification);
      } catch (error) {
        console.error('Error processing notification:', error);
      }
    });
  })
  .catch((error) => {
    console.error('RabbitMQ connection error (optional):', error);
    console.log('Continuing without RabbitMQ...');
  });

// Start server
const PORT = process.env.PORT || 3003;
httpServer.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
}); 