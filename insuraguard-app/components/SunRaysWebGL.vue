<template>
  <canvas 
    ref="canvasRef" 
    class="absolute inset-0 w-full h-full pointer-events-none"
    style="mix-blend-mode: screen;"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let positionBuffer: WebGLBuffer | null = null
let startTime = 0

const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_uv = a_position * 0.5 + 0.5;
}
`

const fragmentShaderSource = `
precision highp float;

varying vec2 v_uv;
uniform float u_time;
uniform vec2 u_resolution;

// Hash function for noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Smooth noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractal Brownian Motion - creates organic flowing patterns
float fbm(vec2 p, float time) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency + time * 0.1);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}

void main() {
  // Aspect ratio correction
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  
  // Sun position at top-right corner
  vec2 sunPos = vec2(1.0, 1.0);
  
  // Distance from sun with aspect correction
  vec2 toSun = uv - sunPos;
  toSun.x *= aspect;
  float dist = length(toSun);
  
  // Angle from sun center
  float angle = atan(toSun.y, toSun.x);
  
  // Create flowing noise field
  float time = u_time * 0.3;
  vec2 noisePos = toSun * 2.0;
  
  // Multiple noise layers for organic feel
  float n1 = fbm(noisePos + time, time);
  float n2 = fbm(noisePos * 2.0 - time * 0.5, time);
  float n3 = fbm(noisePos * 0.5 + time * 0.3, time);
  
  // Ray pattern - creates the sun ray streaks
  float rays = 0.0;
  for (float i = 0.0; i < 12.0; i++) {
    float rayAngle = i * 0.523598 + time * 0.1; // 30 degree spacing
    float rayWidth = 0.15 + 0.1 * sin(time + i);
    float ray = smoothstep(rayWidth, 0.0, abs(mod(angle - rayAngle + 3.14159, 6.28318) - 3.14159));
    ray *= smoothstep(1.0, 0.0, dist); // Slightly longer fade
    ray *= 0.3 + 0.7 * noise(vec2(i, time * 0.5)); // Flicker
    rays += ray;
  }
  
  // Sun core - bright visible center at corner
  float sunCore = smoothstep(0.25, 0.0, dist);
  sunCore = pow(sunCore, 1.2);
  
  // Core glow - softer halo around sun
  float coreGlow = smoothstep(0.5, 0.0, dist);
  coreGlow = pow(coreGlow, 2.0);
  
  // Outer glow with noise distortion
  float outerGlow = smoothstep(1.2, 0.0, dist);
  outerGlow *= 0.5 + 0.5 * n1;
  outerGlow *= 0.7 + 0.3 * n2;
  
  // Combine all elements - sun core is brightest
  float intensity = sunCore * 2.0 + coreGlow * 0.8 + outerGlow * 0.4 + rays * 0.5;
  
  // Add subtle pulsing
  intensity *= 0.9 + 0.1 * sin(time * 2.0);
  
  // Golden sun colors - less red, more golden/yellow
  vec3 coreColor = vec3(1.0, 0.97, 0.9);    // Soft white center
  vec3 midColor = vec3(1.0, 0.9, 0.6);      // Golden yellow mid
  vec3 outerColor = vec3(1.0, 0.8, 0.4);    // Golden outer (less red)
  
  // Color gradient based on distance
  vec3 color = mix(coreColor, midColor, smoothstep(0.0, 0.3, dist));
  color = mix(color, outerColor, smoothstep(0.2, 0.8, dist));
  
  // Apply intensity
  color *= intensity;
  
  // Remove chromatic aberration - keep colors clean
  vec3 finalColor = color;
  
  // Output with alpha for blending
  float alpha = clamp(intensity * 0.6, 0.0, 1.0);
  gl_FragColor = vec4(finalColor, alpha);
}
`

function compileShader(gl: WebGLRenderingContext, source: string, type: number): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function initWebGL() {
  const canvas = canvasRef.value
  if (!canvas) return false
  
  // Get parent dimensions
  const parent = canvas.parentElement
  if (parent) {
    canvas.width = parent.clientWidth
    canvas.height = parent.clientHeight
  }
  
  gl = canvas.getContext('webgl', { 
    alpha: true, 
    premultipliedAlpha: false,
    antialias: true 
  })
  
  if (!gl) {
    console.error('WebGL not supported')
    return false
  }
  
  // Compile shaders
  const vertShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER)
  const fragShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)
  
  if (!vertShader || !fragShader) return false
  
  // Create program
  program = gl.createProgram()
  if (!program) return false
  
  gl.attachShader(program, vertShader)
  gl.attachShader(program, fragShader)
  gl.linkProgram(program)
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program))
    return false
  }
  
  // Create full-screen quad
  positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1
  ]), gl.STATIC_DRAW)
  
  // Enable blending
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  
  return true
}

function render() {
  if (!gl || !program || !canvasRef.value) return
  
  const canvas = canvasRef.value
  
  // Clear with transparent
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  
  gl.useProgram(program)
  
  // Set uniforms
  const timeLocation = gl.getUniformLocation(program, 'u_time')
  const resLocation = gl.getUniformLocation(program, 'u_resolution')
  
  gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000)
  gl.uniform2f(resLocation, canvas.width, canvas.height)
  
  // Bind position attribute
  const posLocation = gl.getAttribLocation(program, 'a_position')
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.enableVertexAttribArray(posLocation)
  gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0)
  
  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, 6)
  
  animationId = requestAnimationFrame(render)
}

function handleResize() {
  const canvas = canvasRef.value
  const parent = canvas?.parentElement
  if (canvas && parent) {
    canvas.width = parent.clientWidth
    canvas.height = parent.clientHeight
  }
}

onMounted(() => {
  startTime = Date.now()
  
  if (initWebGL()) {
    render()
  }
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>
