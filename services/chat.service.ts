import { Types } from "mongoose";

import { connectDB } from "@/lib/mongodb";

import Chat, { IChat } from "@/models/Chat";

export class ChatService {
  /**
   * Create a new chat
   */
  static async createChat(data: {
    userId: string;
    title?: string;
  }): Promise<IChat> {
    await connectDB();

    const chat = await Chat.create({
      userId: data.userId,
      title: data.title ?? "New Chat",
    });

    return chat;
  }

  /**
   * Get chat by ID
   */
  static async getChatById(chatId: string) {
    await connectDB();

    return Chat.findById(chatId);
  }

  /**
   * Get all chats of a user
   */
  static async getUserChats(userId: string) {
    await connectDB();

    return Chat.find({
      userId,
    }).sort({
      isPinned: -1,
      updatedAt: -1,
    });
  }

  /**
   * Update chat title
   */
  static async updateTitle(
    chatId: string,
    title: string
  ) {
    await connectDB();

    return Chat.findByIdAndUpdate(
      chatId,
      {
        title,
      },
      {
        new: true,
      }
    );
  }

  /**
   * Update last message preview
   */
  static async updateLastMessage(
    chatId: string,
    message: string
  ) {
    await connectDB();

    return Chat.findByIdAndUpdate(
      chatId,
      {
        lastMessage: message,
      },
      {
        new: true,
      }
    );
  }

  /**
   * Increment message count
   */
  static async incrementMessageCount(
    chatId: string
  ) {
    await connectDB();

    return Chat.findByIdAndUpdate(
      chatId,
      {
        $inc: {
          messageCount: 1,
        },
      },
      {
        new: true,
      }
    );
  }

  /**
   * Pin / Unpin chat
   */
  static async setPinned(
    chatId: string,
    isPinned: boolean
  ) {
    await connectDB();

    return Chat.findByIdAndUpdate(
      chatId,
      {
        isPinned,
      },
      {
        new: true,
      }
    );
  }

  /**
   * Delete chat
   */
  static async deleteChat(chatId: string) {
    await connectDB();

    return Chat.findByIdAndDelete(chatId);
  }

  /**
   * Check ownership
   */
  static async belongsToUser(
    chatId: string,
    userId: string
  ) {
    await connectDB();

    const chat = await Chat.findOne({
      _id: chatId,
      userId,
    });

    return !!chat;
  }

  /**
   * Validate ObjectId
   */
  static isValidId(id: string) {
    return Types.ObjectId.isValid(id);
  }
}