import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "BITRAIN - Your AI Academic Assistant",
  description: "BITRAIN helps engineering students access previous year questions, notes, syllabus, study plans and AI-powered academic guidance.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/LOGO-LIGHT.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/LOGO-DARK.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/LOGO-DARK.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
