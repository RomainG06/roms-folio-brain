import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { BrainRegion } from '../types'

export interface RegionPosition {
    id: string
    position: [number, number, number]
}

// Coordonnées 3D sur la surface du cerveau
// (brain scalé à ≈4.4 unités de large, centré à l'origine)
// ⚠️ À ajuster visuellement une fois le modèle chargé
export const REGION_POSITIONS_3D: RegionPosition[] = [
    // ── Hémisphère gauche (LOGIC) ──────────────────
    { id: 'android-mobile', position: [-1.6, -0.5, 0.8] }, // temporal bas-gauche
    { id: 'backend-api', position: [-1.3, 0.8, 1.3] }, // frontal gauche
    { id: 'devops-archi', position: [-1.7, 0.9, -0.2] }, // pariétal gauche
    // ── Hémisphère droit (CREATIVE) ────────────────
    { id: 'flutter', position: [1.5, 0.3, 1.3] }, // temporal droit
    { id: 'react-web', position: [1.6, -0.2, -1.2] }, // occipital droit
    { id: 'angular', position: [1.2, 0.8, 1.4] }, // frontal droit
    { id: 'creative-uiux', position: [1.8, 0.9, 0.1] }, // pariétal droit
]

// Connexions entre régions (paires id-id)
export const BASE_CONNECTIONS: Array<[string, string]> = [
    ['backend-api', 'devops-archi'],
    ['devops-archi', 'android-mobile'],
    ['backend-api', 'android-mobile'],
    ['flutter', 'angular'],
    ['react-web', 'angular'],
    ['react-web', 'creative-uiux'],
    ['flutter', 'creative-uiux'],
    // Pont gauche ↔ droit
    ['devops-archi', 'flutter'],
    ['backend-api', 'angular'],
]

// Centre 3D d'une région (utilisé par NeuralConnection)
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
    onHover: (id: string | null) => void
    onActivate: (id: string) => void
}

export function BrainRegionPoint({
    region,
    position,
    isHovered,
    isActive,
    isLit,
    onHover,
    onActivate,
}: BrainRegionPointProps) {
    const coreRef = useRef<THREE.Mesh>(null)
    const glowRef = useRef<THREE.Mesh>(null)
    const targetScale = isActive ? 1.5 : isHovered ? 1.25 : 1.0

    useFrame((_, delta) => {
        if (!coreRef.current || !glowRef.current) return

        // Interpolation smooth de la scale
        const cur = coreRef.current.scale.x
        const next = THREE.MathUtils.lerp(cur, targetScale, Math.min(delta * 8, 1))
        coreRef.current.scale.setScalar(next)

        // Pulsation idle sur le halo quand inactif
        if (!isActive && !isHovered) {
            const t = Date.now() * 0.002
            glowRef.current.scale.setScalar(1 + Math.sin(t) * 0.15)
        } else {
            glowRef.current.scale.setScalar(1)
        }
    })

    const lightIntensity = isActive ? 4 : isHovered ? 2 : isLit ? 1 : 0.2

    return (
        <group position={position}>
            {/* Halo glow */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial
                    color={region.color}
                    transparent
                    opacity={isActive ? 0.2 : isHovered ? 0.13 : 0.04}
                    depthWrite={false}
                />
            </mesh>

            {/* Sphère principale interactive */}
            <mesh
                ref={coreRef}
                onPointerOver={(e) => { e.stopPropagation(); onHover(region.id) }}
                onPointerOut={() => onHover(null)}
                onClick={(e) => { e.stopPropagation(); onActivate(region.id) }}
            >
                <sphereGeometry args={[0.07, 20, 20]} />
                <meshBasicMaterial
                    color={region.color}
                    transparent
                    opacity={isActive ? 1 : isHovered ? 0.9 : isLit ? 0.65 : 0.35}
                />
            </mesh>

            {/* Lumière locale sur le cerveau */}
            <pointLight
                color={region.color}
                intensity={lightIntensity}
                distance={2.0}
                decay={2}
            />

            {/* Label HTML projeté en screen-space */}
            <Html position={[0, 0.24, 0]} center style={{ pointerEvents: 'none' }}>
                <span
                    style={{
                        color: region.color,
                        fontSize: '9px',
                        fontFamily: 'Space Grotesk, sans-serif',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        opacity: isActive ? 1 : isHovered ? 0.9 : 0.4,
                        whiteSpace: 'nowrap',
                        userSelect: 'none',
                        textShadow: `0 0 6px ${region.color}80`,
                        transition: 'opacity 0.2s',
                    }}
                >
                    {region.title}
                </span>
            </Html>
        </group>
    )
}
