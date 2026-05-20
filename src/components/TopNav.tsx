import styles from './TopNav.module.css'

export default function TopNav() {
  return (
    <nav className={styles.nav} aria-label="Navigation principale">
      <span className={styles.name}>Romain Girard</span>
      <span className={styles.role}>Développeur Fullstack</span>
    </nav>
  )
}
