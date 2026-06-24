import { useRef, useEffect, useCallback } from 'react'
import type { BrainRegion } from '../types'
import styles from './RegionChipBar.module.css'

interface RegionChipBarProps {
    regions: BrainRegion[]
    hoveredId: string | null
    activeId: string | null
    onHover: (id: string | null) => void
    onActivate: (id: string) => void
}

export default function RegionChipBar({
    regions,
    hoveredId,
    activeId,
    onHover,
    onActivate,
}: RegionChipBarProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const chipRefs = useRef<(HTMLDivElement | null)[]>([])

    const updateCenteredChip = useCallback(() => {
        const container = containerRef.current
        if (!container) return
        const center = container.scrollLeft + container.clientWidth / 2
        let closest: string | null = null
        let minDist = Infinity
        chipRefs.current.forEach((el, i) => {
            if (!el || !regions[i]) return
            const chipCenter = el.offsetLeft + el.offsetWidth / 2
            const dist = Math.abs(chipCenter - center)
            if (dist < minDist) {
                minDist = dist
                closest = regions[i].id
            }
        })
        onHover(closest)
    }, [regions, onHover])

    useEffect(() => {
        const timer = setTimeout(updateCenteredChip, 50)
        return () => clearTimeout(timer)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div
            ref={containerRef}
            className={styles.bar}
            onScroll={updateCenteredChip}
        >
            <div className={styles.spacer} />
            {regions.map((region, i) => {
                const isCenter = hoveredId === region.id
                const isActive = activeId === region.id
                return (
                    <div
                        key={region.id}
                        ref={el => { chipRefs.current[i] = el }}
                        className={`${styles.chip} ${isCenter ? styles.centered : ''} ${isActive ? styles.active : ''}`}
                        onClick={() => onActivate(region.id)}
                    >
                        <span
                            className={styles.dot}
                            style={{
                                background: region.color,
                                boxShadow: isCenter || isActive ? `0 0 10px ${region.color}cc` : 'none',
                            }}
                        />
                        <span
                            className={styles.label}
                            style={{ color: isCenter || isActive ? region.color : undefined }}
                        >
                            {region.title}
                        </span>
                    </div>
                )
            })}
            <div className={styles.spacer} />
        </div>
    )
}
