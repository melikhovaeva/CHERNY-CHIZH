import { CONTACT_DATA, ContactEnum, DOCUMENT_DATA } from '@/entities/contacts';
import { LogoBigIcon, SocialIcons } from '@/shared/ui/assets';
import { useState } from 'react';
import styles from './Footer.module.scss';

const contacts = CONTACT_DATA.filter(
  (contact) => contact.type === ContactEnum.CONTACT,
);
const socials = CONTACT_DATA.filter(
  (contact) => contact.type === ContactEnum.SOCIALS,
);
const documents = DOCUMENT_DATA;

const META_WARNING_TEXT =
  '*Instagram, Whatsapp — продукты компании Meta Platforms Inc. признанной экстремистской организацией в РФ';

const TELEGRAM_WARNING_TEXT =
  '*Мессенджер Telegram официально запрещён на территории РФ.';

export function Footer() {
  const [expandedSocialId, setExpandedSocialId] = useState<number | null>(null);

  const handleSocialClick = (socialId: number) => {
    setExpandedSocialId((current) => (current === socialId ? null : socialId));
  };

  return (
    <footer className={styles.root}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.contacts}>
            <span className={styles.title}>Связаться с нами</span>
            <ul className={styles.contactsList}>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <a href={contact.href}>{contact.value}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.documents}>
            <span className={styles.title}>Документы</span>
            <ul className={styles.documentsList}>
              {documents.map((document) => (
                <li key={document.id} className={styles.document}>
                  <a
                    href={document.value}
                    className={styles.documentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {document.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.socials}>
            <span className={styles.title}>Социальные сети</span>
            <ul className={styles.socialsList}>
              {socials.map((social) => {
                const SocialIcon = SocialIcons[social.name];
                const isVk = social.name === 'vk';
                const isExpanded = expandedSocialId === social.id;
                return (
                  <li key={social.id} className={styles.social}>
                    <button
                      type="button"
                      className={styles.socialTextBlock}
                      onClick={() => handleSocialClick(social.id)}
                      aria-label={social.name}
                      aria-expanded={isExpanded}
                    >
                      {SocialIcon ? <SocialIcon aria-hidden /> : null}
                      <span
                        className={`${styles.socialExpandable} ${isExpanded ? styles.socialExpandableExpanded : ''}`}
                      >
                        {isVk ? (
                          <a
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLinkText}
                            onClick={(e) => e.stopPropagation()}
                          >
                            ссылка
                          </a>
                        ) : (
                          <span className={styles.socialValue}>
                            {social.value}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className={styles.warnings}>
              <p className={styles.warning}>{META_WARNING_TEXT}</p>
              <p className={styles.warning}>{TELEGRAM_WARNING_TEXT}</p>
            </div>
          </div>
        </div>
        <LogoBigIcon className={styles.logo} aria-label="Logo" />
      </div>
    </footer>
  );
}
