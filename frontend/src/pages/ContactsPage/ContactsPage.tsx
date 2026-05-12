import { useV1PagesContactsRetrieveQuery } from '@/shared/api/generated/pages.generated'
import { SocialIcons } from '@/shared/ui/assets'
import { Skeleton } from '@/shared/ui/components'
import styles from './ContactsPage.module.scss'

const CONTACT_TYPE_LABELS: Record<string, string> = {
  phone: 'Телефон',
  email: 'Электронная почта',
}

const META_WARNING =
  '*Instagram, WhatsApp — продукты компании Meta Platforms Inc., признанной экстремистской организацией в РФ'
const TELEGRAM_WARNING =
  '*Мессенджер Telegram официально запрещён на территории РФ.'

export const ContactsPage = () => {
  const { data, isLoading } = useV1PagesContactsRetrieveQuery()

  if (isLoading) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <Skeleton width="300px" height="68px" />
          <Skeleton width="500px" height="28px" />
        </section>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>{data.title}</h1>
        <p className={styles.heroSubtitle}>{data.subtitle}</p>
      </section>

      <section className={styles.content}>
        <div className={styles.grid}>
          {data.contacts.length > 0 && (
            <div className={styles.contactCard}>
              <h2 className={styles.cardTitle}>Связаться напрямую</h2>
              <div className={styles.contactItems}>
                {data.contacts.map((contact) => (
                  <a
                    key={contact.id}
                    href={contact.href}
                    className={styles.contactItem}
                  >
                    <span className={styles.contactLabel}>
                      {CONTACT_TYPE_LABELS[contact.contactType] ?? contact.label}
                    </span>
                    <span className={styles.contactValue}>{contact.value}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {data.socials.length > 0 && (
            <div className={styles.contactCard}>
              <h2 className={styles.cardTitle}>Социальные сети</h2>
              <div className={styles.socialItems}>
                {data.socials.map((social) => {
                  const Icon = SocialIcons[social.name]
                  return (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialItem}
                    >
                      <span className={styles.socialIcon}>
                        {Icon ? <Icon aria-hidden /> : null}
                      </span>
                      <span className={styles.socialInfo}>
                        <span className={styles.socialName}>{social.label}</span>
                        <span className={styles.socialValue}>{social.value}</span>
                      </span>
                    </a>
                  )
                })}
              </div>
              <div className={styles.warnings}>
                <p className={styles.warning}>{META_WARNING}</p>
                <p className={styles.warning}>{TELEGRAM_WARNING}</p>
              </div>
            </div>
          )}

          <div className={styles.contactCard}>
            <h2 className={styles.cardTitle}>Адрес</h2>
            <div className={styles.addressBlock}>
              <p className={styles.addressText}>{data.address}</p>
              <p className={styles.addressNote}>{data.addressNote}</p>
            </div>
          </div>

          {data.schedule.length > 0 && (
            <div className={styles.contactCard}>
              <h2 className={styles.cardTitle}>Время работы</h2>
              <div className={styles.scheduleItems}>
                {data.schedule.map((item) => (
                  <div className={styles.scheduleRow} key={item.id}>
                    <span className={styles.scheduleDay}>{item.days}</span>
                    <span className={styles.scheduleTime}>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className={styles.banner}>
        <div className={styles.bannerInner}>
          <h2 className={styles.bannerTitle}>{data.bannerTitle}</h2>
          <p className={styles.bannerText}>{data.bannerText}</p>
          <a
            href={`mailto:${data.bannerEmail}`}
            className={styles.bannerButton}
          >
            Написать нам
          </a>
        </div>
      </section>
    </div>
  )
}
