import { Types } from "mongoose";

import { connectDB } from "@/lib/mongodb";

import Message, { IMessage } from "@/models/Message";

export class MessageService {
  /**
   * Create a new message
   */
  static async createMessage(data: {
    chatId: string;
    userId: string;
    role: "user" | "assistant" | "system";
    content: string;
    sources?: string[];
    aiModel?: string;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  }): Promise<IMessage> {
    await connectDB();

    const message = await Message.create({
      chatId: data.chatId,
      userId: data.userId,
      role: data.role,
      content: data.content,
      sources: data.sources ?? [],
      aiModel: data.aiModel ?? "gpt-5.5",
      promptTokens: data.promptTokens ?? 0,
      completionTokens: data.completionTokens ?? 0,
      totalTokens: data.totalTokens ?? 0,
    });

    return message;
  }

  /**
   * Get message by ID
   */
  static async getMessageById(messageId: string) {
    await connectDB();

    return Message.findById(messageId);
  }

  /**
   * Get all messages of a chat
   */
  static async getChatMessages(chatId: string) {
    await connectDB();

    return Message.find({
      chatId,
    }).sort({
      createdAt: 1,
    });
  }

  /**
   * Get recent messages of a chat
   */
  static async getRecentMessages(
    chatId: string,
    limit = 20
  ) {
    await connectDB();

    const messages = await Message.find({
      chatId,
    })
      .sort({
        createdAt: -1,
      })
      .limit(limit);

    return messages.reverse();
  }

  /**
   * Delete one message
   */
  static async deleteMessage(messageId: string) {
    await connectDB();

    return Message.findByIdAndDelete(messageId);
  }

  /**
   * Delete all messages of a chat
   */
  static async deleteChatMessages(chatId: string) {
    await connectDB();

    return Message.deleteMany({
      chatId,
    });
  }

  /**
   * Count messages in a chat
   */
  static async countMessages(chatId: string) {
    await connectDB();

    return Message.countDocuments({
      chatId,
    });
  }

  /**
   * Validate ObjectId
   */
  static isValidId(id: string) {
    return Types.ObjectId.isValid(id);
  }
}