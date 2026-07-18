import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IChat extends Document {
  userId: Types.ObjectId;
  title: string;
  lastMessage?: string;
  messageCount: number;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      default: "New Chat",
    },

    lastMessage: {
      type: String,
      default: "",
    },

    messageCount: {
      type: Number,
      default: 0,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Indexes
ChatSchema.index({ userId: 1, updatedAt: -1 });
ChatSchema.index({ userId: 1, isPinned: -1 });

const Chat: Model<IChat> =
  mongoose.models.Chat ||
  mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;