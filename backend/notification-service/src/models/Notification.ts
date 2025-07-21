import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  type: 'post.created' | 'post.deleted';
  message: string;
  read: boolean;
  data: {
    postId?: string;
    reason?: string;
    sarcasmScore?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['post.created', 'post.deleted'],
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    data: {
      postId: String,
      reason: String,
      sarcasmScore: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema); 