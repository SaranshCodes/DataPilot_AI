import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import DashboardLayout from "../components/DashboardLayout";
import { HiOutlineCloudUpload, HiOutlineExclamationCircle, HiOutlineDocument } from "react-icons/hi";

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

  useEffect(() => {
    if (targetCol && uploadData?.filename) {
      const fetchUpdatedEDA = async () => {
        try {
          const res = await client.post('/update_eda', {
            filename: uploadData.filename,
            target_col: targetCol
          });
          if (res.data?.status === 'success') {
            setUploadData(prev => {
              if (!prev) return prev;
              const newData = { ...prev, eda: res.data.eda };
              localStorage.setItem("uploadData", JSON.stringify(newData));
              return newData;
            });
          }
        } catch (err) {
          console.error("Failed to fetch updated EDA:", err);
        }
      };
      fetchUpdatedEDA();
    }
  }, [targetCol, uploadData?.filename]);

  const handleFile = async (selectedFile) => {
    if (!selectedFile?.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }
    if (selectedFile.size > 16 * 1024 * 1024) {
      setError("File size exceeds 16 MB limit. Please upload a smaller file.");
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
      localStorage.setItem("uploadData", JSON.stringify(res.data));
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

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
      localStorage.setItem("trainResult", JSON.stringify(res.data));
      navigate("/results");
    } catch (err) {
      setError(err.response?.data?.error || "Training failed");
      setTraining(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Upload Your Dataset</h2>
          <p style={styles.subheading}>
            Upload a CSV file and we'll automatically train ML models for you
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

        {/* Drop zone */}
        <div
          style={{
            ...styles.dropzone,
            ...(dragOver ? styles.dropzoneActive : {}),
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileInput.current.click()}
        >
          <input
            ref={fileInput}
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div style={styles.dropIconBox}>
            <HiOutlineCloudUpload size={32} color="#10B981" />
          </div>
          {loading ? (
            <div>
              <div style={styles.spinner} />
              <p style={styles.dropText}>Uploading and running EDA...</p>
            </div>
          ) : file ? (
            <div style={styles.filePreview}>
              <HiOutlineDocument size={20} color="#10B981" />
              <span style={styles.fileName}>{file.name}</span>
              <span style={styles.fileSize}>
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          ) : (
            <>
              <p style={styles.dropText}>
                Drag & drop a CSV file here, or <span style={styles.dropLink}>click to browse</span>
              </p>
              <p style={styles.dropHint}>Maximum file size: 16 MB</p>
            </>
          )}
        </div>

        {/* EDA button */}
        {uploadData && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button style={styles.edaBtn} onClick={() => navigate("/eda")}>
              <HiOutlineDocument size={16} />
              Explore Data (EDA)
            </button>
          </div>
        )}

        {/* Column selector + Train */}
        {columns.length > 0 && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                Dataset Loaded
              </h3>
              <span style={styles.cardBadge}>
                {uploadData.rows} rows · {columns.length} columns
              </span>
            </div>

            <label style={styles.label}>Select target column to predict:</label>
            <select
              style={styles.select}
              value={targetCol}
              onChange={(e) => setTargetCol(e.target.value)}
            >
              <option value="">-- Choose column --</option>
              {columns.map((col) => (
                <option key={col} value={col}>{col}</option>
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
              style={{
                ...styles.trainBtn,
                opacity: training ? 0.7 : 1,
                cursor: training ? 'not-allowed' : 'pointer',
              }}
              onClick={handleTrain}
              disabled={training}
            >
              {training ? (
                <span style={styles.trainLoading}>
                  <div style={styles.spinnerSmall} />
                  Training models... this may take 30–60 seconds
                </span>
              ) : (
                "⚡ Start AutoML Training"
              )}
            </button>
          </div>
        )}

        {/* Empty state */}
        {!file && !loading && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📁</div>
            <p style={styles.emptyTitle}>No dataset uploaded yet</p>
            <p style={styles.emptyDesc}>Upload a CSV file to get started with automated machine learning</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

const styles = {
  wrapper: {
    maxWidth: '780px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '28px',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#E5E7EB',
    marginBottom: '6px',
    letterSpacing: '-0.02em',
  },
  subheading: {
    color: '#6B7280',
    fontSize: '15px',
  },
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

  /* Dropzone */
  dropzone: {
    border: '2px dashed #1F2937',
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    background: '#111827',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
  },
  dropzoneActive: {
    borderColor: '#10B981',
    background: 'rgba(16,185,129,0.05)',
    boxShadow: '0 0 30px rgba(16,185,129,0.1)',
  },
  dropIconBox: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    background: 'rgba(16,185,129,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  dropText: {
    color: '#9CA3AF',
    fontSize: '15px',
    marginBottom: '8px',
  },
  dropLink: {
    color: '#10B981',
    fontWeight: '600',
  },
  dropHint: {
    color: '#6B7280',
    fontSize: '12px',
  },
  filePreview: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(16,185,129,0.1)',
    border: '1px solid rgba(16,185,129,0.2)',
    padding: '10px 20px',
    borderRadius: '8px',
  },
  fileName: {
    color: '#E5E7EB',
    fontWeight: '600',
    fontSize: '14px',
  },
  fileSize: {
    color: '#6B7280',
    fontSize: '12px',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #1F2937',
    borderTop: '3px solid #10B981',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 12px',
  },

  /* EDA button */
  edaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 18px',
    background: 'transparent',
    border: '1px solid #10B981',
    color: '#10B981',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },

  /* Card */
  card: {
    background: '#111827',
    borderRadius: '12px',
    padding: '28px',
    border: '1px solid #1F2937',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#E5E7EB',
  },
  cardBadge: {
    fontSize: '12px',
    color: '#10B981',
    background: 'rgba(16,185,129,0.1)',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontWeight: '500',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: '8px',
  },
  select: {
    width: '100%',
    padding: '11px 14px',
    background: '#1E293B',
    border: '1.5px solid #1F2937',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#E5E7EB',
    marginBottom: '16px',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  colGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '24px',
  },
  colBadge: {
    padding: '5px 14px',
    background: '#1E293B',
    borderRadius: '9999px',
    fontSize: '12px',
    color: '#9CA3AF',
    cursor: 'pointer',
    border: '1.5px solid transparent',
    transition: 'all 0.2s',
  },
  colBadgeActive: {
    background: 'rgba(16,185,129,0.1)',
    borderColor: '#10B981',
    color: '#10B981',
    fontWeight: '600',
  },
  trainBtn: {
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
  trainLoading: {
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

  /* Empty state */
  emptyState: {
    textAlign: 'center',
    padding: '48px 20px',
    background: '#111827',
    borderRadius: '12px',
    border: '1px solid #1F2937',
    marginTop: '20px',
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: '6px',
  },
  emptyDesc: {
    fontSize: '13px',
    color: '#6B7280',
  },
};

export default Upload;