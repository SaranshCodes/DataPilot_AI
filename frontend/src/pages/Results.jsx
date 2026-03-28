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

function Results() {
  const navigate = useNavigate();
  const trainResult = JSON.parse(localStorage.getItem("trainResult") || "null");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // If no results found redirect back to upload
  if (!trainResult) {
    navigate("/upload");
    return null;
  }

  const { results, best_model, task, job_id } = trainResult;

  // Pick the right metric to display based on task type
  const isClassification = task === "classification";
  const metricKey = isClassification ? "accuracy" : "r2";
  const metricLabel = isClassification ? "Accuracy %" : "R² Score";

  // Colors for chart bars — best model gets green, rest get blue
  const getColor = (entry) =>
    entry.model === best_model ? "#38a169" : "#4299e1";

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
          <button style={styles.navBtn} onClick={() => navigate("/predict")}>
            Make Prediction
          </button>
          <span style={styles.navEmail}>{user.email}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Header */}
        <h2 style={styles.heading}>Training Complete 🎉</h2>
        <p style={styles.subheading}>
          Task: <strong>{task}</strong> | Best Model:{" "}
          <strong style={{ color: "#38a169" }}>{best_model}</strong> | Job ID:{" "}
          <code>{job_id}</code>
        </p>

        {/* Best model highlight card */}
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

        {/* Bar chart */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Model Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={results}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" />
              <XAxis dataKey="model" tick={{ fontSize: 12 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
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

        {/* Results table */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Detailed Metrics</h3>
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
                  style={{ background: i % 2 === 0 ? "#fff" : "#f7fafc" }}
                >
                  <td style={styles.td}>{i === 0 ? "🏆" : i + 1}</td>
                  <td
                    style={{
                      ...styles.td,
                      fontWeight: i === 0 ? "700" : "400",
                      color: i === 0 ? "#38a169" : "inherit",
                    }}
                  >
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

        {/* Action button */}
        <button style={styles.predictBtn} onClick={() => navigate("/predict")}>
          🎯 Make Predictions with {best_model}
        </button>
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
  content: { maxWidth: "860px", margin: "40px auto", padding: "0 20px" },
  heading: { fontSize: "26px", fontWeight: "700", marginBottom: "6px" },
  subheading: { color: "#718096", marginBottom: "24px", fontSize: "14px" },
  bestCard: {
    background: "linear-gradient(135deg, #38a169, #276749)",
    borderRadius: "12px",
    padding: "24px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  bestLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: "13px",
    marginBottom: "4px",
  },
  bestName: { color: "#fff", fontSize: "22px", fontWeight: "700" },
  bestScore: {
    color: "#fff",
    fontSize: "36px",
    fontWeight: "800",
    textAlign: "right",
  },
  bestScoreLabel: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.8)",
    fontWeight: "400",
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
    marginBottom: "16px",
    color: "#2d3748",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "10px 16px",
    background: "#f7fafc",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "600",
    color: "#4a5568",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  td: {
    padding: "12px 16px",
    fontSize: "14px",
    borderBottom: "1px solid #edf2f7",
  },
  predictBtn: {
    width: "100%",
    padding: "16px",
    background: "#3182ce",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },
};

export default Results;
