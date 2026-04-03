# 🚀 DataPilot AI — AutoML Platform

> Upload any CSV dataset and automatically train, compare and deploy machine learning models - no coding required.

<img width="1434" height="857" alt="image" src="https://github.com/user-attachments/assets/0f213286-4f5c-4f1a-9f3e-e4556ec30257" />


---

## 📌 What is DataPilot AI?

DataPilot AI is an end-to-end AutoML platform that implements a complete data science pipeline - from raw CSV ingestion to trained model deployment - built entirely from scratch.
**No Python knowledge required. No setup. Just upload and train.**

---
## 🧠 ML Pipeline

### Data Preprocessing (preprocessor.py)
- Auto-detects and drops high-cardinality columns
- Handles missing values — median for numeric, mode for categorical
- Converts numeric-looking string columns (e.g. TotalCharges)
- One-hot encodes categorical features
- StandardScaler normalization
- 80/20 stratified train/test split

### Model Training (trainer.py)
Trains 5 algorithms simultaneously on any tabular dataset:
Logistic Regression, Random Forest, XGBoost, SVM, KNN

### Evaluation (evaluator.py)
- Classification: Accuracy, F1 (weighted), ROC-AUC
- Regression: MAE, RMSE, R²
- Auto-ranks models best → worst

### EDA (eda.py)
- Missing value analysis with severity scoring
- Numeric distributions, correlation heatmap
- Target column class balance chart
- All charts returned as base64 for API delivery

### Prediction (predictor.py)
- Loads saved .pkl bundle (model + scaler + features)
- Applies same preprocessing to new input
- Returns prediction + confidence probability

----

## ✨ Features

- **Drag & Drop CSV Upload** — supports any tabular dataset
- **Automated EDA** — missing values, distributions, correlation heatmap, target analysis
- **AutoML Pipeline** — automatically trains 5 models and picks the best one
- **Model Comparison** — side-by-side metrics with interactive bar charts
- **Live Predictions** — input new data and get instant predictions with confidence scores
- **JWT Authentication** — secure user accounts with token-based auth
- **Task Auto-Detection** — automatically detects classification vs regression

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Recharts, React Router |
| Backend | Flask, Flask-SQLAlchemy, Flask-CORS, Flask-Bcrypt |
| ML Engine | scikit-learn, XGBoost, pandas, numpy |
| Visualization | matplotlib, seaborn |
| Database | SQLite (dev) |
| Auth | JWT (PyJWT) |
| Deployment | Render.com |

---

## 🏗️ Project Structure

```
datapilot-ai/
├── ml_engine/
│   ├── preprocessor.py      # data cleaning, encoding, scaling
│   ├── task_detector.py     # classification vs regression detection
│   ├── trainer.py           # trains 5 ML models
│   ├── evaluator.py         # computes all metrics
│   ├── pipeline.py          # master orchestrator
│   ├── eda.py               # statistics + 4 chart types
│   └── predictor.py         # loads .pkl and runs inference
├── backend/
│   ├── routes/
│   │   ├── auth.py          # POST /auth/register, /auth/login
│   │   ├── upload.py        # POST /upload
│   │   ├── train.py         # POST /train
│   │   └── predict.py       # POST /predict
│   ├── models/
│   │   ├── user.py          # User table
│   │   └── job.py           # TrainingJob table
│   └── utils/
│       └── auth_helper.py   # JWT token + @token_required decorator
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Upload.jsx
│       │   ├── EDA.jsx
│       │   ├── Results.jsx
│       │   └── Predict.jsx
│       └── api/
│           └── client.js    # axios instance with JWT interceptor
├── storage/
│   ├── uploads/             # uploaded CSV files
│   └── models/              # saved .pkl model files
├── requirements.txt
├── Procfile
└── run.py
```

---

## 🚀 Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/SaranshCodes/datapilot-ai.git
cd datapilot-ai

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo SECRET_KEY=your-secret-key > .env

# Start Flask server
python run.py
```

Flask runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

React runs on `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Create account | No |
| POST | `/auth/login` | Login, get JWT | No |
| POST | `/upload` | Upload CSV, run EDA | No |
| POST | `/train` | Run AutoML pipeline | Yes |
| POST | `/predict` | Run inference | Yes |

---

## 📈 How It Works

```
1. User uploads CSV
        ↓
2. EDA runs automatically
   (missing values, distributions, correlation heatmap)
        ↓
3. User selects target column
        ↓
4. AutoML pipeline runs
   preprocess → train 5 models → evaluate → save best
        ↓
5. Results displayed
   (model comparison chart + metrics table)
        ↓
6. User makes live predictions
   (input new data → get prediction + confidence %)
```

---
**Live Link** - [https://datapilot-ai-o1r1.onrender.com](https://datapilot-ai-o1r1.onrender.com)

---

## 🗺️ Roadmap

### v1.1 (Coming Soon)
- [ ] Download EDA report as PDF
- [ ] Download trained model as .pkl
- [ ] and many more..
---

## 👨‍💻 Built By

**Saransh Umrao** 

