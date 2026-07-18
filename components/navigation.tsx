"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Navigation() {
  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-border/30 backdrop-blur-sm bg-background/50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image 
          src="/LOGO-LIGHT.png" 
          alt="BITRAIN" 
          width={40} 
          height={40}
          className="object-contain"
        />
        <div className="flex flex-col">
          <span className="text-lg font-bold text-foreground tracking-tight">BITRAIN</span>
          <span className="text-xs text-muted-foreground">AI Academic Assistant</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#home" className="text-muted-foreground hover:text-foreground transition-colors">
          Home
        </a>
        <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
          About
        </a>
        <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
          Features
        </a>
      </div>

      {/* CTA Button — TEMPORARY: goes straight to /dashboard until Google OAuth credentials are configured, see auth.ts */}
      <Button
        asChild
        className="btn-3d btn-glow gap-2 bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground hover:from-primary/70 hover:to-primary/50 backdrop-blur-sm border border-border/30 shadow-lg font-medium"
      >
        <Link href="/dashboard">Use BITRAIN</Link>
      </Button>
    </nav>
  )
}
