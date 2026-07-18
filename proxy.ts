import { auth } from "@/auth"

// TEMPORARY: the /dashboard redirect-when-signed-out guard is disabled until
// Google OAuth credentials are configured (see auth.ts / .env.local.example).
// Re-enable once sign-in actually works — re-import NextResponse from
// "next/server" and restore:
//   if (!req.auth) {
//     return NextResponse.redirect(new URL("/", req.nextUrl.origin))
//   }
// otherwise every visitor gets bounced back to "/".
export default auth((req) => {})

export const config = {
  matcher: ["/dashboard/:path*"],
}
