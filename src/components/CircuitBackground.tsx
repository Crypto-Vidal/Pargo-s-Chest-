'use client'

import { useEffect, useRef } from 'react'

export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Circuit board configuration
    const gridSize = 100
    const nodeRadius = 3
    const lineWidth = 1

    // Generate circuit nodes
    const nodes: Array<{ x: number; y: number }> = []
    for (let x = gridSize; x < canvas.width; x += gridSize) {
      for (let y = gridSize; y < canvas.height; y += gridSize) {
        // Random offset for organic feel
        const offsetX = (Math.random() - 0.5) * 20
        const offsetY = (Math.random() - 0.5) * 20
        nodes.push({ x: x + offsetX, y: y + offsetY })
      }
    }

    // Generate connections between nearby nodes
    const connections: Array<[number, number]> = []
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i >= j) return
        const dx = node.x - otherNode.x
        const dy = node.y - otherNode.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Connect nodes within range
        if (distance < gridSize * 1.5 && Math.random() > 0.5) {
          connections.push([i, j])
        }
      })
    })

    // Lightning bolts
    const lightningPaths: Array<{
      path: number[]
      progress: number
      speed: number
      delay: number
    }> = []

    // Create 4 lightning paths
    for (let i = 0; i < 4; i++) {
      const pathLength = Math.floor(Math.random() * 5) + 4
      const path: number[] = []

      let currentNode = Math.floor(Math.random() * nodes.length)
      path.push(currentNode)

      // Build a path through connected nodes
      for (let j = 0; j < pathLength; j++) {
        const possibleNext = connections
          .filter(([a, b]) => a === currentNode || b === currentNode)
          .map(([a, b]) => (a === currentNode ? b : a))
          .filter((n) => !path.includes(n))

        if (possibleNext.length === 0) break

        currentNode = possibleNext[Math.floor(Math.random() * possibleNext.length)]
        path.push(currentNode)
      }

      lightningPaths.push({
        path,
        progress: 0,
        speed: 0.005 + Math.random() * 0.003,
        delay: i * 0.25,
      })
    }

    let animationTime = 0

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw radial gradients
      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.2,
        canvas.height * 0.3,
        0,
        canvas.width * 0.2,
        canvas.height * 0.3,
        canvas.width * 0.5
      )
      gradient1.addColorStop(0, 'rgba(37, 99, 235, 0.03)')
      gradient1.addColorStop(1, 'transparent')

      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.8,
        canvas.height * 0.7,
        0,
        canvas.width * 0.8,
        canvas.height * 0.7,
        canvas.width * 0.5
      )
      gradient2.addColorStop(0, 'rgba(37, 99, 235, 0.03)')
      gradient2.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw circuit lines
      ctx.strokeStyle = 'rgba(26, 35, 50, 0.6)'
      ctx.lineWidth = lineWidth
      connections.forEach(([i, j]) => {
        const nodeA = nodes[i]
        const nodeB = nodes[j]
        ctx.beginPath()
        ctx.moveTo(nodeA.x, nodeA.y)
        ctx.lineTo(nodeB.x, nodeB.y)
        ctx.stroke()
      })

      // Draw circuit nodes
      ctx.fillStyle = 'rgba(37, 99, 235, 0.8)'
      nodes.forEach((node) => {
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2)
        ctx.fill()

        // Node glow
        const glow = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          8
        )
        glow.addColorStop(0, 'rgba(37, 99, 235, 0.6)')
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw lightning animations
      animationTime += 0.016
      lightningPaths.forEach((lightning) => {
        const { path, speed, delay } = lightning

        // Calculate progress with delay
        const adjustedTime = Math.max(0, animationTime - delay)
        lightning.progress = (adjustedTime * speed) % 1

        // Fade in/out based on progress
        let opacity = 0
        if (lightning.progress < 0.2) {
          opacity = lightning.progress / 0.2
        } else if (lightning.progress > 0.8) {
          opacity = (1 - lightning.progress) / 0.2
        } else {
          opacity = 1
        }

        // Draw lightning path
        for (let i = 0; i < path.length - 1; i++) {
          const segmentProgress = i / (path.length - 1)
          const nextSegmentProgress = (i + 1) / (path.length - 1)

          // Only draw if this segment is in the current progress range
          if (
            lightning.progress >= segmentProgress - 0.2 &&
            lightning.progress <= nextSegmentProgress + 0.2
          ) {
            const nodeA = nodes[path[i]]
            const nodeB = nodes[path[i + 1]]

            // Main lightning bolt
            ctx.strokeStyle = `rgba(96, 165, 250, ${opacity * 0.8})`
            ctx.lineWidth = 2
            ctx.shadowBlur = 20
            ctx.shadowColor = 'rgba(96, 165, 250, 0.6)'
            ctx.beginPath()
            ctx.moveTo(nodeA.x, nodeA.y)
            ctx.lineTo(nodeB.x, nodeB.y)
            ctx.stroke()

            // Outer glow
            ctx.strokeStyle = `rgba(96, 165, 250, ${opacity * 0.3})`
            ctx.lineWidth = 6
            ctx.shadowBlur = 30
            ctx.beginPath()
            ctx.moveTo(nodeA.x, nodeA.y)
            ctx.lineTo(nodeB.x, nodeB.y)
            ctx.stroke()
          }
        }

        // Reset shadow
        ctx.shadowBlur = 0
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
