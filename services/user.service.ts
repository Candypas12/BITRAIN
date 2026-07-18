import { Types } from "mongoose";

import { connectDB } from "@/lib/mongodb";

import User, { IUser } from "@/models/User";

export class UserService {
  /**
   * Create a user if one doesn't already exist.
   */
  static async createUser(data: {
    name: string;
    email: string;
    image?: string;
    provider?: string;
  }): Promise<IUser> {
    await connectDB();

    let user = await User.findOne({
      email: data.email,
    });

    if (user) {
      return user;
    }

    user = await User.create({
      name: data.name,
      email: data.email,
      image: data.image,
      provider: data.provider ?? "google",
      lastLogin: new Date(),
    });

    return user;
  }

  /**
   * Get user by Mongo ID
   */
  static async getUserById(userId: string) {
    await connectDB();

    return User.findById(userId);
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string) {
    await connectDB();

    return User.findOne({
      email,
    });
  }

  /**
   * Update login timestamp
   */
  static async updateLastLogin(userId: string) {
    await connectDB();

    return User.findByIdAndUpdate(
      userId,
      {
        lastLogin: new Date(),
      },
      {
        new: true,
      }
    );
  }

  /**
   * Update profile
   */
  static async updateProfile(
    userId: string,
    data: {
      name?: string;
      image?: string;
    }
  ) {
    await connectDB();

    return User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string) {
    await connectDB();

    return User.findByIdAndDelete(userId);
  }

  /**
   * Check if ObjectId is valid
   */
  static isValidId(id: string) {
    return Types.ObjectId.isValid(id);
  }
}