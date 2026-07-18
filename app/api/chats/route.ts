import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { ApiResponseHandler } from "@/utils/api-response";
import { ChatService } from "@/services/chat.service";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return ApiResponseHandler.unauthorized(
        "Please login first."
      );
    }

    await connectDB();

    const chats = await ChatService.getUserChats(
      session.user.id
    );

    return ApiResponseHandler.success(
      chats,
      "Chats fetched successfully."
    );
  } catch (error) {
    console.error(error);

    return ApiResponseHandler.error(
      "Unable to fetch chats."
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return ApiResponseHandler.unauthorized(
        "Please login first."
      );
    }

    const body = await req.json();

    const title =
      body.title?.trim() || "New Chat";

    await connectDB();

    const chat = await ChatService.createChat({
      userId: session.user.id,
      title,
    });

    return ApiResponseHandler.created(
      chat,
      "Chat created successfully."
    );
  } catch (error) {
    console.error(error);

    return ApiResponseHandler.error(
      "Unable to create chat."
    );
  }
}