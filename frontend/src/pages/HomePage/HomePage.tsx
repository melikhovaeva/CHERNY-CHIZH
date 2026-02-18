import { useGetBreedsQuery } from '@/entities/breed';
import {
  AdvantagesSection,
  BreedAboutSection,
  FAQSection,
  FormSection,
  HeroSection,
  LibrarySection,
  PuppiesSection,
} from '@/widgets';
import styles from './HomePage.module.scss';

export function HomePage() {
  const { data: breeds } = useGetBreedsQuery();

  return (
    <div className={styles.container}>
      <HeroSection />
      <PuppiesSection />
      <AdvantagesSection />
      <BreedAboutSection breeds={breeds ?? []} />
      <FAQSection />
      <LibrarySection />
      <FormSection />
    </div>
  );
}
