import { useNavigate } from 'react-router-dom';
import {
  HiOutlineChartBar,
  HiOutlineLightningBolt,
  HiOutlineCursorClick,
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
  HiOutlineChevronDown,
} from 'react-icons/hi';

const features = [
  {
    icon: HiOutlineChartBar,
    title: 'Auto EDA',
    desc: 'Upload a CSV and get instant statistics, visualizations, missing value analysis, and correlation heatmaps — no code needed.',
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'AutoML Training',
    desc: 'One-click training across 5 ML algorithms. DataPilot auto-selects the best model based on accuracy, F1, and R² metrics.',
  },
  {
    icon: HiOutlineCursorClick,
    title: 'Instant Predictions',
    desc: 'Use your trained model to predict on new data immediately. Fill in feature values and get results in milliseconds.',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Secure & Private',
    desc: 'JWT-authenticated platform. Your data stays on your server — nothing is sent to third-party cloud services.',
  },
];

const steps = [
  { num: '01', title: 'Upload', desc: 'Drop your CSV dataset' },
  { num: '02', title: 'Explore', desc: 'Auto-generated EDA insights' },
  { num: '03', title: 'Train', desc: 'One-click ML model training' },
  { num: '04', title: 'Predict', desc: 'Instant predictions on new data' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* ── Navbar ── */}
      <nav style={styles.navbar}>
        <div style={styles.navInner}>
          <div style={styles.navBrand}>
            <div style={styles.navLogo}>⚡</div>
            <span style={styles.navTitle}>DataPilot AI</span>
          </div>
          <div style={styles.navActions}>
            <button
              style={styles.navLoginBtn}
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              style={styles.navGetStartedBtn}
              onClick={() => navigate('/login')}
            >
              Get Started
              <HiOutlineArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={styles.hero}>
        <div style={styles.heroGlow} />
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <span style={styles.heroBadgeDot} />
            Open-source ML Platform
          </div>
          <h1 style={styles.heroTitle}>
            Train ML Models in <br />
            <span style={styles.heroGradient}>Clicks, Not Code.</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Upload any CSV, get automated EDA, train 5 ML models with one click,
            and make instant predictions — all in a beautiful dark dashboard.
          </p>
          <div style={styles.heroCtas}>
            <button
              style={styles.ctaPrimary}
              onClick={() => navigate('/login')}
            >
              Get Started Free
              <HiOutlineArrowRight size={18} />
            </button>
            <a href="#features" style={styles.ctaSecondary}>
              Learn More
              <HiOutlineChevronDown size={16} />
            </a>
          </div>

          {/* Stats row */}
          <div style={styles.statsRow}>
            {[
              { val: '5', label: 'ML Models' },
              { val: '< 60s', label: 'Training Time' },
              { val: '100%', label: 'Automated' },
            ].map(s => (
              <div key={s.label} style={styles.statItem}>
                <div style={styles.statVal}>{s.val}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSub}>Four simple steps from data to predictions</p>
          <div style={styles.stepsGrid}>
            {steps.map((step, i) => (
              <div key={step.num} style={styles.stepCard}>
                <div style={styles.stepNum}>{step.num}</div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
                {i < steps.length - 1 && <div style={styles.stepArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ ...styles.section, background: '#0F172A' }}>
        <div style={styles.sectionInner}>
          <h2 style={styles.sectionTitle}>Powerful Features</h2>
          <p style={styles.sectionSub}>Everything you need for end-to-end machine learning</p>
          <div style={styles.featureGrid}>
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} style={styles.featureCard}>
                  <div style={styles.featureIconBox}>
                    <Icon size={24} color="#10B981" />
                  </div>
                  <h3 style={styles.featureTitle}>{f.title}</h3>
                  <p style={styles.featureDesc}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={styles.ctaBanner}>
        <div style={styles.ctaBannerInner}>
          <h2 style={styles.ctaBannerTitle}>Ready to build ML models?</h2>
          <p style={styles.ctaBannerSub}>
            Start training models in under a minute. No setup, no boilerplate.
          </p>
          <button
            style={styles.ctaPrimary}
            onClick={() => navigate('/login')}
          >
            Start Now — It's Free
            <HiOutlineArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerBrand}>
            <span style={{ fontSize: '16px' }}>⚡</span>
            <span style={styles.footerTitle}>DataPilot AI</span>
          </div>
          <p style={styles.footerCopy}>
            Built with ❤ · ML engineering made simple
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ── Styles ── */
const styles = {
  page: {
    minHeight: '100vh',
    background: '#0B1220',
    color: '#E5E7EB',
  },

  /* Navbar */
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: 'rgba(11,18,32,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #1F2937',
  },
  navInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 32px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  navLogo: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #10B981, #059669)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  navTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#E5E7EB',
    letterSpacing: '-0.02em',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  navLoginBtn: {
    background: 'transparent',
    border: 'none',
    color: '#9CA3AF',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '8px 16px',
    transition: 'color 0.2s',
  },
  navGetStartedBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#10B981',
    color: '#fff',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },

  /* Hero */
  hero: {
    position: 'relative',
    paddingTop: '140px',
    paddingBottom: '80px',
    textAlign: 'center',
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: '-100px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 24px',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(16,185,129,0.1)',
    border: '1px solid rgba(16,185,129,0.2)',
    borderRadius: '9999px',
    padding: '6px 16px',
    fontSize: '13px',
    color: '#34D399',
    fontWeight: '500',
    marginBottom: '28px',
  },
  heroBadgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#10B981',
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: '800',
    lineHeight: '1.1',
    color: '#E5E7EB',
    letterSpacing: '-0.03em',
    marginBottom: '20px',
  },
  heroGradient: {
    background: 'linear-gradient(135deg, #10B981, #34D399, #6EE7B7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#9CA3AF',
    lineHeight: '1.7',
    maxWidth: '600px',
    margin: '0 auto 36px',
  },
  heroCtas: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  ctaPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: '#10B981',
    color: '#fff',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 0 24px rgba(16,185,129,0.25)',
  },
  ctaSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'transparent',
    borderStyle: 'none',
    color: '#9CA3AF',
    padding: '14px 28px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '48px',
    marginTop: '56px',
    flexWrap: 'wrap',
  },
  statItem: { textAlign: 'center' },
  statVal: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#10B981',
  },
  statLabel: {
    fontSize: '13px',
    color: '#6B7280',
    marginTop: '4px',
  },

  /* Section common */
  section: {
    padding: '80px 0',
  },
  sectionInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 24px',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '800',
    textAlign: 'center',
    color: '#E5E7EB',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  sectionSub: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: '16px',
    marginBottom: '48px',
  },

  /* Steps */
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  },
  stepCard: {
    position: 'relative',
    background: '#111827',
    border: '1px solid #1F2937',
    borderRadius: '12px',
    padding: '28px 20px',
    textAlign: 'center',
  },
  stepNum: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#10B981',
    marginBottom: '12px',
    opacity: 0.6,
  },
  stepTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#E5E7EB',
    marginBottom: '6px',
  },
  stepDesc: {
    fontSize: '13px',
    color: '#9CA3AF',
    lineHeight: '1.5',
  },
  stepArrow: {
    position: 'absolute',
    right: '-16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#374151',
    fontSize: '18px',
    fontWeight: '700',
    zIndex: 2,
  },

  /* Features */
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
  },
  featureCard: {
    background: '#111827',
    border: '1px solid #1F2937',
    borderRadius: '12px',
    padding: '28px',
    transition: 'all 0.3s ease',
  },
  featureIconBox: {
    width: '48px',
    height: '48px',
    background: 'rgba(16,185,129,0.1)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  featureTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#E5E7EB',
    marginBottom: '8px',
  },
  featureDesc: {
    fontSize: '14px',
    color: '#9CA3AF',
    lineHeight: '1.7',
  },

  /* CTA Banner */
  ctaBanner: {
    padding: '80px 0',
    background: '#0B1220',
  },
  ctaBannerInner: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '56px 40px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))',
    border: '1px solid rgba(16,185,129,0.15)',
    borderRadius: '20px',
  },
  ctaBannerTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#E5E7EB',
    marginBottom: '12px',
    letterSpacing: '-0.02em',
  },
  ctaBannerSub: {
    fontSize: '16px',
    color: '#9CA3AF',
    marginBottom: '28px',
  },

  /* Footer */
  footer: {
    borderTop: '1px solid #1F2937',
    padding: '32px 0',
  },
  footerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  footerTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#9CA3AF',
  },
  footerCopy: {
    fontSize: '13px',
    color: '#6B7280',
  },
};
