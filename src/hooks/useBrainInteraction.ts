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

    // IDs de toutes les régions illuminées quand une région est active
    // (la région active + toutes celles connectées via les projets multi-régions)
    const litRegionIds: Set<string> = new Set()
    if (activeId) {
        litRegionIds.add(activeId)
        activeProjects.forEach(p => p.regionIds.forEach(rid => litRegionIds.add(rid)))
    }

    // Paires de connexions à afficher (connexions directes de la région active)
    const activeConnections: Array<[string, string]> = []
    if (activeRegion) {
        activeRegion.connections.forEach(targetId => {
            activeConnections.push([activeRegion.id, targetId])
        })
        // Connexions via projets multi-régions
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
