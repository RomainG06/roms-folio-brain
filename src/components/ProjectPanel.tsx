import { motion, AnimatePresence } from 'framer-motion'
import type { BrainRegion, Project } from '../types'
import styles from './ProjectPanel.module.css'

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

export default function ProjectPanel({ region, projects, onClose }: ProjectPanelProps) {
    return (
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

                        {/* Projets */}
                        <div className={styles.projects}>
                            <p className={styles.sectionLabel}>
                                {projects.length} projet{projects.length > 1 ? 's' : ''}
                            </p>
                            {projects.map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    className={styles.projectCard}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.08 + i * 0.06 }}
                                    style={{ borderColor: region.color + '25' }}
                                >
                                    <div className={styles.projectMeta}>
                                        <span className={styles.projectYear}>{project.year}</span>
                                        <span className={styles.projectCompany}>{project.company}</span>
                                    </div>
                                    <h3 className={styles.projectTitle}>{project.title}</h3>
                                    <p className={styles.projectDesc}>{project.description}</p>
                                    <div className={styles.projectTechs}>
                                        {project.technologies.slice(0, 4).map(t => (
                                            <span key={t} className={styles.projectTech}>{t}</span>
                                        ))}
                                        {project.technologies.length > 4 && (
                                            <span className={styles.projectTech}>+{project.technologies.length - 4}</span>
                                        )}
                                    </div>
                                    {Object.keys(project.links).length > 0 && (
                                        <div className={styles.projectLinks}>
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
                                </motion.div>
                            ))}
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    )
}
