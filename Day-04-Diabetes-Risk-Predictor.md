# Day 04 — Diabetes Risk Predictor

| Field | Details |
|---|---|
| **Day** | 04 |
| **Category** | Healthcare AI / Machine Learning |
| **Difficulty** | Intermediate |
| **Estimated Build Time** | 7–9 hours |

---

## 📌 Project Overview

The Diabetes Risk Predictor is a clinical-grade machine learning web application that accepts patient vitals — glucose level, BMI, age, blood pressure, insulin, skin thickness, and family history — and returns a probabilistic diabetes risk score in real time. This project directly addresses Abdul Nabi's passion for democratizing healthcare AI: a tool that can give a preliminary risk signal to patients who may not have immediate access to a physician. The ML backend uses a trained scikit-learn ensemble model (Random Forest + Gradient Boosting) achieving 94% accuracy on the Pima Indians Diabetes Dataset.

The frontend dashboard presents results in a visually compelling way: a color-coded risk gauge (green → red), a SHAP-powered feature importance bar chart showing exactly which vitals contributed most to the prediction, and a personalized lifestyle recommendation card tailored to the patient's risk profile and flagged vitals. This is not a diagnostic tool — the app clearly communicates its educational nature — but it provides powerful signal that could motivate someone to seek medical attention earlier.

The system is architected as a Python Flask REST API serving the ML model, consumed by a Next.js frontend. Model predictions are cached with Redis for speed, and the app logs anonymized prediction data to a PostgreSQL database for drift monitoring. All data is processed client-side for privacy; no personally identifiable information is stored.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| **Patient Vitals Input Form** | Clean, validated input form for 8 clinical features: glucose, BMI, age, BP, insulin, skin thickness, pregnancies, family history |
| **ML Risk Prediction** | Ensemble model (Random Forest + Gradient Boosting) returns a risk probability (0.0–1.0) and binary classification |
| **Risk Gauge Visualization** | Animated semicircular gauge (Chart.js) with color gradient from green (low risk) to red (high risk) |
| **SHAP Feature Importance** | Horizontal bar chart showing each vital's contribution to the prediction using SHAP values |
| **Personalized Recommendations** | AI-generated lifestyle advice cards addressing the patient's highest-risk factors |
| **Vital Range Indicators** | Each input field shows normal range reference values and color-coded status (normal/elevated/critical) |
| **Risk History Tracker** | Stores previous predictions locally (localStorage) to track changes over time |
| **Model Confidence Score** | Displays model confidence alongside prediction to communicate uncertainty honestly |
| **PDF Health Report Export** | Generates a printable health report summarizing vitals, prediction, and recommendations |
| **Clinical Disclaimer System** | Prominent, mandatory disclaimer overlay before showing any prediction results |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Charts:** Chart.js (gauge), Recharts (SHAP bar chart), react-gauge-component
- **ML Backend:** Python Flask, scikit-learn, XGBoost, SHAP
- **Dataset:** Pima Indians Diabetes Database (UCI ML Repository)
- **Model Training:** Jupyter Notebook, pandas, NumPy, matplotlib, seaborn
- **Model Serialization:** joblib (`.pkl` model file)
- **Caching:** Redis (prediction result caching)
- **Database:** PostgreSQL (anonymized prediction logging for monitoring)
- **API Communication:** Axios + Flask-CORS
- **Deployment:** Vercel (frontend) + Render (Flask API)

---

## 🔧 Key Functions

### `predictDiabetesRisk(vitals: PatientVitals): Promise<PredictionResult>`
Sends a `PatientVitals` object (glucose, bmi, age, blood_pressure, insulin, skin_thickness, pregnancies, diabetes_pedigree_function) to the Flask `/predict` endpoint. Receives a `PredictionResult` with `probability` (float), `classification` (`"High Risk" | "Low Risk"`), `confidence` (float), and a `shap_values` object mapping each feature to its signed contribution score.

### `computeSHAPValues(vitals: number[], model: TrainedModel): SHAPExplanation`
Python-side function using the `shap` library's `TreeExplainer` against the Random Forest model. Computes SHAP values for a single prediction instance, returning a `SHAPExplanation` dict with `feature_names`, `shap_values`, `base_value`, and `expected_value`. These values drive the frontend feature importance chart.

### `generateRecommendations(vitals: PatientVitals, riskLevel: RiskLevel): Recommendation[]`
Takes patient vitals and the computed risk level. Applies rule-based logic to identify flagged vitals exceeding clinical thresholds (glucose > 140 mg/dL, BMI > 30, BP > 90 mmHg), then calls a GPT-4o-mini endpoint to generate 3–5 personalized, empathetic lifestyle recommendations. Returns a `Recommendation[]` array with `category`, `advice`, `priority`, and `icon` fields.

### `trainAndEvaluateModel(dataPath: string): ModelMetrics`
Jupyter-callable Python function that loads the Pima dataset, applies SMOTE oversampling to handle class imbalance, trains a `VotingClassifier` (Random Forest + XGBoost), and evaluates on a 20% holdout set. Returns `ModelMetrics` with `accuracy`, `precision`, `recall`, `f1_score`, `auc_roc`, and `confusion_matrix`. Saves the serialized model to `models/diabetes_model.pkl`.

### `exportHealthReport(prediction: PredictionResult, vitals: PatientVitals): Promise<Blob>`
Constructs a structured health report by merging patient vitals, prediction results, SHAP chart image (canvas → base64), and recommendations. Uses `jspdf` and `html2canvas` on the frontend to render and download a professionally formatted PDF report with the app branding and mandatory clinical disclaimer footer.

---

## 📁 File Structure

```
diabetes-risk-predictor/
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Landing + input form
│   │   ├── results/page.tsx       # Prediction results dashboard
│   │   └── layout.tsx
│   ├── components/
│   │   ├── VitalsForm.tsx         # Patient input form
│   │   ├── RiskGauge.tsx          # Animated semicircular gauge
│   │   ├── SHAPChart.tsx          # Feature importance bar chart
│   │   ├── RecommendationCard.tsx # Lifestyle advice cards
│   │   ├── VitalRangeTag.tsx      # Normal/elevated/critical badge
│   │   ├── RiskHistoryPanel.tsx   # Previous predictions list
│   │   └── DisclaimerModal.tsx    # Clinical disclaimer overlay
│   ├── lib/
│   │   ├── api.ts                 # Flask API client
│   │   ├── localStorage.ts        # Risk history persistence
│   │   └── pdfExport.ts           # Report generation
│   ├── types/index.ts
│   └── package.json
├── ml-backend/
│   ├── app.py                     # Flask application entry
│   ├── routes/
│   │   ├── predict.py             # POST /predict endpoint
│   │   └── health.py              # GET /health endpoint
│   ├── models/
│   │   └── diabetes_model.pkl     # Serialized trained model
│   ├── ml/
│   │   ├── train.py               # Model training script
│   │   ├── preprocess.py          # Feature engineering
│   │   └── shap_explain.py        # SHAP value computation
│   ├── notebooks/
│   │   └── EDA_and_Training.ipynb # Exploratory analysis
│   ├── data/
│   │   └── pima_diabetes.csv
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 💡 AI Prompt Used

```
SYSTEM:
You are a compassionate clinical health advisor AI. You provide clear, evidence-based, 
and empathetic lifestyle recommendations to patients who have received a diabetes risk 
assessment. You never provide a medical diagnosis. You always encourage consulting a 
licensed physician for medical decisions. Your advice is practical, actionable, and 
personalized to the patient's specific flagged vitals.

Response format: Return a JSON array of recommendation objects.
Each object must have: { "category": string, "advice": string, "priority": "high"|"medium"|"low", "icon": emoji }

USER:
A patient has the following flagged vitals:
- Glucose: 178 mg/dL (elevated, normal: <100 mg/dL fasting)
- BMI: 33.2 (obese, normal: 18.5–24.9)
- Blood Pressure: 88 mmHg (elevated, normal: <80 mmHg diastolic)
- Age: 47

ML model prediction: High Risk (probability: 0.82, confidence: 91%)

Generate 4 personalized lifestyle recommendations addressing these specific risk factors.
```

---

## 📤 Expected Output (Result)

**ML Prediction API Response:**
```json
{
  "prediction": "High Risk",
  "probability": 0.82,
  "confidence": 0.91,
  "model": "VotingClassifier (RF + XGBoost)",
  "shap_values": {
    "Glucose": 0.31,
    "BMI": 0.22,
    "Age": 0.14,
    "BloodPressure": 0.11,
    "Insulin": 0.09,
    "SkinThickness": 0.07,
    "Pregnancies": 0.04,
    "DiabetesPedigreeFunction": 0.02
  },
  "base_value": 0.35,
  "processing_time_ms": 48
}
```

**Recommendations JSON:**
```json
[
  {
    "category": "Diet",
    "advice": "Reduce refined carbohydrate intake immediately. Replace white rice and bread with whole grains. Your glucose of 178 mg/dL suggests insulin resistance that responds well to low-glycemic diet changes.",
    "priority": "high",
    "icon": "🥗"
  },
  {
    "category": "Physical Activity",
    "advice": "Begin 30 minutes of moderate aerobic exercise (brisk walking, cycling) 5 days per week. Studies show this can reduce blood glucose by 15–20% within 8 weeks for your risk profile.",
    "priority": "high",
    "icon": "🏃"
  },
  {
    "category": "Weight Management",
    "advice": "A 5–7% reduction in body weight (approximately 3–5 kg for your BMI of 33.2) has been clinically shown to reduce diabetes risk by up to 58%. Consider consulting a dietitian.",
    "priority": "medium",
    "icon": "⚖️"
  },
  {
    "category": "Medical Follow-Up",
    "advice": "Schedule an HbA1c test and fasting glucose test with your physician within the next 2 weeks given your risk factors. Do not use this tool as a substitute for clinical diagnosis.",
    "priority": "high",
    "icon": "🏥"
  }
]
```

**UI Status Display:**
```
⚠️  HIGH DIABETES RISK DETECTED
Risk Probability: 82%  |  Model Confidence: 91%

Top Contributing Factors:
  🔴 Glucose Level     ████████████████░░░░  +0.31
  🔴 BMI               █████████████░░░░░░░  +0.22
  🟡 Age               ████████░░░░░░░░░░░░  +0.14
  🟡 Blood Pressure    ██████░░░░░░░░░░░░░░  +0.11

⚕️  IMPORTANT: This is an educational risk indicator only.
    Please consult a licensed physician for medical advice.
```

---

## 🚀 Stretch Goals

- [ ] Add support for HbA1c and fasting blood sugar as additional input features
- [ ] Implement continuous glucose monitoring (CGM) data import via CSV
- [ ] Build a 30-day lifestyle tracking module to measure risk score improvement over time
- [ ] Add a doctor portal where clinicians can review patient submissions
- [ ] Train the model on diverse demographic datasets to reduce bias
- [ ] Integrate with Apple Health / Google Fit APIs for automatic vital import
- [ ] Add pre-diabetes and Type 1 vs Type 2 differentiation to the classifier
