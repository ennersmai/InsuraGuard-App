<template>
  <canvas ref="canvasRef" class="absolute inset-0 pointer-events-none" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement>()
let animationId: number

// Simple Perlin noise implementation
class PerlinNoise {
  private permutation: number[]

  constructor() {
    this.permutation = []
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i
    }
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]]
    }
    for (let i = 0; i < 256; i++) {
      this.permutation[256 + i] = this.permutation[i]
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a)
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 15
    const u = h < 8 ? x : y
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }

  noise(x: number, y: number): number {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    x -= Math.floor(x)
    y -= Math.floor(y)
    const u = this.fade(x)
    const v = this.fade(y)
    const A = this.permutation[X] + Y
    const B = this.permutation[X + 1] + Y
    return this.lerp(v,
      this.lerp(u, this.grad(this.permutation[A], x, y), this.grad(this.permutation[B], x - 1, y)),
      this.lerp(u, this.grad(this.permutation[A + 1], x, y - 1), this.grad(this.permutation[B + 1], x - 1, y - 1))
    )
  }
}

class Ray {
  x: number = 0
  y: number = 0
  angle: number = 0
  length: number = 0
  speed: number = 0
  opacity: number = 0
  noiseOffset: number = 0

  constructor(canvasWidth: number, canvasHeight: number) {
    this.reset(canvasWidth, canvasHeight)
  }

  reset(canvasWidth: number, canvasHeight: number) {
    // Start from top-right corner
    this.x = canvasWidth
    this.y = 0
    this.angle = Math.random() * Math.PI * 0.5 - Math.PI * 0.25 // -45 to 45 degrees
    this.length = Math.random() * 150 + 100
    this.speed = Math.random() * 2 + 1
    this.opacity = 0
    this.noiseOffset = Math.random() * 1000
  }

  update(noise: PerlinNoise, time: number, canvasWidth: number, canvasHeight: number) {
    // Use Perlin noise for organic movement
    const noiseValue = noise.noise(
      this.x * 0.003 + this.noiseOffset,
      this.y * 0.003 + time * 0.0001
    )
    
    // Update angle based on noise
    this.angle += (noiseValue - 0.5) * 0.02
    
    // Move along angle
    this.x += Math.cos(this.angle) * this.speed
    this.y += Math.sin(this.angle) * this.speed
    
    // Update opacity based on distance from corner
    const distance = Math.sqrt(Math.pow(this.x - canvasWidth, 2) + Math.pow(this.y, 2))
    this.opacity = Math.max(0, 1 - distance / 400) * 0.6
    
    // Reset if out of bounds or too faded
    if (this.x < -50 || this.x > canvasWidth + 50 || 
        this.y < -50 || this.y > canvasHeight + 50 || 
        this.opacity < 0.01) {
      this.reset(canvasWidth, canvasHeight)
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.opacity <= 0) return
    
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.strokeStyle = `rgba(255, 220, 120, ${this.opacity})`
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    const endX = this.x - Math.cos(this.angle) * this.length
    const endY = this.y - Math.sin(this.angle) * this.length
    ctx.lineTo(endX, endY)
    ctx.stroke()
    
    // Add glow effect
    ctx.globalAlpha = this.opacity * 0.3
    ctx.lineWidth = 6
    ctx.strokeStyle = `rgba(255, 230, 140, ${this.opacity})`
    ctx.stroke()
    
    ctx.restore()
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = canvas.offsetHeight
  }

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  const noise = new PerlinNoise()
  const rays: Ray[] = []
  const rayCount = 25

  // Initialize rays
  for (let i = 0; i < rayCount; i++) {
    rays.push(new Ray(canvas.width, canvas.height))
  }

  let time = 0

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Update and draw rays
    rays.forEach(ray => {
      ray.update(noise, time, canvas.width, canvas.height)
      ray.draw(ctx)
    })
    
    time += 1
    animationId = requestAnimationFrame(animate)
  }

  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>
