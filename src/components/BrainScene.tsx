import { useState, useCallback, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { BrainModel } from './BrainModel'
import { BrainRegionPoint, REGION_POSITIONS_3D, BASE_CONNECTIONS } from './BrainRegion'
import NeuralConnection from './NeuralConnection'
import RegionTooltip from './RegionTooltip'
import { useIsMobile } from '../hooks/useIsMobile'
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

// Animate the camera to face the selected region (mobile only)
function CameraController({
    controlsRef,
    targetAzimuth,
}: {
    controlsRef: React.RefObject<any>
    targetAzimuth: number | null
}) {
    useFrame((_, delta) => {
        if (!controlsRef.current || targetAzimuth === null) return
        const cur = controlsRef.current.getAzimuthalAngle()
        let diff = targetAzimuth - cur
        // shortest angle difference (-PI, PI)
        if (diff > Math.PI) diff -= 2 * Math.PI
        if (diff < -Math.PI) diff += 2 * Math.PI
        if (Math.abs(diff) > 0.005) {
            controlsRef.current.setAzimuthalAngle(cur + diff * Math.min(delta * 3, 1))
            controlsRef.current.update()
        }
    })
    return null
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
    const isMobile = useIsMobile()
    const controlsRef = useRef<any>(null)
    const [mouse, setMouse] = useState({ x: 0, y: 0 })
    const hoveredRegion = hoveredId ? regions.find(r => r.id === hoveredId) ?? null : null

    const activeConnSet = new Set(
        activeConnections.map(([a, b]) => [a, b].sort().join('|'))
    )

    // Azimuth target to face the hovered region (mobile only)
    const targetAzimuth = useMemo(() => {
        if (!isMobile || !hoveredId) return null
        const rp = REGION_POSITIONS_3D.find(r => r.id === hoveredId)
        if (!rp) return null
        // The camera starts facing the front (z-) and rotates around the y-axis, so we calculate the angle in the xz-plane to face the region center
        return Math.atan2(rp.position[0], rp.position[2])
    }, [isMobile, hoveredId])

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        setMouse({ x: e.clientX, y: e.clientY })
    }, [])

    const cameraPosition: [number, number, number] = isMobile ? [0, 1.5, 12] : [0, 1.5, 6]

    return (
        <div
            className={`${styles.wrapper} ${hoveredId ? styles.cursorPointer : ''}`}
            onMouseMove={handleMouseMove}
        >
            <Canvas
                camera={{ position: cameraPosition, fov: 50 }}
                gl={{ alpha: true, antialias: true }}
                className={styles.canvas}
            >
                {/* Light ambient */}
                <ambientLight intensity={0.5} />
                {/* Key light front */}
                <pointLight position={[4, 6, 4]} intensity={2.0} color="#ffffff" />
                {/* Blue fill*/}
                <pointLight position={[-4, -2, -4]} intensity={0.8} color="#4080ff" />
                {/* Warm backlight */}
                <pointLight position={[0, 1, -5]} intensity={3.0} color="#fff5e0" />
                {/* Cool rim light */}
                <pointLight position={[0, 0, -4]} intensity={1.2} color="#6090ff" />

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
                                isMobile={isMobile}
                                onHover={onHover}
                                onActivate={onActivate}
                            />
                        )
                    })}
                </Suspense>

                {/* Controller auto rotation (mobile only) */}
                <CameraController controlsRef={controlsRef} targetAzimuth={targetAzimuth} />

                <OrbitControls
                    ref={controlsRef}
                    enablePan={false}
                    minDistance={isMobile ? 4 : 3}
                    maxDistance={isMobile ? 12 : 10}
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
