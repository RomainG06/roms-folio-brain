import { motion } from 'framer-motion'
import type { BrainRegion } from '../types'

// Définition SVG des régions du cerveau
// viewBox 0 0 600 500
// Hémisphère gauche: x 20–290, hémisphère droit: x 310–580
// La forme générale est une silhouette de cerveau stylisée

interface RegionPath {
    id: string
    d: string
    labelX: number
    labelY: number
}

export const REGION_PATHS: RegionPath[] = [
    // ── CERVEAU GAUCHE ──────────────────────────────────────────────
    {
        // android-mobile — lobe temporal bas-gauche
        id: 'android-mobile',
        d: 'M 60 310 C 40 300 30 270 35 245 C 40 220 55 210 80 215 C 100 218 120 230 130 250 C 145 275 140 305 125 320 C 110 335 80 325 60 310 Z',
        labelX: 82,
        labelY: 268,
    },
    {
        // backend-api — lobe frontal gauche
        id: 'backend-api',
        d: 'M 90 130 C 75 105 80 75 105 60 C 130 45 165 50 185 70 C 205 90 205 120 190 145 C 175 168 150 175 125 168 C 100 160 92 150 90 130 Z',
        labelX: 147,
        labelY: 112,
    },
    {
        // devops-archi — lobe pariétal gauche (centre-gauche)
        id: 'devops-archi',
        d: 'M 110 230 C 95 210 92 185 100 165 C 112 145 135 140 160 148 C 185 158 198 180 195 205 C 192 228 175 245 152 248 C 128 250 118 245 110 230 Z',
        labelX: 150,
        labelY: 198,
    },
    // ── CERVEAU DROIT ────────────────────────────────────────────────
    {
        // flutter — lobe temporal haut-droite
        id: 'flutter',
        d: 'M 380 80 C 395 55 425 45 455 52 C 485 60 500 85 498 115 C 496 140 480 160 458 165 C 435 170 410 158 398 138 C 385 118 372 100 380 80 Z',
        labelX: 441,
        labelY: 110,
    },
    {
        // react-web — lobe occipital droite (bas-droite)
        id: 'react-web',
        d: 'M 440 295 C 455 272 480 265 505 272 C 530 280 545 305 540 330 C 535 352 515 368 492 365 C 468 362 448 345 442 322 C 438 310 437 303 440 295 Z',
        labelX: 492,
        labelY: 318,
    },
    {
        // angular — lobe frontal droite
        id: 'angular',
        d: 'M 320 155 C 315 130 325 105 345 92 C 368 78 398 82 412 102 C 425 120 422 148 408 165 C 393 183 368 188 348 178 C 330 168 322 168 320 155 Z',
        labelX: 368,
        labelY: 140,
    },
    {
        // creative-uiux — lobe pariétal droite
        id: 'creative-uiux',
        d: 'M 400 235 C 395 210 408 188 430 180 C 455 172 480 182 492 205 C 503 225 498 252 480 265 C 462 277 438 275 420 262 C 408 252 402 245 400 235 Z',
        labelX: 447,
        labelY: 225,
    },
]

// Connexions SVG entre régions (paires id-id)
export const BASE_CONNECTIONS: Array<[string, string]> = [
    ['backend-api', 'devops-archi'],
    ['devops-archi', 'android-mobile'],
    ['backend-api', 'android-mobile'],
    ['flutter', 'angular'],
    ['react-web', 'angular'],
    ['react-web', 'creative-uiux'],
    ['flutter', 'creative-uiux'],
    // Pont cerveau gauche ↔ droit
    ['devops-archi', 'flutter'],
    ['backend-api', 'angular'],
]

// Calcul du centre d'un path (approximation via labelX/labelY)
export function getRegionCenter(id: string): { x: number; y: number } {
    const r = REGION_PATHS.find(p => p.id === id)
    return r ? { x: r.labelX, y: r.labelY } : { x: 300, y: 250 }
}

interface BrainRegionProps {
    region: BrainRegion
    path: RegionPath
    isHovered: boolean
    isActive: boolean
    isLit: boolean
    onHover: (id: string | null) => void
    onActivate: (id: string) => void
}

export function BrainRegionShape({
    region,
    path,
    isHovered,
    isActive,
    isLit,
    onHover,
    onActivate,
}: BrainRegionProps) {
    const filterId = `glow-${region.id}`
    const intensity = isActive ? 1 : isHovered ? 0.75 : isLit ? 0.5 : 0.12

    return (
        <g>
            <defs>
                <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation={isActive ? 10 : isHovered ? 7 : 4} result="blur" />
                    <feColorMatrix
                        in="blur"
                        type="matrix"
                        values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${intensity * 3} 0`}
                        result="coloredBlur"
                    />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <motion.path
                d={path.d}
                fill={region.color}
                fillOpacity={isActive ? 0.3 : isHovered ? 0.22 : isLit ? 0.18 : 0.08}
                stroke={region.color}
                strokeWidth={isActive ? 1.5 : 1}
                strokeOpacity={isActive ? 0.9 : isHovered ? 0.7 : isLit ? 0.5 : 0.25}
                filter={`url(#${filterId})`}
                style={{ cursor: 'pointer' }}
                animate={{
                    fillOpacity: isActive ? 0.3 : isHovered ? 0.22 : isLit ? 0.18 : 0.08,
                    strokeOpacity: isActive ? 0.9 : isHovered ? 0.7 : isLit ? 0.5 : 0.25,
                }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => onHover(region.id)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onActivate(region.id)}
                role="button"
                aria-label={`Région ${region.title} — ${region.projectIds.length} projet(s)`}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onActivate(region.id)}
            />

            {/* Pulsation idle */}
            {!isActive && !isHovered && (
                <motion.path
                    d={path.d}
                    fill="none"
                    stroke={region.color}
                    strokeWidth={0.5}
                    strokeOpacity={0.15}
                    animate={{ strokeOpacity: [0.05, 0.2, 0.05] }}
                    transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ pointerEvents: 'none' }}
                />
            )}
        </g>
    )
}
