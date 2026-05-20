import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import '../styles/globals.css'
import IntroScreen from './IntroScreen'
import BrainScene from './BrainScene'
import ProjectPanel from './ProjectPanel'
import ContactBar from './ContactBar'
import TopNav from './TopNav'
import ParticleBackground from './ParticleBackground'
import { useBrainInteraction } from '../hooks/useBrainInteraction'
import styles from './AppShell.module.css'

export default function AppShell() {
    const [showIntro, setShowIntro] = useState(true)
    const {
        regions,
        hoveredId,
        setHoveredId,
        activeId,
        activeRegion,
        activeProjects,
        litRegionIds,
        activeConnections,
        activate,
        clear,
    } = useBrainInteraction()

    // Fermer le panel avec Échap
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') clear()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [clear])

    return (
        <div className={styles.root}>
            <ParticleBackground />

            <AnimatePresence mode="wait">
                {showIntro ? (
                    <IntroScreen key="intro" onComplete={() => setShowIntro(false)} />
                ) : (
                    <div key="main" className={styles.main}>
                        <TopNav />
                        <BrainScene
                            regions={regions}
                            hoveredId={hoveredId}
                            activeId={activeId}
                            litRegionIds={litRegionIds}
                            activeConnections={activeConnections}
                            onHover={setHoveredId}
                            onActivate={activate}
                        />
                        <ProjectPanel
                            region={activeRegion}
                            projects={activeProjects}
                            onClose={clear}
                        />
                        <ContactBar />
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
