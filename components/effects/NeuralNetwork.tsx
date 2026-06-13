'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface NeuralNetworkProps {
  /** node + edge base color */
  accent?: string
  /** signal pulse color */
  accent2?: string
  className?: string
}

const NODE_COUNT = 56
const SECONDARY_RATIO = 0.35 // share of nodes tinted with accent2
const EDGE_DISTANCE = 22
const PULSE_COUNT = 10
const MAX_TILT = 0.14 // ~8deg

// keeps the center of the hero visually clear of nodes/edges
const CENTER_MASK =
  'radial-gradient(ellipse 46% 42% at 50% 44%, transparent 30%, black 74%)'

/**
 * Signature hero element: a slowly rotating 3D node graph with
 * signal pulses traveling along edges. Renders nothing (CSS gradient
 * fallback stays visible) on reduced-motion, low-power, or touch devices.
 */
export default function NeuralNetwork({
  accent = '#8b5cf6',
  accent2 = '#14b8a6',
  className = '',
}: NeuralNetworkProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const lowPower = (navigator.hardwareConcurrency ?? 8) < 4
    setEnabled(!reduced && !coarse && !lowPower)
  }, [])

  useEffect(() => {
    if (!enabled || !mountRef.current) return
    const mount = mountRef.current

    // ---- Scene setup ----
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 1, 200)
    camera.position.z = 55

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.domElement.style.willChange = 'transform'
    mount.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)

    // ---- Nodes — two depth layers (primary accent + smaller accent2) ----
    const nodePos: THREE.Vector3[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      // flattened ellipsoid cloud — wider than tall, like a layer diagram
      nodePos.push(new THREE.Vector3(
        (Math.random() - 0.5) * 84,
        (Math.random() - 0.5) * 42,
        (Math.random() - 0.5) * 38
      ))
    }
    const splitAt = Math.floor(NODE_COUNT * (1 - SECONDARY_RATIO))
    const makePoints = (verts: THREE.Vector3[], color: string, size: number, opacity: number) => {
      const geo = new THREE.BufferGeometry()
      const arr = new Float32Array(verts.length * 3)
      verts.forEach((v, i) => arr.set([v.x, v.y, v.z], i * 3))
      geo.setAttribute('position', new THREE.BufferAttribute(arr, 3))
      const mat = new THREE.PointsMaterial({
        color: new THREE.Color(color),
        size,
        sizeAttenuation: true,
        transparent: true,
        opacity,
        depthWrite: false,
      })
      group.add(new THREE.Points(geo, mat))
      return { geo, mat }
    }
    const primary = makePoints(nodePos.slice(0, splitAt), accent, 1.7, 0.9)
    const secondary = makePoints(nodePos.slice(splitAt), accent2, 1.1, 0.7)

    // ---- Edges (pairs within threshold distance) ----
    const edgePairs: [number, number][] = []
    const edgeVerts: number[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (nodePos[i].distanceTo(nodePos[j]) < EDGE_DISTANCE) {
          edgePairs.push([i, j])
          edgeVerts.push(...nodePos[i].toArray(), ...nodePos[j].toArray())
        }
      }
    }
    const edgeGeo = new THREE.BufferGeometry()
    edgeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgeVerts), 3))
    const edgeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(accent),
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    })
    group.add(new THREE.LineSegments(edgeGeo, edgeMat))

    // ---- Signal pulses traveling along random edges ----
    interface Pulse { edge: [number, number]; t: number; speed: number; mesh: THREE.Mesh }
    const pulseGeo = new THREE.SphereGeometry(0.9, 8, 8)
    const pulses: Pulse[] = []
    for (let i = 0; i < PULSE_COUNT; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(accent2),
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
      const mesh = new THREE.Mesh(pulseGeo, mat)
      group.add(mesh)
      pulses.push({
        edge: edgePairs[Math.floor(Math.random() * edgePairs.length)] ?? [0, 1],
        t: Math.random() * -2, // negative = waiting to fire
        speed: 0.35 + Math.random() * 0.4,
        mesh,
      })
    }

    // ---- Mouse parallax ----
    let targetX = 0
    let targetY = 0
    const onMouse = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2 * MAX_TILT
      targetY = (e.clientY / window.innerHeight - 0.5) * 2 * MAX_TILT
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    // ---- Animation loop (rAF, delta-time, pause when hidden) ----
    const clock = new THREE.Clock()
    let raf = 0
    let running = true

    const tick = () => {
      if (!running) return
      const dt = Math.min(clock.getDelta(), 0.05) // delta-time smoothing
      const t = clock.elapsedTime

      group.rotation.y += dt * 0.06
      group.rotation.x += (targetY - group.rotation.x) * dt * 2
      group.rotation.z += (targetX - group.rotation.z) * dt * 1.2

      // gentle breathing + node twinkle
      const breathe = 1 + Math.sin(t * 0.4) * 0.02
      group.scale.setScalar(breathe)
      primary.mat.opacity = 0.78 + Math.sin(t * 1.3) * 0.12
      secondary.mat.opacity = 0.58 + Math.sin(t * 1.7 + 2) * 0.12

      for (const p of pulses) {
        p.t += dt * p.speed
        if (p.t >= 1) {
          // re-fire along a new edge after a random pause
          p.edge = edgePairs[Math.floor(Math.random() * edgePairs.length)] ?? [0, 1]
          p.t = -Math.random() * 3
        }
        const visible = p.t >= 0 && p.t < 1
        const mat = p.mesh.material as THREE.MeshBasicMaterial
        if (visible) {
          const [a, b] = p.edge
          p.mesh.position.lerpVectors(nodePos[a], nodePos[b], p.t)
          // fade in/out at the ends of the journey
          mat.opacity = Math.sin(p.t * Math.PI) * 0.9
        } else {
          mat.opacity = 0
        }
      }

      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const start = () => {
      if (running) return
      running = true
      clock.getDelta() // discard pause-time delta
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    // pause when hero scrolls out of view
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    )
    io.observe(mount)

    // pause on tab blur
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)

    // resize — update camera + drawing buffer (no stale canvas scaling)
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
      primary.geo.dispose()
      primary.mat.dispose()
      secondary.geo.dispose()
      secondary.mat.dispose()
      edgeGeo.dispose()
      pulseGeo.dispose()
      edgeMat.dispose()
      pulses.forEach(p => (p.mesh.material as THREE.Material).dispose())
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [enabled, accent, accent2])

  if (!enabled) return null

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ maskImage: CENTER_MASK, WebkitMaskImage: CENTER_MASK }}
    />
  )
}
