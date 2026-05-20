import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { BrainRegionShape, REGION_PATHS, BASE_CONNECTIONS } from './BrainRegion'
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

// Couleur de connexion selon les régions impliquées
function getConnectionColor(fromId: string, toId: string, regions: BrainRegion[]): string {
    const from = regions.find(r => r.id === fromId)
    const to = regions.find(r => r.id === toId)
    if (from?.side === 'right' && to?.side === 'right') return '#00d4ff'
    if (from?.side === 'left' && to?.side === 'left') return '#1a88ff'
    return '#4fc3f7' // pont gauche ↔ droit
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
    const svgRef = useRef<SVGSVGElement>(null)
    const hoveredRegion = hoveredId ? regions.find(r => r.id === hoveredId) ?? null : null

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        setMouse({ x: e.clientX, y: e.clientY })
    }, [])

    // Connexions à rendre : base discrètes + actives
    const allConnectionPairs = BASE_CONNECTIONS
    const activeConnSet = new Set(
        activeConnections.map(([a, b]) => [a, b].sort().join('|'))
    )

    return (
        <div className={styles.wrapper} onMouseMove={handleMouseMove}>
            <motion.svg
                ref={svgRef}
                viewBox="0 0 600 430"
                className={styles.svg}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                aria-label="Carte des compétences — cerveau interactif"
                role="img"
            >
                {/* Séparateur central discret */}
                <line
                    x1="300" y1="40" x2="300" y2="390"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth={1}
                    strokeDasharray="4 8"
                />

                {/* Labels hémisphères */}
                <text x="150" y="28" textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="10" letterSpacing="3" fontFamily="Space Grotesk">LOGIC</text>
                <text x="450" y="28" textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="10" letterSpacing="3" fontFamily="Space Grotesk">CREATIVE</text>

                {/* Connexions neuronales */}
                {allConnectionPairs.map(([a, b], i) => {
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

                {/* Régions */}
                {REGION_PATHS.map((path, i) => {
                    const region = regions.find(r => r.id === path.id)
                    if (!region) return null
                    return (
                        <motion.g
                            key={region.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                        >
                            <BrainRegionShape
                                region={region}
                                path={path}
                                isHovered={hoveredId === region.id}
                                isActive={activeId === region.id}
                                isLit={litRegionIds.has(region.id) && activeId !== region.id}
                                onHover={onHover}
                                onActivate={onActivate}
                            />
                            {/* Label de la région */}
                            <motion.text
                                x={path.labelX}
                                y={path.labelY + 3}
                                textAnchor="middle"
                                fontSize="9"
                                fontFamily="Space Grotesk"
                                fontWeight="500"
                                letterSpacing="1.5"
                                fill={region.color}
                                fillOpacity={activeId === region.id ? 1 : hoveredId === region.id ? 0.9 : 0.45}
                                style={{ pointerEvents: 'none', textTransform: 'uppercase' }}
                                animate={{
                                    fillOpacity: activeId === region.id ? 1 : hoveredId === region.id ? 0.9 : 0.45,
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                {region.title}
                            </motion.text>
                        </motion.g>
                    )
                })}
            </motion.svg>

            <RegionTooltip
                region={hoveredRegion}
                mouseX={mouse.x}
                mouseY={mouse.y}
            />
        </div>
    )
}
