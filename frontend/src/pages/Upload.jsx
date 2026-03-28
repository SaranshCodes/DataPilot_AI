import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

function Upload() {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [targetCol, setTargetCol] = useState("");
  const [uploadData, setUploadData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Handle file selected (via click or drag)
  const handleFile = async (selectedFile) => {
    if (!selectedFile?.name.endsWith(".csv")) {
      setError("Please uplaod a CSV file");
      return;
    }
    setFile(selectedFile);
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await client.post("/upload", formData);
      setColumns(res.data.columns);
      setUploadData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };
  //Starting training with selected taret column
  const handleTrain = async () => {
    if (!targetCol) {
      setError("Please select a target column");
      return;
    }
    setTraining(true);
    setError("");

    try {
      const res = await client.post("/train", {
        file_id: uploadData.file_id,
        filename: uploadData.filename,
        target_col: targetCol,
      });
      // Save results to localStorage so Results Page can read them
      localStorage.setItem("trainResult", JSON.stringify(res.data));
      navigate("/results");
    } catch (err) {
      setError(err.response?.data?.error || "Training failed");
      setTraining(false);
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
          <span style={styles.navEmail}>{user.email}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.content}>
        <h2 style={styles.heading}>Upload Your Dataset</h2>
        <p style={styles.subheading}>
          Upload a CSV and we'll automatically train ML models for you
        </p>

        {error && <div style={styles.error}>{error}</div>}

        {/* Drop zone */}
        <div
          style={{
            ...styles.dropzone,
            ...(dragOver ? styles.dropzoneActive : {}),
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInput.current.click()}
        >
          <input
            ref={fileInput}
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div style={styles.dropIcon}>📂</div>
          {loading ? (
            <p>Uploading and running EDA...</p>
          ) : file ? (
            <p>
              <strong>{file.name}</strong> — click to change
            </p>
          ) : (
            <p>
              Drag & drop a CSV file here, or <strong>click to browse</strong>
            </p>
          )}
        </div>

        {/* Column selector */}
        {columns.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>
              Dataset loaded — {uploadData.rows} rows, {columns.length} columns
            </h3>
            <label style={styles.label}>Select target column to predict:</label>
            <select
              style={styles.select}
              value={targetCol}
              onChange={(e) => setTargetCol(e.target.value)}
            >
              <option value="">-- Choose column --</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <div style={styles.colGrid}>
              {columns.map((col) => (
                <span
                  key={col}
                  style={{
                    ...styles.colBadge,
                    ...(col === targetCol ? styles.colBadgeActive : {}),
                  }}
                  onClick={() => setTargetCol(col)}
                >
                  {col}
                </span>
              ))}
            </div>
            <button
              style={{ ...styles.trainBtn, opacity: training ? 0.7 : 1 }}
              onClick={handleTrain}
              disabled={training}
            >
              {training
                ? "⏳ Training models... this may take 30-60 seconds"
                : "🚀 Start AutoML Training"}
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
  navRight: { display: "flex", alignItems: "center", gap: "16px" },
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
  content: { maxWidth: "720px", margin: "40px auto", padding: "0 20px" },
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
  dropzone: {
    border: "2px dashed #cbd5e0",
    borderRadius: "12px",
    padding: "48px 20px",
    textAlign: "center",
    cursor: "pointer",
    background: "#fff",
    marginBottom: "24px",
    transition: "all 0.2s",
  },
  dropzoneActive: { borderColor: "#3182ce", background: "#ebf8ff" },
  dropIcon: { fontSize: "36px", marginBottom: "12px" },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#2d3748",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: "8px",
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
    outline: "none",
  },
  colGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "20px",
  },
  colBadge: {
    padding: "4px 12px",
    background: "#edf2f7",
    borderRadius: "20px",
    fontSize: "12px",
    cursor: "pointer",
    border: "1.5px solid transparent",
  },
  colBadgeActive: {
    background: "#ebf8ff",
    borderColor: "#3182ce",
    color: "#3182ce",
    fontWeight: "600",
  },
  trainBtn: {
    width: "100%",
    padding: "14px",
    background: "#38a169",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Upload;