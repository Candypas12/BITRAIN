import { connectDB } from "@/lib/mongodb";
import { env } from "@/lib/env";

export async function GET() {
  try {
    await connectDB();

    return Response.json({
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        openai: !!env.OPENAI_API_KEY,
        auth: true,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        status: "unhealthy",
        database: "disconnected",
      },
      {
        status: 500,
      }
    );
  }
}