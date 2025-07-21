import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

let channel: amqp.Channel;

interface QueueMessage {
  type: string;
  data: Record<string, unknown>;
}

export const connectToQueue = async (): Promise<amqp.Channel> => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost');
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
};

export const publishToQueue = async (
  queueName: string,
  message: QueueMessage
): Promise<void> => {
  try {
    if (!channel) {
      throw new Error('Channel not initialized');
    }

    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      }
    );
  } catch (error) {
    console.error('Error publishing to queue:', error);
    throw error;
  }
};

export const consumeFromQueue = async (
  queueName: string,
  callback: (message: QueueMessage) => Promise<void>
): Promise<void> => {
  try {
    if (!channel) {
      throw new Error('Channel not initialized');
    }

    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.consume(queueName, async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString()) as QueueMessage;
        await callback(data);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Error consuming from queue:', error);
    throw error;
  }
}; 