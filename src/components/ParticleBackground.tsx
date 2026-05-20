import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 60

function Particles() {
    const pointsRef = useRef<THREE.Points>(null)

    const { geometry, speeds } = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3)
        const speeds = new Float32Array(PARTICLE_COUNT)
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 18
            positions[i * 3 + 1] = (Math.random() - 0.5) * 12
            positions[i * 3 + 2] = (Math.random() - 0.5) * 6
            speeds[i] = 0.0008 + Math.random() * 0.0012
        }
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        return { geometry: geo, speeds }
    }, [])

    const texture = useMemo(() => {
        const canvas = document.createElement('canvas')
        canvas.width = 64
        canvas.height = 64

        const ctx = canvas.getContext('2d')!
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)

        gradient.addColorStop(0, 'white')
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 64, 64)

        return new THREE.CanvasTexture(canvas)
    }, [])

    useFrame(() => {
        if (!pointsRef.current) return
        const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
        const arr = pos.array as Float32Array
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            arr[i * 3 + 1] += speeds[i]
            if (arr[i * 3 + 1] > 6) arr[i * 3 + 1] = -6
        }
        pos.needsUpdate = true
    })

    return (
        <points ref={pointsRef} geometry={geometry}>
            <pointsMaterial
                map={texture}
                transparent
                depthWrite={false}
                size={0.2}
                color="white"
            />
        </points>
    )
}

export default function ParticleBackground() {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
            }}
            aria-hidden="true"
        >
            <Canvas
                camera={{ position: [0, 0, 8], fov: 60 }}
                gl={{ antialias: false, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <Particles />
            </Canvas>
        </div>
    )
}
