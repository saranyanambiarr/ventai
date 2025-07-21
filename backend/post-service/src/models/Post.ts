import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  author: {
    id: mongoose.Types.ObjectId;
    username: string;
  };
  likes: mongoose.Types.ObjectId[];
  comments: {
    id: mongoose.Types.ObjectId;
    content: string;
    author: {
      id: mongoose.Types.ObjectId;
      username: string;
    };
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
  deletionReason?: string;
}

const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    comments: [{
      content: {
        type: String,
        required: true,
      },
      author: {
        id: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model<IPost>('Post', postSchema); 