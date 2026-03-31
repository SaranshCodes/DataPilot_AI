import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import DashboardLayout from "../components/DashboardLayout";
import { HiOutlineCheckCircle } from "react-icons/hi";

const pipelineSteps = [
  { label: 'Dataset Loaded', icon: '📁' },
  { label: 'Feature Processing', icon: '⚙️' },
  { label: 'Model Training', icon: '🧠' },
  { label: 'Evaluation', icon: '✅' },
];

function Results() {
  const navigate = useNavigate();
  const trainResult = JSON.parse(localStorage.getItem("trainResult") || "null");

  if (!trainResult) {
    return (
      <DashboardLayout>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🧠</div>
          <p style={styles.emptyTitle}>No training results yet</p>
          <p style={styles.emptyDesc}>Train a model first to see the results here</p>
          <button style={styles.actionBtn} onClick={() => navigate('/upload')}>
            Go to Upload
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const { results, best_model, task, job_id } = trainResult;

  const isClassification = task === "classification";
  const metricKey = isClassification ? "accuracy" : "r2";
  const metricLabel = isClassification ? "Accuracy %" : "R² Score";

  const getColor = (entry) =>
    entry.model === best_model ? "#10B981" : "#3B82F6";

  return (
    <DashboardLayout>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Training Complete 🎉</h2>
          <p style={styles.subheading}>
            Task: <strong style={{ color: '#E5E7EB' }}>{task}</strong> · Best Model:{" "}
            <strong style={{ color: "#10B981" }}>{best_model}</strong> · Job ID:{" "}
            <code style={styles.code}>{job_id}</code>
          </p>
        </div>

        {/* Pipeline steps */}
        <div style={styles.stepsBar}>
          {pipelineSteps.map((step, i) => (
            <div key={step.label} style={styles.stepItem}>
              <div style={styles.stepIcon}>
                <HiOutlineCheckCircle size={20} color="#10B981" />
              </div>
              <span style={styles.stepLabel}>{step.label}</span>
              {i < pipelineSteps.length - 1 && <div style={styles.stepLine} />}
            </div>
          ))}
        </div>

        {/* Best model highlight */}
        <div style={styles.bestCard}>
          <div>
            <div style={styles.bestLabel}>🏆 Best Model</div>
            <div style={styles.bestName}>{best_model}</div>
          </div>
          <div style={styles.bestScore}>
            {results[0][metricKey]}
            {isClassification ? "%" : ""}
            <div style={styles.bestScoreLabel}>{metricLabel}</div>
          </div>
        </div>

        {/* Model cards grid */}
        <div style={styles.modelGrid}>
          {results.map((r, i) => {
            const isBest = r.model === best_model;
            return (
              <div key={i} style={{
                ...styles.modelCard,
                ...(isBest ? styles.modelCardBest : {}),
              }}>
                {isBest && <div style={styles.bestBadge}>Best Model</div>}
                <div style={styles.modelName}>{r.model}</div>
                <div style={styles.modelMetric}>
                  <span style={styles.modelMetricVal}>
                    {r[metricKey]}{isClassification ? '%' : ''}
                  </span>
                  <span style={styles.modelMetricLabel}>{metricLabel}</span>
                </div>
                {isClassification && (
                  <div style={styles.modelSecondary}>
                    <span>F1: {r.f1_score}</span>
                    <span>AUC: {r.roc_auc}</span>
                  </div>
                )}
                {!isClassification && (
                  <div style={styles.modelSecondary}>
                    <span>MAE: {r.mae}</span>
                    <span>RMSE: {r.rmse}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bar chart */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Model Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={results}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="model" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={{ stroke: '#1F2937' }} />
              <YAxis domain={isClassification ? [60, 100] : ['auto', 'auto']} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={{ stroke: '#1F2937' }} />
              <Tooltip
                contentStyle={{ background: '#1E293B', border: '1px solid #1F2937', borderRadius: '8px', color: '#E5E7EB' }}
                formatter={(val) => [
                  `${val}${isClassification ? "%" : ""}`,
                  metricLabel,
                ]}
              />
              <Bar dataKey={metricKey} radius={[6, 6, 0, 0]}>
                {results.map((entry, i) => (
                  <Cell key={i} fill={getColor(entry)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed table */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Detailed Metrics</h3>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Rank</th>
                  <th style={styles.th}>Model</th>
                  {isClassification ? (
                    <>
                      <th style={styles.th}>Accuracy</th>
                      <th style={styles.th}>F1 Score</th>
                      <th style={styles.th}>ROC-AUC</th>
                    </>
                  ) : (
                    <>
                      <th style={styles.th}>R²</th>
                      <th style={styles.th}>MAE</th>
                      <th style={styles.th}>RMSE</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr
                    key={i}
                    style={{ background: i % 2 === 0 ? "#111827" : "#0F172A" }}
                  >
                    <td style={styles.td}>{i === 0 ? "🏆" : i + 1}</td>
                    <td style={{
                      ...styles.td,
                      fontWeight: i === 0 ? "700" : "400",
                      color: i === 0 ? "#10B981" : "#9CA3AF",
                    }}>
                      {r.model}
                    </td>
                    {isClassification ? (
                      <>
                        <td style={styles.td}>{r.accuracy}%</td>
                        <td style={styles.td}>{r.f1_score}</td>
                        <td style={styles.td}>{r.roc_auc}</td>
                      </>
                    ) : (
                      <>
                        <td style={styles.td}>{r.r2}</td>
                        <td style={styles.td}>{r.mae}</td>
                        <td style={styles.td}>{r.rmse}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action */}
        <button style={styles.predictBtn} onClick={() => navigate("/predict")}>
          🎯 Make Predictions with {best_model}
        </button>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  wrapper: { maxWidth: '960px', margin: '0 auto' },
  header: { marginBottom: '24px' },
  heading: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#E5E7EB',
    marginBottom: '6px',
    letterSpacing: '-0.02em',
  },
  subheading: { color: '#6B7280', fontSize: '14px' },
  code: {
    background: '#1E293B',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },

  /* Pipeline steps */
  stepsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0',
    marginBottom: '28px',
    padding: '20px 24px',
    background: '#111827',
    borderRadius: '12px',
    border: '1px solid #1F2937',
    flexWrap: 'wrap',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  stepIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: '13px',
    color: '#10B981',
    fontWeight: '500',
  },
  stepLine: {
    width: '40px',
    height: '1px',
    background: '#10B981',
    margin: '0 12px',
    opacity: 0.4,
  },

  /* Best card */
  bestCard: {
    background: 'linear-gradient(135deg, #065F46, #064E3B)',
    border: '1px solid rgba(16,185,129,0.3)',
    borderRadius: '12px',
    padding: '28px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    boxShadow: '0 0 40px rgba(16,185,129,0.1)',
  },
  bestLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '13px',
    marginBottom: '4px',
  },
  bestName: { color: '#fff', fontSize: '22px', fontWeight: '700' },
  bestScore: {
    color: '#fff',
    fontSize: '36px',
    fontWeight: '800',
    textAlign: 'right',
  },
  bestScoreLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '400',
  },

  /* Model cards */
  modelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  modelCard: {
    background: '#111827',
    border: '1px solid #1F2937',
    borderRadius: '12px',
    padding: '20px',
    position: 'relative',
    transition: 'all 0.2s',
  },
  modelCardBest: {
    borderColor: '#10B981',
    boxShadow: '0 0 20px rgba(16,185,129,0.1)',
  },
  bestBadge: {
    position: 'absolute',
    top: '-10px',
    right: '16px',
    background: '#10B981',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    padding: '3px 10px',
    borderRadius: '9999px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  modelName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: '12px',
  },
  modelMetric: {
    marginBottom: '8px',
  },
  modelMetricVal: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#10B981',
  },
  modelMetricLabel: {
    fontSize: '11px',
    color: '#6B7280',
    marginLeft: '6px',
  },
  modelSecondary: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: '#6B7280',
  },

  /* Card */
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
  },

  /* Table */
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 16px',
    background: '#0F172A',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    borderBottom: '1px solid #1F2937',
  },
  td: {
    padding: '12px 16px',
    fontSize: '13px',
    color: '#9CA3AF',
    borderBottom: '1px solid #1F2937',
  },

  /* Predict button */
  predictBtn: {
    width: '100%',
    padding: '16px',
    background: '#10B981',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 0 20px rgba(16,185,129,0.15)',
    marginTop: '4px',
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
};

export default Results;
