import { auth } from "@/auth";
import { ApiResponseHandler } from "@/utils/api-response";
import { ChatService } from "@/services/chat.service";
import { MessageService } from "@/services/message.service";

interface RouteContext {
  params: Promise<{
    chatId: string;
  }>;
}

export async function GET(
  req: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return ApiResponseHandler.unauthorized(
        "Please login first."
      );
    }

    const { chatId } = await params;

    if (!ChatService.isValidId(chatId)) {
      return ApiResponseHandler.badRequest(
        "Invalid chat id."
      );
    }

    const hasAccess =
      await ChatService.belongsToUser(
        chatId,
        session.user.id
      );

    if (!hasAccess) {
      return ApiResponseHandler.forbidden(
        "Access denied."
      );
    }

    const messages =
      await MessageService.getChatMessages(
        chatId
      );

    return ApiResponseHandler.success(
      messages,
      "Messages fetched successfully."
    );
  } catch (error) {
    console.error(error);

    return ApiResponseHandler.error(
      "Unable to fetch messages."
    );
  }
}

export async function POST(
  req: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return ApiResponseHandler.unauthorized(
        "Please login first."
      );
    }

    const { chatId } = await params;

    if (!ChatService.isValidId(chatId)) {
      return ApiResponseHandler.badRequest(
        "Invalid chat id."
      );
    }

    const hasAccess =
      await ChatService.belongsToUser(
        chatId,
        session.user.id
      );

    if (!hasAccess) {
      return ApiResponseHandler.forbidden(
        "Access denied."
      );
    }

    const body = await req.json();

    const content = body.content?.trim();

    if (!content) {
      return ApiResponseHandler.badRequest(
        "Message content is required."
      );
    }

    const message =
      await MessageService.createMessage({
        chatId,
        userId: session.user.id,
        role: "user",
        content,
      });

    await ChatService.updateLastMessage(
      chatId,
      content
    );

    await ChatService.incrementMessageCount(
      chatId
    );

    return ApiResponseHandler.created(
      message,
      "Message created successfully."
    );
  } catch (error) {
    console.error(error);

    return ApiResponseHandler.error(
      "Unable to create message."
    );
  }
}