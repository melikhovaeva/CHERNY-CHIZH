import { useGetFAQItemsQuery } from '@/entities/faq-item';
import { Accordion } from '@/shared/ui/components';
import type { FAQCategory } from '../model/types';

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
  const {
    data: faqItems,
    isLoading,
    isError,
  } = useGetFAQItemsQuery({
    category,
  });

  const hasItems = faqItems && faqItems.length > 0;

  if (isLoading || isError || !hasItems) return null;

  const accordionItems = faqItems.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
  }));

  return (
    <div className={className}>
      {title && <h2>{title}</h2>}
      {subtitle && <p>{subtitle}</p>}
      <Accordion items={accordionItems} />
    </div>
  );
}
