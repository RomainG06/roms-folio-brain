import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { BrainRegion } from '../types'

export interface RegionPosition {
    id: string
    position: [number, number, number]
}

export const REGION_POSITIONS_3D: RegionPosition[] = [
    // ── Left hemisphere (LOGIC) ──────────────────
    { id: 'android-mobile', position: [1, 1, 0.8] },
    { id: 'backend-api', position: [-0.8, 1.5, 0.2] },
    { id: 'devops-archi', position: [-1.2, 0.4, 0.8] },
    // ── Right hemisphere (CREATIVE) ────────────────
    { id: 'flutter', position: [-1, 0.5, -1.3] },
    { id: 'react-web', position: [1.6, -0.2, -1.2] },
    { id: 'angular', position: [1.2, 1.2, -0.5] },
    { id: 'creative-uiux', position: [0.2, 0.8, -0.5] },
    { id: 'video-games', position: [0.8, -0.5, -1.5] },
]

// Connections between regions (id-id pairs)
export const BASE_CONNECTIONS: Array<[string, string]> = [
    ['backend-api', 'devops-archi'],
    ['devops-archi', 'android-mobile'],
    ['backend-api', 'android-mobile'],
    ['flutter', 'angular'],
    ['react-web', 'angular'],
    ['react-web', 'creative-uiux'],
    ['flutter', 'creative-uiux'],
    // Left ↔ right bridge
    ['devops-archi', 'flutter'],
    ['backend-api', 'angular'],
    ['video-games', 'creative-uiux'],
    ['video-games', 'backend-api'],
]

// 3D center of a region (used by NeuralConnection)
export function getRegionCenter(id: string): { x: number; y: number; z: number } {
    const r = REGION_POSITIONS_3D.find(p => p.id === id)
    return r ? { x: r.position[0], y: r.position[1], z: r.position[2] } : { x: 0, y: 0, z: 0 }
}

interface BrainRegionPointProps {
    region: BrainRegion
    position: [number, number, number]
    isHovered: boolean
    isActive: boolean
    isLit: boolean
    isMobile?: boolean
    onHover: (id: string | null) => void
    onActivate: (id: string) => void
}

export function BrainRegionPoint({
    region,
    position,
    isHovered,
    isActive,
    isLit,
    isMobile = false,
    onHover,
    onActivate,
}: BrainRegionPointProps) {
    const coreRadius = isMobile ? 0.12 : 0.09
    const haloRadius = isMobile ? 0.22 : 0.17
    const coreRef = useRef<THREE.Mesh>(null)
    const glowRef = useRef<THREE.Mesh>(null)
    const coreMatRef = useRef<THREE.MeshBasicMaterial>(null)
    const glowMatRef = useRef<THREE.MeshBasicMaterial>(null)
    const lightRef = useRef<THREE.PointLight>(null)
    const labelRef = useRef<HTMLSpanElement>(null)
    const targetScale = isActive ? 1.5 : isHovered ? 1.25 : 1.0

    useFrame((state, delta) => {
        if (!coreRef.current || !glowRef.current) return

        // Interpolation smooth de la scale
        const cur = coreRef.current.scale.x
        const next = THREE.MathUtils.lerp(cur, targetScale, Math.min(delta * 8, 1))
        coreRef.current.scale.setScalar(next)

        if (!isActive && !isHovered) {
            const t = state.clock.elapsedTime

            // Idle pulsation on the halo
            glowRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.15)

            // Unified organic blink: two sinusoids with incommensurable frequencies
            const blink = 0.5 + 0.5 * (Math.sin(t * 1.3) * Math.sin(t * 0.7))

            if (coreMatRef.current)
                coreMatRef.current.opacity = THREE.MathUtils.lerp(
                    isMobile ? 0.5 : 0.38,
                    isLit ? 0.9 : (isMobile ? 0.85 : 0.7),
                    blink
                )
            if (glowMatRef.current)
                glowMatRef.current.opacity = THREE.MathUtils.lerp(0.07, isMobile ? 0.32 : 0.22, blink)
            if (lightRef.current)
                lightRef.current.intensity = THREE.MathUtils.lerp(0.35, isLit ? 1.5 : 0.9, blink)
            if (labelRef.current)
                labelRef.current.style.opacity = String(THREE.MathUtils.lerp(isMobile ? 0.45 : 0.5, 1, blink))
        } else {
            glowRef.current.scale.setScalar(1)
            if (labelRef.current)
                labelRef.current.style.opacity = isActive ? '1' : '0.9'
        }
    })

    const lightIntensity = isActive ? 4 : isHovered ? 2 : isLit ? 1 : 0.2

    return (
        <group position={position}>
            {/* Halo glow */}
            <mesh ref={glowRef} renderOrder={3}>
                <sphereGeometry args={[haloRadius, 16, 16]} />
                <meshBasicMaterial
                    ref={glowMatRef}
                    color={region.color}
                    transparent
                    depthTest={false}
                    opacity={isActive ? 0.25 : isHovered ? 0.16 : isMobile ? 0.12 : 0.04}
                    depthWrite={false}
                />
            </mesh>

            {/* Main interactive sphere */}
            <mesh
                ref={coreRef}
                renderOrder={3}
                onPointerOver={(e) => { e.stopPropagation(); onHover(region.id) }}
                onPointerOut={() => onHover(null)}
                onClick={(e) => { e.stopPropagation(); onActivate(region.id) }}
            >
                <sphereGeometry args={[coreRadius, 20, 20]} />
                <meshBasicMaterial
                    ref={coreMatRef}
                    color={region.color}
                    transparent
                    depthTest={false}
                    opacity={isActive ? 1 : isHovered ? 0.9 : isLit ? 0.75 : (isMobile ? 0.65 : 0.35)}
                />
            </mesh>

            {/* Light on brain */}
            <pointLight
                ref={lightRef}
                color={region.color}
                intensity={lightIntensity}
                distance={2.0}
                decay={2}
            />

            {/* Label HTML projected in screen-space */}
            <Html position={[0, 0.24, 0]} center zIndexRange={[15, 0]} style={{ pointerEvents: 'none' }}>
                <span
                    ref={labelRef}
                    style={{
                        color: region.color,
                        fontSize: isMobile ? '11px' : '9px',
                        fontFamily: 'Space Grotesk, sans-serif',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        opacity: isActive ? 1 : isHovered ? 0.9 : isMobile ? 0.6 : 0.4,
                        whiteSpace: 'nowrap',
                        userSelect: 'none',
                        textShadow: `0 0 8px ${region.color}cc`,
                    }}
                >
                    {region.title}
                </span>
            </Html>
        </group>
    )
}
