"use client"

import { Github } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="relative border-t border-border/30 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {/* About */}
          <div id="about">
            <h4 className="font-semibold text-foreground mb-4 font-[var(--font-heading)]">About</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              BITRAIN is an AI-powered academic assistant designed specifically for engineering students.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 font-[var(--font-heading)]">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 font-[var(--font-heading)]">Social</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/Candypas12/BITRAIN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/30 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image 
                src="/LOGO-LIGHT.png" 
                alt="BITRAIN Logo" 
                width={24} 
                height={24}
                className="object-contain"
              />
              <p className="text-muted-foreground text-sm">
                © 2026 BITRAIN. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
