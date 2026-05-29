import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { BrainRegion, Project } from '../types'
import styles from './ProjectPanel.module.css'

function getProjectDesc(project: Project, regionId: string | undefined): string {
    if (regionId && project.descriptionByRegion?.[regionId]) {
        return project.descriptionByRegion[regionId]
    }
    return project.description
}

function getProjectHighlights(project: Project, regionId: string | undefined): string[] {
    if (regionId && project.highlightsByRegion?.[regionId]) {
        return project.highlightsByRegion[regionId]
    }
    return project.highlights ?? []
}

interface ProjectPanelProps {
    region: BrainRegion | null
    projects: Project[]
    onClose: () => void
}

function ExternalIcon() {
    return (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

// ── Modal detail project ──────────────────────────────────────────────────────
function ProjectModal({ project, region, onClose }: {
    project: Project | null
    region: BrainRegion | null
    onClose: () => void
}) {
    const color = region?.color ?? '#00d4ff'

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        if (project) window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [project, onClose])

    return (
        <AnimatePresence>
            {project && (
                <>
                    {/* blurred backdrop */}
                    <motion.div
                        className={styles.modalBackdrop}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />

                    {/* Centered overlay (non-interactive) */}
                    <div className={styles.modalOverlay}>
                        <motion.div
                            className={styles.modal}
                            role="dialog" aria-modal="true" aria-label={`Détail — ${project.title}`}
                            initial={{ opacity: 0, scale: 0.94, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 20 }}
                            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                        >
                            {/* Accent bar */}
                            <div
                                className={styles.modalAccentBar}
                                style={{ background: `linear-gradient(90deg, ${color}, ${color}55 60%, transparent)` }}
                            />

                            {/* Close */}
                            <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Close">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>

                            <div className={styles.modalBody}>
                                {/* ── Left column ── */}
                                <div className={styles.modalLeft}>
                                    <div className={styles.modalMetaRow}>
                                        <span className={styles.modalCompany} style={{ color }}>{project.company}</span>
                                        <span className={styles.modalSep}>·</span>
                                        <span className={styles.modalYear}>{project.year}</span>
                                        {project.status && (
                                            <span className={`${styles.statusBadge} ${styles[`status_${project.status}`]}`}>
                                                {project.status === 'completed' ? 'Terminé' : project.status === 'in-progress' ? 'En cours' : 'POC'}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className={styles.modalTitle}>{project.title}</h2>
                                    <p className={styles.modalDesc}>{getProjectDesc(project, region?.id)}</p>

                                    {getProjectHighlights(project, region?.id).length > 0 && (
                                        <ul className={styles.highlightsList}>
                                            {getProjectHighlights(project, region?.id).map((h, i) => (
                                                <motion.li
                                                    key={i}
                                                    className={styles.highlightsItem}
                                                    style={{ '--accent': color } as React.CSSProperties}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 + i * 0.05 }}
                                                >
                                                    {h}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    )}

                                    {Object.keys(project.links).length > 0 && (
                                        <div className={styles.modalLinks}>
                                            {project.links.live && (
                                                <a href={project.links.live} target="_blank" rel="noopener noreferrer" className={styles.modalLinkBtn} style={{ '--accent': color } as React.CSSProperties}>
                                                    Live <ExternalIcon />
                                                </a>
                                            )}
                                            {project.links.android && (
                                                <a href={project.links.android} target="_blank" rel="noopener noreferrer" className={styles.modalLinkBtn} style={{ '--accent': color } as React.CSSProperties}>
                                                    Android <ExternalIcon />
                                                </a>
                                            )}
                                            {project.links.ios && (
                                                <a href={project.links.ios} target="_blank" rel="noopener noreferrer" className={styles.modalLinkBtn} style={{ '--accent': color } as React.CSSProperties}>
                                                    iOS <ExternalIcon />
                                                </a>
                                            )}
                                            {project.links.github && (
                                                <a href={project.links.github} target="_blank" rel="noopener noreferrer" className={styles.modalLinkBtn} style={{ '--accent': color } as React.CSSProperties}>
                                                    GitHub <ExternalIcon />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* ── Right column ── */}
                                <div className={styles.modalRight}>
                                    {region && (
                                        <div className={styles.modalRegionTag}>
                                            <span
                                                className={styles.modalRegionDot}
                                                style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                                            />
                                            <span>{region.title}</span>
                                        </div>
                                    )}
                                    <p className={styles.modalSectionLabel}>Stack technique</p>
                                    <div className={styles.modalTechGrid}>
                                        {project.technologies.map((t, i) => (
                                            <motion.span
                                                key={t}
                                                className={styles.modalTech}
                                                style={{ '--accent': color } as React.CSSProperties}
                                                initial={{ opacity: 0, scale: 0.85 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.08 + i * 0.04 }}
                                            >
                                                {t}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

// ── Panel principal ──────────────────────────────────────────────────────────
export default function ProjectPanel({ region, projects, onClose }: ProjectPanelProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    // Reset modal si le panel se ferme
    useEffect(() => {
        if (!region) setSelectedProject(null)
    }, [region])
    return (
        <>
            <AnimatePresence>
                {region && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className={styles.backdrop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                        />

                        {/* Panel */}
                        <motion.aside
                            className={styles.panel}
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                            aria-label={`Projets — ${region.title}`}
                        >
                            {/* Header */}
                            <div className={styles.header}>
                                <div className={styles.headerLeft}>
                                    <span className={styles.regionDot} style={{ background: region.color }} />
                                    <div>
                                        <h2 className={styles.regionTitle}>{region.title}</h2>
                                        <p className={styles.regionDesc}>{region.description}</p>
                                    </div>
                                </div>
                                <button className={styles.closeBtn} onClick={onClose} aria-label="Fermer">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>

                            {/* Technologies */}
                            <div className={styles.techList}>
                                {region.technologies.map(t => (
                                    <span key={t} className={styles.tech} style={{ borderColor: region.color + '40', color: region.color }}>
                                        {t}
                                    </span>
                                ))}
                            </div>

                            {/* Projects */}
                            <div className={styles.projects}>
                                <p className={styles.sectionLabel}>
                                    {projects.length} projet{projects.length > 1 ? 's' : ''}
                                </p>
                                {[...projects].sort((a, b) => {
                                    const endYear = (s: string) => parseInt(s.match(/\d{4}/g)?.at(-1) ?? '0')
                                    return endYear(b.year) - endYear(a.year)
                                }).map((project, i) => (
                                    <motion.div
                                        key={project.id}
                                        className={styles.projectCard}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.08 + i * 0.06 }}
                                        style={{ borderColor: region.color + '25', cursor: 'pointer' }}
                                        onClick={() => setSelectedProject(project)}
                                        title="Voir les détails"
                                    >
                                        <div className={styles.projectMeta}>
                                            <span className={styles.projectYear}>{project.year}</span>
                                            <span className={styles.projectCompany}>{project.company}</span>
                                            {project.status && (
                                                <span className={`${styles.statusBadge} ${styles[`status_${project.status}`]}`}>
                                                    {project.status === 'completed' ? 'Terminé' : project.status === 'in-progress' ? 'En cours' : 'POC'}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className={styles.projectTitle}>{project.title}</h3>
                                        <p className={styles.projectDesc}>{getProjectDesc(project, region.id)}</p>
                                        <div className={styles.projectTechs}>
                                            {project.technologies.slice(0, 4).map(t => (
                                                <span key={t} className={styles.projectTech}>{t}</span>
                                            ))}
                                            {project.technologies.length > 4 && (
                                                <span className={styles.projectTech}>+{project.technologies.length - 4}</span>
                                            )}
                                        </div>
                                        {Object.keys(project.links).length > 0 && (
                                            <div className={styles.projectLinks} onClick={e => e.stopPropagation()}>
                                                {project.links.live && (
                                                    <a href={project.links.live} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                                        Live <ExternalIcon />
                                                    </a>
                                                )}
                                                {project.links.android && (
                                                    <a href={project.links.android} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                                        Android <ExternalIcon />
                                                    </a>
                                                )}
                                                {project.links.ios && (
                                                    <a href={project.links.ios} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                                        iOS <ExternalIcon />
                                                    </a>
                                                )}
                                                {project.links.github && (
                                                    <a href={project.links.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                                        GitHub <ExternalIcon />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                        <p className={styles.projectHint}>Cliquer pour les détails →</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <ProjectModal
                project={selectedProject}
                region={region}
                onClose={() => setSelectedProject(null)}
            />
        </>
    )
}
