import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import DashboardLayout from "../components/DashboardLayout";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function Predict() {
  const navigate = useNavigate();
  const trainResult = JSON.parse(localStorage.getItem("trainResult") || "null");
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!trainResult) {
    return (
      <DashboardLayout>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🎯</div>
          <p style={styles.emptyTitle}>No model trained yet</p>
          <p style={styles.emptyDesc}>Train a model first to make predictions</p>
          <button style={styles.actionBtn} onClick={() => navigate('/upload')}>
            Go to Upload
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const { job_id, best_model, features, original_features } = trainResult;

  const useOriginalFeatures =
    original_features && original_features.length > 0;

  const handleChange = (feature, value) => {
    setFormData((prev) => ({ ...prev, [feature]: value }));
  };

  const handlePredict = async () => {
    const requiredFields = useOriginalFeatures
      ? original_features.map((f) => f.name)
      : features;
    const missing = requiredFields.filter(
      (f) => !formData[f] && formData[f] !== 0
    );
    if (missing.length > 0) {
      setError(`Please fill in all fields: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const processedData = {};
    if (useOriginalFeatures) {
      original_features.forEach((feat) => {
        const val = formData[feat.name];
        if (val === undefined || val === "") return;
        processedData[feat.name] =
          feat.type === "numerical" ? Number(val) : val;
      });
    } else {
      Object.keys(formData).forEach((key) => {
        const val = formData[key];
        processedData[key] = isNaN(val) ? val : Number(val);
      });
    }

    try {
      const res = await client.post("/predict", {
        job_id,
        input_data: processedData,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Make a Prediction</h2>
          <p style={styles.subheading}>
            Using <strong style={{ color: '#10B981' }}>{best_model}</strong> — enter values for each feature below
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div style={styles.error}>
            <HiOutlineExclamationCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
            <div>
              <div style={styles.errorTitle}>Error</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* Input form */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Input Features</h3>
          <div style={styles.grid}>
            {useOriginalFeatures
              ? original_features.map((feat) => (
                  <div key={feat.name} style={styles.field}>
                    <label style={styles.label}>
                      {feat.name}
                      <span style={{
                        ...styles.typeBadge,
                        background: feat.type === 'categorical' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)',
                        color: feat.type === 'categorical' ? '#3B82F6' : '#10B981',
                      }}>
                        {feat.type === "categorical" ? "CAT" : "NUM"}
                      </span>
                    </label>
                    {feat.type === "categorical" ? (
                      <select
                        style={styles.select}
                        value={formData[feat.name] || ""}
                        onChange={(e) =>
                          handleChange(feat.name, e.target.value)
                        }
                      >
                        <option value="">-- Select {feat.name} --</option>
                        {feat.categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        style={styles.input}
                        type="text"
                        placeholder={`Enter ${feat.name}`}
                        value={formData[feat.name] || ""}
                        onChange={(e) =>
                          handleChange(feat.name, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))
              : features.map((feature) => (
                  <div key={feature} style={styles.field}>
                    <label style={styles.label}>{feature}</label>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder={`Enter ${feature}`}
                      value={formData[feature] || ""}
                      onChange={(e) => handleChange(feature, e.target.value)}
                    />
                  </div>
                ))}
          </div>

          <button
            style={{
              ...styles.predictBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.loadingRow}>
                <div style={styles.spinnerSmall} />
                Predicting...
              </span>
            ) : (
              "🎯 Predict"
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div style={styles.resultCard}>
            <div style={styles.resultGlow} />
            <div style={styles.resultIcon}>🎯</div>
            <div style={styles.resultLabel}>Prediction Result</div>
            <div style={styles.resultValue}>{result.prediction}</div>

            {result.confidence && (
              <div style={styles.confidenceWrap}>
                <div style={styles.confidenceLabel}>
                  Confidence: <strong>{result.confidence}%</strong>
                </div>
                <div style={styles.confidenceBarBg}>
                  <div style={{
                    ...styles.confidenceBar,
                    width: `${result.confidence}%`,
                  }} />
                </div>
              </div>
            )}

            <div style={styles.modelUsed}>Model: {result.model_used}</div>

            <button
              style={styles.resetBtn}
              onClick={() => { setResult(null); setFormData({}); }}
            >
              Predict Again
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

const styles = {
  wrapper: { maxWidth: '800px', margin: '0 auto' },
  header: { marginBottom: '24px' },
  heading: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#E5E7EB',
    marginBottom: '6px',
    letterSpacing: '-0.02em',
  },
  subheading: { color: '#6B7280', fontSize: '15px' },

  /* Error */
  error: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    background: '#1C1017',
    borderLeft: '3px solid #EF4444',
    color: '#FCA5A5',
    padding: '14px 18px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '13px',
    lineHeight: '1.5',
  },
  errorTitle: {
    fontWeight: '600',
    color: '#F87171',
    marginBottom: '2px',
    fontSize: '14px',
  },

  /* Card */
  card: {
    background: '#111827',
    borderRadius: '12px',
    padding: '28px',
    border: '1px solid #1F2937',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#E5E7EB',
  },

  /* Grid */
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px',
    marginBottom: '24px',
  },
  field: { display: 'flex', flexDirection: 'column' },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  typeBadge: {
    fontSize: '9px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '4px',
    letterSpacing: '0.06em',
  },
  input: {
    padding: '11px 14px',
    background: '#1E293B',
    border: '1.5px solid #1F2937',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#E5E7EB',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  select: {
    padding: '11px 14px',
    background: '#1E293B',
    border: '1.5px solid #1F2937',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#E5E7EB',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  predictBtn: {
    width: '100%',
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
  loadingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  spinnerSmall: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  /* Result card */
  resultCard: {
    position: 'relative',
    background: '#111827',
    borderRadius: '16px',
    padding: '40px 32px',
    border: '1px solid #10B981',
    textAlign: 'center',
    overflow: 'hidden',
    boxShadow: '0 0 40px rgba(16,185,129,0.1)',
  },
  resultGlow: {
    position: 'absolute',
    top: '-60px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '300px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  resultIcon: {
    fontSize: '48px',
    marginBottom: '12px',
    position: 'relative',
  },
  resultLabel: {
    fontSize: '12px',
    color: '#6B7280',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: '600',
    position: 'relative',
  },
  resultValue: {
    fontSize: '56px',
    fontWeight: '800',
    color: '#10B981',
    marginBottom: '16px',
    position: 'relative',
  },

  /* Confidence */
  confidenceWrap: {
    maxWidth: '300px',
    margin: '0 auto 16px',
    position: 'relative',
  },
  confidenceLabel: {
    fontSize: '14px',
    color: '#9CA3AF',
    marginBottom: '8px',
  },
  confidenceBarBg: {
    width: '100%',
    height: '6px',
    background: '#1F2937',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  confidenceBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #10B981, #34D399)',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  },

  modelUsed: {
    fontSize: '13px',
    color: '#6B7280',
    marginBottom: '24px',
    position: 'relative',
  },
  resetBtn: {
    padding: '10px 28px',
    background: '#1E293B',
    border: '1px solid #1F2937',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    color: '#9CA3AF',
    fontSize: '14px',
    transition: 'all 0.2s',
    position: 'relative',
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

export default Predict;
