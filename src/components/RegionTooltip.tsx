import { motion, AnimatePresence } from 'framer-motion'
import type { BrainRegion } from '../types'
import styles from './RegionTooltip.module.css'

interface RegionTooltipProps {
    region: BrainRegion | null
    mouseX: number
    mouseY: number
}

export default function RegionTooltip({ region, mouseX, mouseY }: RegionTooltipProps) {
    return (
        <AnimatePresence>
            {region && (
                <motion.div
                    className={styles.tooltip}
                    style={{ left: mouseX + 16, top: mouseY - 12 }}
                    initial={{ opacity: 0, scale: 0.9, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 4 }}
                    transition={{ duration: 0.15 }}
                >
                    <span className={styles.title}>{region.title}</span>
                    <span className={styles.count}>
                        {region.projectIds.length} projet{region.projectIds.length > 1 ? 's' : ''}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
