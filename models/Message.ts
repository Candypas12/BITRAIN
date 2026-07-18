import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  userId: Types.ObjectId;

  role: "user" | "assistant" | "system";

  content: string;

  sources?: string[];

  aiModel: string;

  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;

  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    sources: {
      type: [String],
      default: [],
    },

    aiModel: {
      type: String,
      default: "gpt-5.5",
    },

    promptTokens: {
      type: Number,
      default: 0,
    },

    completionTokens: {
      type: Number,
      default: 0,
    },

    totalTokens: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ chatId: 1, createdAt: 1 });

MessageSchema.index({ userId: 1 });

const Message: Model<IMessage> =
  mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema);

export default Message;