import {
  AdvantagesSection,
  BreedAboutSection,
  FAQSection,
  FormSection,
  HeroSection,
  LibrarySection,
  PuppiesSection,
} from '@/widgets'
import styles from './HomePage.module.scss'

export function HomePage() {
  return (
    <div className={styles.container}>
      <HeroSection />
      <PuppiesSection />
      <AdvantagesSection />
      <BreedAboutSection />
      <FAQSection />
      <LibrarySection />
      <FormSection />
    </div>
  )
}
