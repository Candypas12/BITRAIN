import { auth } from "@/auth";
import { ApiResponseHandler } from "@/utils/api-response";
import { ChatService } from "@/services/chat.service";

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

    const belongsToUser =
      await ChatService.belongsToUser(
        chatId,
        session.user.id
      );

    if (!belongsToUser) {
      return ApiResponseHandler.forbidden(
        "Access denied."
      );
    }

    const chat =
      await ChatService.getChatById(chatId);

    if (!chat) {
      return ApiResponseHandler.notFound(
        "Chat not found."
      );
    }

    return ApiResponseHandler.success(
      chat,
      "Chat fetched successfully."
    );
  } catch (error) {
    console.error(error);

    return ApiResponseHandler.error(
      "Unable to fetch chat."
    );
  }
}

export async function PATCH(
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

    const belongsToUser =
      await ChatService.belongsToUser(
        chatId,
        session.user.id
      );

    if (!belongsToUser) {
      return ApiResponseHandler.forbidden(
        "Access denied."
      );
    }

    const body = await req.json();

    const title = body.title?.trim();

    if (!title) {
      return ApiResponseHandler.badRequest(
        "Title is required."
      );
    }

    const updatedChat =
      await ChatService.updateTitle(
        chatId,
        title
      );

    return ApiResponseHandler.success(
      updatedChat,
      "Chat updated successfully."
    );
  } catch (error) {
    console.error(error);

    return ApiResponseHandler.error(
      "Unable to update chat."
    );
  }
}

export async function DELETE(
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

    const belongsToUser =
      await ChatService.belongsToUser(
        chatId,
        session.user.id
      );

    if (!belongsToUser) {
      return ApiResponseHandler.forbidden(
        "Access denied."
      );
    }

    await ChatService.deleteChat(chatId);

    return ApiResponseHandler.success(
      null,
      "Chat deleted successfully."
    );
  } catch (error) {
    console.error(error);

    return ApiResponseHandler.error(
      "Unable to delete chat."
    );
  }
}