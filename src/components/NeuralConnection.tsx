import { motion } from 'framer-motion'
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

    // Courbe de Bézier quadratique avec point de contrôle au centre du SVG
    const cx = (from.x + to.x) / 2 + (from.y - to.y) * 0.2
    const cy = (from.y + to.y) / 2 + (to.x - from.x) * 0.15
    const d = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`

    // Longueur approximée pour dasharray
    const len = Math.hypot(to.x - from.x, to.y - from.y) * 1.3

    return (
        <g style={{ pointerEvents: 'none' }}>
            {/* Ligne de base très discrète */}
            <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={0.4}
                strokeOpacity={active ? 0.15 : 0.04}
                strokeDasharray="3 6"
            />
            {/* Impulsion animée */}
            {active && (
                <motion.path
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth={1.2}
                    strokeLinecap="round"
                    initial={{ strokeDasharray: `0 ${len}`, strokeDashoffset: 0, opacity: 0 }}
                    animate={{
                        strokeDasharray: [`0 ${len}`, `${len * 0.35} ${len}`, `0 ${len}`],
                        strokeDashoffset: [-len * 0.0, -len * 1.2],
                        opacity: [0, 0.9, 0],
                    }}
                    transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.18,
                    }}
                    strokeOpacity={0.8}
                />
            )}
        </g>
    )
}
