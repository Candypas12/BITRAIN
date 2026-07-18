"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ParticleOrb } from "@/components/particle-orb"

export function HeroSection() {
  return (
    <section id="home" className="relative flex flex-col items-center justify-center min-h-screen px-6 py-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="shader-orb shader-orb-1" />
        <div className="shader-orb shader-orb-2" />
        <div className="shader-orb shader-orb-3" />
      </div>

      <div className="absolute inset-0 opacity-[0.15] grid-background" />

      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl">
        {/* Particle Orb */}
        <div className="relative mb-12">
          <ParticleOrb />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 font-[var(--font-heading)] tracking-tight">
          BITRAIN
        </h1>

        {/* Subtitle */}
        <h2 className="text-2xl md:text-3xl text-secondary-foreground mb-6 font-[var(--font-heading)] font-semibold">
          Your AI Academic Assistant for Engineering Students
        </h2>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl leading-relaxed">
          BITRAIN helps students access previous year questions, notes, syllabus, study plans and AI-powered academic guidance. Everything you need for academic success in one intelligent platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* TEMPORARY: goes straight to /dashboard until Google OAuth credentials are configured, see auth.ts */}
          <Button
            asChild
            className="btn-3d btn-glow px-8 py-6 bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground hover:from-primary/70 hover:to-primary/50 backdrop-blur-sm border border-border/30 shadow-lg font-medium text-base"
          >
            <Link href="/dashboard">Use BITRAIN</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="btn-3d px-8 py-6 bg-transparent text-foreground border border-border/50 hover:bg-secondary/20 backdrop-blur-sm shadow-lg font-medium text-base"
          >
            <a href="#features">Learn More</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
