import styles from './HomePage.module.scss'
import {
  AdvantagesSection,
  BreedAboutSection,
  FAQSection,
  HeroSection,
  PuppiesSection,
} from './sections'

export function HomePage() {
  return (
    <main className={styles.main}>
      <HeroSection />
      <PuppiesSection />
      <AdvantagesSection />
      <BreedAboutSection />
      <FAQSection />
    </main>
  )
}
