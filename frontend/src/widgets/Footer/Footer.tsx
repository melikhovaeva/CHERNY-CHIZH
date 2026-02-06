import { CONTACT_DATA, ContactEnum, DOCUMENT_DATA } from '@/entities/contacts'
import styles from './Footer.module.scss'

const contacts = CONTACT_DATA.filter((contact) => contact.type === ContactEnum.CONTACT)
const socials = CONTACT_DATA.filter((contact) => contact.type === ContactEnum.SOCIALS)
const documents = DOCUMENT_DATA

const LOGO_IMAGE = '/logo.svg'

const WARNING_TEXT = '*Instagram, Whatsapp — продукты компании Meta Platforms Inc. признанной экстремистской организацией в РФ'

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
              {socials.map((social) => (
                <li key={social.id} className={styles.social}>
                  <a href={social.href}>
                    <img src={`/socials/${social.name}.svg`} alt={social.name} />
                  </a>
                </li>
              ))}
            </ul>
            <p className={styles.warning}>{WARNING_TEXT}</p>
          </div>
        </div>
        <img className={styles.logo} src={LOGO_IMAGE} alt="Logo" />
      </div>
    </footer >
  )
}
