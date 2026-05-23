import { useState, useCallback } from 'react'
import type { BrainRegion } from '../types'
import regionsData from '../data/brainRegions.json'
import projectsData from '../data/projects.json'
import type { Project } from '../types'

const regions = regionsData as BrainRegion[]
const projects = projectsData as Project[]

export function useBrainInteraction() {
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [activeId, setActiveId] = useState<string | null>(null)

    const activeRegion = activeId ? regions.find(r => r.id === activeId) ?? null : null
    const activeProjects = activeRegion
        ? projects.filter(p => activeRegion.projectIds.includes(p.id))
        : []

    // IDs of regions to "light up" (active region + all connected via multi-region projects)
    // (active hoveredId is handled separately in BrainScene for instant feedback on hover)
    const litRegionIds: Set<string> = new Set()
    if (activeId) {
        litRegionIds.add(activeId)
        activeProjects.forEach(p => p.regionIds.forEach(rid => litRegionIds.add(rid)))
    }

    // Pairs of region IDs to show connections between (for active region: direct connections + multi-region projects)
    // Direct connections are shown on hover (or scroll chip on mobile)
    // Multi-region project connections are reserved for click (activeId)
    const displayRegionId = activeId ?? hoveredId
    const displayRegion = displayRegionId ? regions.find(r => r.id === displayRegionId) ?? null : null
    const activeConnections: Array<[string, string]> = []
    if (displayRegion) {
        displayRegion.connections.forEach(targetId => {
            activeConnections.push([displayRegion.id, targetId])
        })
    }
    if (activeRegion) {
        // Connections via multi-region projects
        activeProjects.forEach(p => {
            if (p.regionIds.length > 1) {
                for (let i = 0; i < p.regionIds.length - 1; i++) {
                    activeConnections.push([p.regionIds[i], p.regionIds[i + 1]])
                }
            }
        })
    }

    const activate = useCallback((id: string) => {
        setActiveId(prev => (prev === id ? null : id))
    }, [])

    const clear = useCallback(() => {
        setActiveId(null)
    }, [])

    return {
        regions,
        projects,
        hoveredId,
        setHoveredId,
        activeId,
        activeRegion,
        activeProjects,
        litRegionIds,
        activeConnections,
        activate,
        clear,
    }
}
