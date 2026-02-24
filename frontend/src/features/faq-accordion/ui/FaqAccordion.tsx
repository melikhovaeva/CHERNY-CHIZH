import { useGetFAQItemsQuery } from '@/entities/faq-item';
import { Accordion, Skeleton } from '@/shared/ui/components';
import type { FAQCategory } from '../model/types';
import styles from './FaqAccordion.module.scss';

export interface FaqAccordionProps {
  category: FAQCategory;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function FaqAccordion({
  category,
  title,
  subtitle,
  className,
}: FaqAccordionProps) {
  const { data: faqItems, isLoading } = useGetFAQItemsQuery({
    category,
  });

  const accordionItems = faqItems?.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
  }));

  return (
    <div className={className}>
      {title && <h2>{title}</h2>}
      {subtitle && <p>{subtitle}</p>}
      {!isLoading ? (
        <Accordion items={accordionItems ?? []} />
      ) : (
        <div className={styles.skeletonAccordion}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} variant="rect" height={74} width="100%" />
          ))}
        </div>
      )}
    </div>
  );
}
