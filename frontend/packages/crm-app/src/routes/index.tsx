import { createFileRoute } from '@tanstack/react-router';
import {
  Route as RouteIcon,
  Server,
  Shield,
  Sparkles,
  Waves,
  Zap,
} from 'lucide-react';
import styles from './index.module.scss';

export const Route = createFileRoute('/')({
  component: App,
  staticData: { navLabel: 'Главная', navOrder: 0 },
});

function App() {
  const features = [
    {
      icon: <Zap className={styles.featureIcon} />,
      title: 'Powerful Server Functions',
      description:
        'Write server-side code that seamlessly integrates with your client components. Type-safe, secure, and simple.',
    },
    {
      icon: <Server className={styles.featureIcon} />,
      title: 'Flexible Server Side Rendering',
      description:
        'Full-document SSR, streaming, and progressive enhancement out of the box. Control exactly what renders where.',
    },
    {
      icon: <RouteIcon className={styles.featureIcon} />,
      title: 'API Routes',
      description:
        'Build type-safe API endpoints alongside your application. No separate backend needed.',
    },
    {
      icon: <Shield className={styles.featureIcon} />,
      title: 'Strongly Typed Everything',
      description:
        'End-to-end type safety from server to client. Catch errors before they reach production.',
    },
    {
      icon: <Waves className={styles.featureIcon} />,
      title: 'Full Streaming Support',
      description:
        'Stream data from server to client progressively. Perfect for AI applications and real-time updates.',
    },
    {
      icon: <Sparkles className={styles.featureIcon} />,
      title: 'Next Generation Ready',
      description:
        'Built from the ground up for modern web applications. Deploy anywhere JavaScript runs.',
    },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroBrand}>
            <img
              src="/tanstack-circle-logo.png"
              alt="TanStack Logo"
              className={styles.heroLogo}
            />
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleMuted}>TANSTACK</span>{' '}
              <span className={styles.heroTitleAccent}>
                START
              </span>
            </h1>
          </div>
          <p className={styles.heroSubtitle}>
            The framework for next generation AI applications
          </p>
          <p className={styles.heroDescription}>
            Full-stack framework powered by TanStack Router for React and Solid.
            Build modern applications with server functions, streaming, and type
            safety.
          </p>
          <div className={styles.heroActions}>
            <a
              href="https://tanstack.com/start"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docsButton}
            >
              Documentation
            </a>
            <p className={styles.heroHint}>
              Begin your TanStack Start journey by editing{' '}
              <code className={styles.heroCode}>
                /src/routes/index.tsx
              </code>
            </p>
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIconWrap}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>
                {feature.title}
              </h3>
              <p className={styles.featureDescription}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
