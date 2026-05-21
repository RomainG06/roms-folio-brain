import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { getRegionCenter } from './BrainRegion'

interface NeuralConnectionProps {
    fromId: string
    toId: string
    active: boolean
    color?: string
    index?: number
}

export default function NeuralConnection({
    fromId,
    toId,
    active,
    color = '#00d4ff',
    index = 0,
}: NeuralConnectionProps) {
    const from = getRegionCenter(fromId)
    const to = getRegionCenter(toId)

    // Point de contrôle Bézier : arc vers le haut entre les deux régions
    const mid = new THREE.Vector3(
        (from.x + to.x) / 2 + (to.z - from.z) * 0.2,
        Math.max(from.y, to.y) + 0.55,
        (from.z + to.z) / 2 + (from.x - to.x) * 0.15,
    )

    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(from.x, from.y, from.z),
        mid,
        new THREE.Vector3(to.x, to.y, to.z),
    )

    const points = curve.getPoints(32)
    const pulseRef = useRef<THREE.Mesh>(null)

    useFrame(({ clock }) => {
        if (!pulseRef.current || !active) return
        const t = ((clock.elapsedTime * 0.55 + index * 0.18) % 1)
        const pos = curve.getPoint(t)
        pulseRef.current.position.copy(pos)
    })

    return (
        <group>
            <Line
                points={points}
                color={color}
                lineWidth={active ? 1.0 : 0.4}
                transparent
                opacity={active ? 0.45 : 0.06}
                dashed={!active}
                dashSize={0.08}
                gapSize={0.15}
            />
            {/* Sphère voyageant le long de la connexion active */}
            {active && (
                <mesh ref={pulseRef}>
                    <sphereGeometry args={[0.028, 8, 8]} />
                    <meshBasicMaterial color={color} transparent opacity={0.9} />
                </mesh>
            )}
        </group>
    )
}
