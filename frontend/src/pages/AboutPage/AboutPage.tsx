import { useV1PagesAboutRetrieveQuery } from '@/shared/api/generated/pages.generated'
import { CONTACT_DATA, ContactEnum } from '@/entities/contacts'
import { SocialIcons } from '@/shared/ui/assets'
import { Skeleton } from '@/shared/ui/components'
import styles from './AboutPage.module.scss'

const socials = CONTACT_DATA.filter((c) => c.type === ContactEnum.SOCIALS)

export const AboutPage = () => {
  const { data, isLoading } = useV1PagesAboutRetrieveQuery()

  if (isLoading) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <Skeleton width="300px" height="68px" />
            <Skeleton width="500px" height="28px" />
          </div>
        </section>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{data.title}</h1>
          <p className={styles.heroSubtitle}>{data.subtitle}</p>
        </div>
        <div className={styles.heroDecor}>
          <div className={styles.heroDecoCircle} />
          <div className={styles.heroDecoCircle} />
          <div className={styles.heroDecoCircle} />
        </div>
      </section>

      <section className={styles.mission}>
        <div className={styles.missionInner}>
          <h2 className={styles.sectionTitle}>{data.missionTitle}</h2>
          <p className={styles.missionText}>{data.missionText}</p>
        </div>
      </section>

      {data.values.length > 0 && (
        <section className={styles.values}>
          <h2 className={styles.sectionTitle}>Наши принципы</h2>
          <div className={styles.valuesGrid}>
            {data.values.map((value, index) => (
              <div className={styles.valueCard} key={value.id}>
                <span className={styles.valueIndex}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDescription}>{value.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.milestones.length > 0 && (
        <section className={styles.timeline}>
          <h2 className={styles.sectionTitle}>Наш путь</h2>
          <div className={styles.timelineTrack}>
            <div className={styles.timelineLine} />
            {data.milestones.map((m) => (
              <div className={styles.timelineItem} key={m.id}>
                <span className={styles.timelineYear}>{m.year}</span>
                <div className={styles.timelineDot} />
                <span className={styles.timelineText}>{m.text}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>{data.ctaTitle}</h2>
          <p className={styles.ctaText}>{data.ctaText}</p>
          <div className={styles.ctaSocials}>
            {socials.map((social) => {
              const Icon = SocialIcons[social.name]
              return (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaSocialLink}
                  aria-label={social.name}
                >
                  {Icon ? <Icon aria-hidden /> : null}
                </a>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
