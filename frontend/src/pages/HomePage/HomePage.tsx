import { AdvantagesSection, HeroSection, PuppiesSection } from './sections'
import styles from './HomePage.module.scss'

export function HomePage() {
  return (
    <main className={styles.main}>
      <HeroSection />
      <PuppiesSection />
      <AdvantagesSection />
    </main>
  )
}
