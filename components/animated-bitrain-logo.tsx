'use client'

import { useEffect, useRef } from 'react'

export function AnimatedBitrainLogo({ className = "", size = 40 }: { className?: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      size: number
    }> = []

    let animationId: number

    const drawLogo = (x: number, y: number, scale: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.scale(scale, scale)

      // Draw cube structure
      const gradient = ctx.createLinearGradient(-20, -20, 20, 20)
      gradient.addColorStop(0, '#b7a9ff')
      gradient.addColorStop(1, '#8b7eff')

      ctx.fillStyle = gradient

      // Top cube
      ctx.beginPath()
      ctx.moveTo(0, -12)
      ctx.lineTo(12, -4)
      ctx.lineTo(0, 4)
      ctx.lineTo(-12, -4)
      ctx.closePath()
      ctx.fill()

      // Left and right structures
      ctx.globalAlpha = 0.8
      ctx.beginPath()
      ctx.moveTo(-12, -4)
      ctx.lineTo(-12, 8)
      ctx.lineTo(0, 12)
      ctx.lineTo(0, 4)
      ctx.closePath()
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(12, -4)
      ctx.lineTo(12, 8)
      ctx.lineTo(0, 12)
      ctx.lineTo(0, 4)
      ctx.closePath()
      ctx.fill()

      ctx.globalAlpha = 1

      ctx.restore()
    }

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(15, 15, 15, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw main logo
      drawLogo(centerX, centerY, 1.5)

      // Emit particles occasionally
      if (Math.random() > 0.85) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 2 + 1
        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 1,
          size: Math.random() * 2 + 1,
        })
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        p.x += p.vx
        p.y += p.vy
        p.life -= 0.02

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        gradient.addColorStop(0, `rgba(183, 169, 255, ${p.life})`)
        gradient.addColorStop(1, `rgba(139, 126, 255, ${p.life * 0.5})`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  )
}
