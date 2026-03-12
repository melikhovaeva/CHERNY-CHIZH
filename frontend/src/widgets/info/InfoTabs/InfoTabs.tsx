import { Tabs, type Tab } from '@/features/tabs-filter';

interface InfoTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const InfoTabs = ({ tabs, activeTab, onTabChange }: InfoTabsProps) => {
  return <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />;
};
