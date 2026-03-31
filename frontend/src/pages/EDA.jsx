import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

function EDA() {
    const navigate = useNavigate();
    const uploadData = JSON.parse(localStorage.getItem('uploadData') || 'null');

    if (!uploadData) {
      return (
        <DashboardLayout>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📊</div>
            <p style={styles.emptyTitle}>No dataset uploaded yet</p>
            <p style={styles.emptyDesc}>Upload a dataset first to explore it here</p>
            <button style={styles.actionBtn} onClick={() => navigate('/upload')}>
              Go to Upload
            </button>
          </div>
        </DashboardLayout>
      );
    }

    const { eda, rows, columns } = uploadData;
    const { overview, missing, stats, categoricals, charts } = eda;

    return (
      <DashboardLayout>
        <div style={styles.wrapper}>
          <div style={styles.header}>
            <h2 style={styles.heading}>Exploratory Data Analysis</h2>
            <p style={styles.subheading}>
              {rows} rows  ·  {columns.length} columns
            </p>
          </div>

          {/* Overview stat cards */}
          <div style={styles.statGrid}>
            {[
              { label: 'Total Rows',     value: overview.rows,           icon: '📋' },
              { label: 'Total Columns',  value: overview.columns,        icon: '📊' },
              { label: 'Missing Values', value: overview.total_missing,   icon: '⚠️' },
              { label: 'Duplicate Rows', value: overview.duplicate_rows,  icon: '🔁' },
            ].map(s => (
              <div key={s.label} style={styles.statCard}>
                <div style={styles.statIcon}>{s.icon}</div>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Missing values table */}
          {missing.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>
                <HiOutlineExclamationCircle size={18} color="#F59E0B" style={{ marginRight: '8px' }} />
                Missing Values
              </h3>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Column</th>
                      <th style={styles.th}>Missing Count</th>
                      <th style={styles.th}>Percentage</th>
                      <th style={styles.th}>Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {missing.map((m, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#111827' : '#0F172A' }}>
                        <td style={styles.td}>{m.column}</td>
                        <td style={styles.td}>{m.missing}</td>
                        <td style={styles.td}>{m.percentage}%</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.badge,
                            background: m.percentage > 50 ? 'rgba(239,68,68,0.1)' : m.percentage > 20 ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                            color:      m.percentage > 50 ? '#EF4444' : m.percentage > 20 ? '#F59E0B' : '#10B981',
                            borderColor: m.percentage > 50 ? 'rgba(239,68,68,0.2)' : m.percentage > 20 ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)',
                          }}>
                            {m.percentage > 50 ? 'High' : m.percentage > 20 ? 'Medium' : 'Low'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Numeric stats table */}
          {stats.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📊 Numeric Column Statistics</h3>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {['Column','Mean','Median','Std Dev','Min','Max'].map(h => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((s, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#111827' : '#0F172A' }}>
                        <td style={{...styles.td, fontWeight: '600', color: '#E5E7EB'}}>{s.column}</td>
                        <td style={styles.td}>{s.mean}</td>
                        <td style={styles.td}>{s.median}</td>
                        <td style={styles.td}>{s.std}</td>
                        <td style={styles.td}>{s.min}</td>
                        <td style={styles.td}>{s.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Charts */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📈 Visualizations</h3>
            <div style={styles.chartGrid}>
              {Object.entries(charts).map(([name, b64]) => (
                <div key={name} style={styles.chartBox}>
                  <div style={styles.chartName}>
                    {name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <img
                    src={`data:image/png;base64,${b64}`}
                    alt={name}
                    style={styles.chartImg}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Categorical value counts */}
          {categoricals.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🔤 Categorical Columns</h3>
              {categoricals.map((cat, i) => (
                <div key={i} style={{ marginBottom: i < categoricals.length - 1 ? '20px' : 0 }}>
                  <div style={styles.catName}>{cat.column}</div>
                  <div style={styles.catBadges}>
                    {cat.values.map((val, j) => (
                      <span key={j} style={styles.catBadge}>
                        {val} <strong style={{ color: '#10B981' }}>({cat.counts[j]})</strong>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div style={styles.actionRow}>
            <button style={styles.secondaryBtn} onClick={() => navigate('/upload')}>
              ← Back to Upload
            </button>
            <button style={styles.trainBtn} onClick={() => navigate('/upload')}>
              ⚡ Go Train Models
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
}

const styles = {
  wrapper: {
    maxWidth: '960px',
    margin: '0 auto',
  },
  header: { marginBottom: '28px' },
  heading: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#E5E7EB',
    marginBottom: '6px',
    letterSpacing: '-0.02em',
  },
  subheading: { color: '#6B7280', fontSize: '15px' },

  /* Stat cards */
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    background: '#111827',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #1F2937',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  statIcon: { fontSize: '24px', marginBottom: '8px' },
  statValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#10B981',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6B7280',
    marginTop: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  /* Cards */
  card: {
    background: '#111827',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #1F2937',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#E5E7EB',
    display: 'flex',
    alignItems: 'center',
  },

  /* Tables */
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 16px',
    background: '#0F172A',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    position: 'sticky',
    top: 0,
    borderBottom: '1px solid #1F2937',
  },
  td: {
    padding: '11px 16px',
    fontSize: '13px',
    color: '#9CA3AF',
    borderBottom: '1px solid #1F2937',
  },
  badge: {
    padding: '3px 10px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontWeight: '600',
    border: '1px solid',
  },

  /* Charts */
  chartGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  chartBox: {
    border: '1px solid #1F2937',
    borderRadius: '8px',
    overflow: 'hidden',
    background: '#0F172A',
  },
  chartName: {
    padding: '10px 14px',
    background: '#0B1220',
    fontSize: '12px',
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  chartImg: {
    width: '100%',
    display: 'block',
  },

  /* Categoricals */
  catName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  catBadges: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  catBadge: {
    padding: '5px 14px',
    background: '#1E293B',
    borderRadius: '9999px',
    fontSize: '12px',
    color: '#9CA3AF',
    border: '1px solid #1F2937',
  },

  /* Actions */
  actionRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  trainBtn: {
    flex: 1,
    padding: '14px',
    background: '#10B981',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 0 20px rgba(16,185,129,0.15)',
  },
  secondaryBtn: {
    padding: '14px 24px',
    background: 'transparent',
    border: '1px solid #1F2937',
    color: '#9CA3AF',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  actionBtn: {
    marginTop: '16px',
    padding: '10px 24px',
    background: '#10B981',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  /* Empty state */
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
    background: '#111827',
    borderRadius: '12px',
    border: '1px solid #1F2937',
    maxWidth: '500px',
    margin: '60px auto',
  },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyTitle: { fontSize: '18px', fontWeight: '600', color: '#E5E7EB', marginBottom: '8px' },
  emptyDesc: { fontSize: '14px', color: '#6B7280', marginBottom: '4px' },
};

export default EDA;