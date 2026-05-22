import { useState, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { BrainModel } from './BrainModel'
import { BrainRegionPoint, REGION_POSITIONS_3D, BASE_CONNECTIONS } from './BrainRegion'
import NeuralConnection from './NeuralConnection'
import RegionTooltip from './RegionTooltip'
import type { BrainRegion } from '../types'
import styles from './BrainScene.module.css'

interface BrainSceneProps {
    regions: BrainRegion[]
    hoveredId: string | null
    activeId: string | null
    litRegionIds: Set<string>
    activeConnections: Array<[string, string]>
    onHover: (id: string | null) => void
    onActivate: (id: string) => void
}

function getConnectionColor(fromId: string, toId: string, regions: BrainRegion[]): string {
    const from = regions.find(r => r.id === fromId)
    const to = regions.find(r => r.id === toId)
    if (from?.side === 'right' && to?.side === 'right') return '#00d4ff'
    if (from?.side === 'left' && to?.side === 'left') return '#1a88ff'
    return '#4fc3f7'
}

export default function BrainScene({
    regions,
    hoveredId,
    activeId,
    litRegionIds,
    activeConnections,
    onHover,
    onActivate,
}: BrainSceneProps) {
    const [mouse, setMouse] = useState({ x: 0, y: 0 })
    const hoveredRegion = hoveredId ? regions.find(r => r.id === hoveredId) ?? null : null

    const activeConnSet = new Set(
        activeConnections.map(([a, b]) => [a, b].sort().join('|'))
    )

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        setMouse({ x: e.clientX, y: e.clientY })
    }, [])

    return (
        <div
            className={`${styles.wrapper} ${hoveredId ? styles.cursorPointer : ''}`}
            onMouseMove={handleMouseMove}
        >
            <Canvas
                camera={{ position: [0, 1.5, 6], fov: 50 }}
                gl={{ alpha: true, antialias: true }}
                className={styles.canvas}
            >
                {/* Ambient + directional lighting */}
                <ambientLight intensity={0.25} />
                <pointLight position={[4, 6, 4]} intensity={1.5} color="#ffffff" />
                <pointLight position={[-4, -2, -4]} intensity={0.6} color="#0040ff" />

                <Suspense fallback={null}>
                    {/* Brain 3D */}
                    <BrainModel />

                    {/* Neural connections */}
                    {BASE_CONNECTIONS.map(([a, b], i) => {
                        const key = [a, b].sort().join('|')
                        const isActive = activeConnSet.has(key)
                        return (
                            <NeuralConnection
                                key={key}
                                fromId={a}
                                toId={b}
                                active={isActive}
                                color={getConnectionColor(a, b, regions)}
                                index={i}
                            />
                        )
                    })}

                    {/* Interactive region points */}
                    {REGION_POSITIONS_3D.map((rp) => {
                        const region = regions.find(r => r.id === rp.id)
                        if (!region) return null
                        return (
                            <BrainRegionPoint
                                key={region.id}
                                region={region}
                                position={rp.position}
                                isHovered={hoveredId === region.id}
                                isActive={activeId === region.id}
                                isLit={litRegionIds.has(region.id) && activeId !== region.id}
                                onHover={onHover}
                                onActivate={onActivate}
                            />
                        )
                    })}
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    minDistance={3}
                    maxDistance={10}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={(Math.PI * 2) / 3}
                />
            </Canvas>

            <RegionTooltip
                region={hoveredRegion}
                mouseX={mouse.x}
                mouseY={mouse.y}
            />
        </div>
    )
}
