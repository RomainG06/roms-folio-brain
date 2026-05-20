import { motion } from 'framer-motion'
import styles from './IntroScreen.module.css'

const text = "Explore how I think."

interface IntroScreenProps {
    onComplete: () => void
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
    return (
        <motion.div
            className={styles.wrapper}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
            onClick={onComplete}
        >
            <motion.p
                className={styles.tagline}
                initial="hidden"
                animate="visible"
                onAnimationComplete={() => {
                    setTimeout(onComplete, 1200)
                }}
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.045, delayChildren: 0.3 } },
                }}
            >
                {text.split('').map((char, i) => (
                    <motion.span
                        key={i}
                        variants={{
                            hidden: { opacity: 0, y: 12 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                        }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                ))}
            </motion.p>
            <motion.p
                className={styles.hint}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 2.4, duration: 0.6 }}
            >
                click anywhere to enter
            </motion.p>
        </motion.div>
    )
}
