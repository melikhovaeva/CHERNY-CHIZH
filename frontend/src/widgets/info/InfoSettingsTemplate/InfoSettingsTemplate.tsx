import styles from './InfoCreateEditTemplate.module.scss';

interface InfoCreateEditTemplateProps {
  children: React.ReactNode;
}

export const InfoSettingsTemplate = ({
  children,
}: InfoCreateEditTemplateProps) => {
  return <div className={styles.root}>{children}</div>;
};
