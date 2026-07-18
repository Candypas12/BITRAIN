import { NextResponse } from "next/server";

type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
};

export class ApiResponseHandler {
  static success<T>(
    data: T,
    message = "Success",
    status = 200
  ) {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };

    return NextResponse.json(response, { status });
  }

  static created<T>(
    data: T,
    message = "Created"
  ) {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };

    return NextResponse.json(response, { status: 201 });
  }

  static error(
    message = "Internal Server Error",
    status = 500,
    error?: unknown
  ) {
    const response: ApiResponse = {
      success: false,
      message,
      error:
        process.env.NODE_ENV === "development"
          ? error
          : undefined,
    };

    return NextResponse.json(response, { status });
  }

  static unauthorized(
    message = "Unauthorized"
  ) {
    return this.error(message, 401);
  }

  static forbidden(
    message = "Forbidden"
  ) {
    return this.error(message, 403);
  }

  static notFound(
    message = "Resource Not Found"
  ) {
    return this.error(message, 404);
  }

  static badRequest(
    message = "Bad Request"
  ) {
    return this.error(message, 400);
  }
}