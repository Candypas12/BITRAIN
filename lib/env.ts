/**
 * Centralized Environment Variable Validation
 * BITRAIN Backend
 */

function getEnvVariable(key: string): string {
  const value = process.env[key];

  if (!value || value.trim() === "") {
    throw new Error(
      `❌ Missing required environment variable: ${key}\nPlease check your .env.local file.`
    );
  }

  return value;
}

export const env = {
  // Application
  NODE_ENV: process.env.NODE_ENV ?? "development",
  NEXTAUTH_URL: getEnvVariable("NEXTAUTH_URL"),
  NEXTAUTH_SECRET: getEnvVariable("NEXTAUTH_SECRET"),

  // Google OAuth
  GOOGLE_CLIENT_ID: getEnvVariable("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnvVariable("GOOGLE_CLIENT_SECRET"),

  // MongoDB
  MONGODB_URI: getEnvVariable("MONGODB_URI"),

  // OpenAI
  OPENAI_API_KEY: getEnvVariable("OPENAI_API_KEY"),
} as const;