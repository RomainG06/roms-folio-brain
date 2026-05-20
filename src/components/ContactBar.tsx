import styles from './ContactBar.module.css'

function GithubIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12C24 5.37 18.63 0 12 0z" />
        </svg>
    )
}

function LinkedinIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z" />
        </svg>
    )
}

function MailIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    )
}

function DownloadIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 15V3m0 12-4-4m4 4 4-4" />
            <path d="M2 17v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" />
        </svg>
    )
}

export default function ContactBar() {
    return (
        <footer className={styles.bar}>
            <a
                href="mailto:romain.girard.06700@gmail.com"
                className={styles.link}
                aria-label="Envoyer un email à Romain Girard"
            >
                <MailIcon />
                <span>Contact</span>
            </a>

            <div className={styles.divider} />

            <a
                href="https://github.com/RomainG06"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
                aria-label="Profil GitHub de Romain Girard"
            >
                <GithubIcon />
            </a>

            <a
                href="https://linkedin.com/in/romain-girard-1b06a427b"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
                aria-label="Profil LinkedIn de Romain Girard"
            >
                <LinkedinIcon />
            </a>

            <div className={styles.divider} />

            <a
                href="/cv-romain-girard.pdf"
                download
                className={styles.cvBtn}
                aria-label="Télécharger le CV de Romain Girard"
            >
                <DownloadIcon />
                <span>CV</span>
            </a>
        </footer>
    )
}
