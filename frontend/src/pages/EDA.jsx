import { useNavigate } from 'react-router-dom';

function EDA() {
    const navigate = useNavigate();
    const uploadData = JSON.parse(localStorage.getItem('uploadData') || 'null');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!uploadData) { navigate('/uplaod'); return null; }

    const { eda, rows, columns } = uploadData;
    const { overview, missing, stats, categoricals, charts } = eda;
    const handleLogout = () => { localStorage.clear(); navigate('/'); };

    return (
     <div style={styles.page}>

      {/* Navbar */}
      <div style={styles.nav}>
        <span style={styles.navLogo}>🚀 DataPilot AI</span>
        <div style={styles.navRight}>
          <button style={styles.navBtn} onClick={() => navigate('/upload')}>Upload</button>
          <button style={styles.navBtn} onClick={() => navigate('/results')}>Results</button>
          <span style={styles.navEmail}>{user.email}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.heading}>Exploratory Data Analysis</h2>
        <p style={styles.subheading}>
          {rows} rows  |  {columns.length} columns
        </p>

        {/* Overview stat cards */}
        <div style={styles.statGrid}>
          {[
            { label: 'Total Rows',     value: overview.rows },
            { label: 'Total Columns',  value: overview.columns },
            { label: 'Missing Values', value: overview.total_missing },
            { label: 'Duplicate Rows', value: overview.duplicate_rows },
          ].map(s => (
            <div key={s.label} style={styles.statCard}>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Missing values table */}
        {missing.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>❗ Missing Values</h3>
            <table style={styles.table}>
              <thead><tr>
                <th style={styles.th}>Column</th>
                <th style={styles.th}>Missing Count</th>
                <th style={styles.th}>Percentage</th>
                <th style={styles.th}>Severity</th>
              </tr></thead>
              <tbody>
                {missing.map((m, i) => (
                  <tr key={i} style={{ background: i%2===0 ? '#fff' : '#f7fafc' }}>
                    <td style={styles.td}>{m.column}</td>
                    <td style={styles.td}>{m.missing}</td>
                    <td style={styles.td}>{m.percentage}%</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: m.percentage > 50 ? '#fff5f5' : m.percentage > 20 ? '#fffaf0' : '#f0fff4',
                        color:      m.percentage > 50 ? '#c53030' : m.percentage > 20 ? '#c05621' : '#276749',
                      }}>
                        {m.percentage > 50 ? 'High' : m.percentage > 20 ? 'Medium' : 'Low'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Numeric stats table */}
        {stats.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📊 Numeric Column Statistics</h3>
            <table style={styles.table}>
              <thead><tr>
                {['Column','Mean','Median','Std Dev','Min','Max'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {stats.map((s, i) => (
                  <tr key={i} style={{ background: i%2===0 ? '#fff' : '#f7fafc' }}>
                    <td style={{...styles.td, fontWeight:'600'}}>{s.column}</td>
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
        )}

        {/* Charts from eda.py — rendered as images */}
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
              <div key={i} style={{ marginBottom: '16px' }}>
                <div style={styles.catName}>{cat.column}</div>
                <div style={styles.catBadges}>
                  {cat.values.map((val, j) => (
                    <span key={j} style={styles.catBadge}>
                      {val} <strong>({cat.counts[j]})</strong>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action button */}
        <button style={styles.trainBtn} onClick={() => navigate('/upload')}>
          🚀 Go Train Models
        </button>

      </div>
    </div>
  );
}

const styles = {
  page      : { minHeight: '100vh', background: '#f0f4f8' },
  nav       : { background: '#1a202c', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navLogo   : { color: '#fff', fontWeight: '700', fontSize: '18px' },
  navRight  : { display: 'flex', alignItems: 'center', gap: '12px' },
  navBtn    : { background: 'transparent', border: '1px solid #4a5568', color: '#a0aec0', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  navEmail  : { color: '#a0aec0', fontSize: '13px' },
  logoutBtn : { background: 'transparent', border: '1px solid #4a5568', color: '#a0aec0', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  content   : { maxWidth: '900px', margin: '40px auto', padding: '0 20px' },
  heading   : { fontSize: '26px', fontWeight: '700', marginBottom: '6px' },
  subheading: { color: '#718096', marginBottom: '24px' },
  statGrid  : { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' },
  statCard  : { background: '#fff', borderRadius: '10px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  statValue : { fontSize: '28px', fontWeight: '800', color: '#3182ce' },
  statLabel : { fontSize: '12px', color: '#718096', marginTop: '4px' },
  card      : { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '20px' },
  cardTitle : { fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#2d3748' },
  table     : { width: '100%', borderCollapse: 'collapse' },
  th        : { padding: '10px 16px', background: '#f7fafc', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td        : { padding: '10px 16px', fontSize: '14px', borderBottom: '1px solid #edf2f7' },
  badge     : { padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  chartGrid : { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  chartBox  : { border: '1px solid #edf2f7', borderRadius: '8px', overflow: 'hidden' },
  chartName : { padding: '10px 14px', background: '#f7fafc', fontSize: '13px', fontWeight: '600', color: '#4a5568' },
  chartImg  : { width: '100%', display: 'block' },
  catName   : { fontSize: '13px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' },
  catBadges : { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  catBadge  : { padding: '4px 12px', background: '#edf2f7', borderRadius: '20px', fontSize: '12px', color: '#4a5568' },
  trainBtn  : { width: '100%', padding: '16px', background: '#3182ce', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
};

export default EDA;