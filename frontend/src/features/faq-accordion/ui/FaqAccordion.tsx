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
  const { data: faqItems, isLoading, isError } = useGetFAQItemsQuery({
    category,
  });

  const defaultOpenId = faqItems?.[0]?.id;
  const hasItems =
    faqItems && faqItems.length > 0 && defaultOpenId != null;

  if (isLoading || isError || !hasItems) return null;

  const accordionItems = faqItems.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
  }));

  return (
    <div className={className}>
      {title != null && <h2>{title}</h2>}
      {subtitle != null && <p>{subtitle}</p>}
      <Accordion items={accordionItems} defaultOpenId={defaultOpenId} />
    </div>
  );
}
