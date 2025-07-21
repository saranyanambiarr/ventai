import amqp from 'amqplib';
import { logger } from '../utils/logger';

interface QueueMessage {
  type: string;
  data: {
    postId?: string;
    userId?: string;
    [key: string]: any;
  };
}

let channel: amqp.Channel;

export const connectToQueue = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('posts');
    logger.info('Connected to RabbitMQ');
  } catch (error) {
    logger.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
};

export const publishToQueue = async (data: QueueMessage) => {
  try {
    channel.sendToQueue('posts', Buffer.from(JSON.stringify(data)));
    logger.info('Message published to queue:', data);
  } catch (error) {
    logger.error('Error publishing to queue:', error);
    throw error;
  }
};

export const consumeFromQueue = async (callback: (data: QueueMessage) => Promise<void>) => {
  try {
    channel.consume('posts', async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString()) as QueueMessage;
        await callback(data);
        channel.ack(msg);
      }
    });
    logger.info('Started consuming from queue');
  } catch (error) {
    logger.error('Error consuming from queue:', error);
    throw error;
  }
}; 