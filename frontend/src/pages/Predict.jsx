import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

function Predict() {
  const navigate = useNavigate();
  const trainResult = JSON.parse(localStorage.getItem("trainResult") || "null");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!trainResult) {
    navigate("/upload");
    return null;
  }

  const { job_id, best_model, features, original_features } = trainResult;

  // Use original_features if available (new format), fall back to encoded features
  const useOriginalFeatures =
    original_features && original_features.length > 0;

  // Update form field value
  const handleChange = (feature, value) => {
    setFormData((prev) => ({ ...prev, [feature]: value }));
  };

  // Submit prediction request
  const handlePredict = async () => {
    // Validate that all fields are filled
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

    // Build processed data with correct types
    const processedData = {};
    if (useOriginalFeatures) {
      original_features.forEach((feat) => {
        const val = formData[feat.name];
        if (val === undefined || val === "") return;
        processedData[feat.name] =
          feat.type === "numerical" ? Number(val) : val;
      });
    } else {
      // Fallback for old trainResult without original_features
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.nav}>
        <span style={styles.navLogo}>🚀 DataPilot AI</span>
        <div style={styles.navRight}>
          <button style={styles.navBtn} onClick={() => navigate("/upload")}>
            New Dataset
          </button>
          <button style={styles.navBtn} onClick={() => navigate("/results")}>
            Results
          </button>
          <span style={styles.navEmail}>{user.email}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.heading}>Make a Prediction</h2>
        <p style={styles.subheading}>
          Using <strong>{best_model}</strong> — enter values for each feature
          below
        </p>

        {error && <div style={styles.error}>{error}</div>}

        {/* Dynamic input form — one field per feature */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Input Features</h3>
          <div style={styles.grid}>
            {useOriginalFeatures
              ? original_features.map((feat) => (
                  <div key={feat.name} style={styles.field}>
                    <label style={styles.label}>
                      {feat.name}
                      <span style={styles.typeBadge}>
                        {feat.type === "categorical" ? "📋" : "🔢"}
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
            style={{ ...styles.predictBtn, opacity: loading ? 0.7 : 1 }}
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? "Predicting..." : "🎯 Predict"}
          </button>
        </div>

        {/* Prediction result */}
        {result && (
          <div style={styles.resultCard}>
            <div style={styles.resultIcon}>🎯</div>
            <div style={styles.resultLabel}>Prediction Result</div>
            <div style={styles.resultValue}>{result.prediction}</div>
            {result.confidence && (
              <div style={styles.confidence}>
                Confidence: <strong>{result.confidence}%</strong>
              </div>
            )}
            <div style={styles.modelUsed}>Model: {result.model_used}</div>
            <button
              style={styles.resetBtn}
              onClick={() => {
                setResult(null);
                setFormData({});
              }}
            >
              Predict Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f0f4f8" },
  nav: {
    background: "#1a202c",
    padding: "0 32px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navLogo: { color: "#fff", fontWeight: "700", fontSize: "18px" },
  navRight: { display: "flex", alignItems: "center", gap: "12px" },
  navBtn: {
    background: "transparent",
    border: "1px solid #4a5568",
    color: "#a0aec0",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  navEmail: { color: "#a0aec0", fontSize: "13px" },
  logoutBtn: {
    background: "transparent",
    border: "1px solid #4a5568",
    color: "#a0aec0",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  content: { maxWidth: "760px", margin: "40px auto", padding: "0 20px" },
  heading: { fontSize: "26px", fontWeight: "700", marginBottom: "6px" },
  subheading: { color: "#718096", marginBottom: "24px" },
  error: {
    background: "#fff5f5",
    color: "#c53030",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "13px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#2d3748",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "20px",
  },
  field: { display: "flex", flexDirection: "column" },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  typeBadge: {
    fontSize: "11px",
  },
  input: {
    padding: "10px 12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },
  select: {
    padding: "10px 12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
    cursor: "pointer",
  },
  predictBtn: {
    width: "100%",
    padding: "14px",
    background: "#3182ce",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  resultCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    textAlign: "center",
  },
  resultIcon: { fontSize: "48px", marginBottom: "12px" },
  resultLabel: {
    fontSize: "13px",
    color: "#718096",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  resultValue: {
    fontSize: "52px",
    fontWeight: "800",
    color: "#3182ce",
    marginBottom: "8px",
  },
  confidence: { fontSize: "16px", color: "#4a5568", marginBottom: "6px" },
  modelUsed: { fontSize: "13px", color: "#a0aec0", marginBottom: "20px" },
  resetBtn: {
    padding: "10px 24px",
    background: "#edf2f7",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#4a5568",
  },
};

export default Predict;
