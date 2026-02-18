import type { Breed, BreedDescription } from '@/entities/breed/model/types';
import { Tabs, type Tab } from '@/features/tabs-filter';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/components';
import { useMemo, useState } from 'react';
import styles from './BreedAboutSection.module.scss';
import { BreedAboutBlockKey, CARD_LABELS } from './model/enums';
import { AppearanceCard, FeatureCard } from './ui';

interface BreedAboutSectionProps {
  isLoading: boolean;
  breeds: Breed[];
}

export function BreedAboutSection({
  breeds,
  isLoading,
}: BreedAboutSectionProps) {
  if (isLoading) return null;
  // TABS
  // TODO: Добавить типизацию для slug вкладок
  const DEFAULT_TAB = breeds[0]?.slug ?? '';

  const tabs: Tab[] = useMemo(
    () =>
      breeds?.map((breed) => ({
        id: breed.id,
        label: breed.name,
        value: breed.slug,
      })) ?? [],
    [breeds],
  );
  const [activeTab, setActiveTab] = useState<string>(DEFAULT_TAB);

  // DESCRIPTIONS
  const descriptions = useMemo<Record<string, BreedDescription>>(
    () =>
      Object.fromEntries(
        breeds.map((breed) => [breed.slug, breed.description]),
      ) as Record<string, BreedDescription>,
    [breeds],
  );
  const isDescriptionsEmpty = useMemo(
    () => Object.keys(descriptions).length === 0,
    [descriptions],
  );
  const isDescriptionsValid = useMemo(
    () =>
      !isDescriptionsEmpty &&
      Object.values(descriptions).every((description) => !!description),
    [descriptions],
  );
  const activeDescription = descriptions[activeTab];
  const activeFeatures = useMemo(() => {
    return Object.entries(activeDescription).filter(
      ([key]) => key !== BreedAboutBlockKey.APPEARANCE,
    );
  }, [activeDescription]);

  // PHOTOS
  const photos = useMemo<Record<string, string | null>>(
    () =>
      Object.fromEntries(
        (breeds ?? []).map((breed) => [breed.slug, breed.photo]),
      ),
    [breeds],
  );
  const activePhotoUrl = photos[activeTab];
  const activePhotoAlt = tabs.find((t) => t.value === activeTab)?.label ?? '';

  if (!tabs.length || !isDescriptionsValid) return null;
  return (
    <section className={cn([styles.root, 'filled secondary'])}>
      <div className={styles.container}>
        <h2 className={styles.title}>О породе</h2>
        <div className={styles.contentContainer}>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className={styles.tabs}
          />
          <div className={styles.content}>
            {activePhotoUrl ? (
              <img
                src={activePhotoUrl}
                alt={activePhotoAlt}
                className={styles.image}
              />
            ) : (
              <div className={styles.image}></div>
            )}
            <AppearanceCard
              title={CARD_LABELS[BreedAboutBlockKey.APPEARANCE]}
              text={activeDescription.appearance}
            />
            {activeFeatures.map(([key, value]) => (
              <FeatureCard
                key={key}
                title={CARD_LABELS[key as BreedAboutBlockKey]}
                text={value.text}
                rating={value.rating}
              />
            ))}
          </div>
        </div>
        <Button>Подробнее</Button>
      </div>
    </section>
  );
}
