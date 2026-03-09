import { CONTACT_DATA, ContactEnum, DOCUMENT_DATA } from '@/entities/contacts';
import { LogoBigIcon, SocialIcons } from '@/shared/ui/assets';
import styles from './Footer.module.scss';

const contacts = CONTACT_DATA.filter(
  (contact) => contact.type === ContactEnum.CONTACT,
);
const socials = CONTACT_DATA.filter(
  (contact) => contact.type === ContactEnum.SOCIALS,
);
const documents = DOCUMENT_DATA;

const WARNING_TEXT =
  '*Instagram, Whatsapp — продукты компании Meta Platforms Inc. признанной экстремистской организацией в РФ';

export function Footer() {
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
                return (
                  <li key={social.id} className={styles.social}>
                    <a
                      className={styles.socialLink}
                      href={social.href}
                      aria-label={social.name}
                    >
                      {SocialIcon ? <SocialIcon aria-hidden /> : null}
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className={styles.warning}>{WARNING_TEXT}</p>
          </div>
        </div>
        <LogoBigIcon className={styles.logo} aria-label="Logo" />
      </div>
    </footer>
  );
}
