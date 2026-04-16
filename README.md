# 🏠 Smart Real Estate Price Predictor

An advanced, full-stack AI platform designed to dynamically estimate and compare real estate property values across 22 major cities in Gujarat. This application features a high-performance **Flask** backend integrated with a modern, glassmorphism-inspired **React** frontend.

## 🚀 Key Features

- **🎯 High-Precision AI Estimates**: Instant property valuations powered by a Random Forest Regression model with an average error margin below 5%.
- **📊 Interactive Comparative Analysis**: Compare two distinct properties side-by-side with dynamic **Chart.js** visualizations and price-per-sqft breakdowns.
- **✨ Premium UI/UX**: Cinematic interface featuring heavy glassmorphism, fluid dark/light theming, and smooth scroll physics.
- **🛡️ Secure & Lightweight**: Zero client-side framework overhead at runtime; all frontend assets are pre-bundled for maximum performance.
- **☁️ Production-Ready Architecture**: Specifically optimized for seamless deployment on platforms like **Render**.

## 🏗️ Technical Architecture

This project is built as a **Standalone Flask Application**. Unlike traditional decoupled apps, this repo serves the pre-bundled production frontend directly via Flask's static and template engines.

### Tech Stack
- **Backend**: Python, Flask, Flask-CORS
- **Engine**: Scikit-Learn (Random Forest), Pandas, NumPy, Joblib
- **Frontend**: React (Bundled), Tailwind CSS v4, Lucide Icons, Chart.js

## 📂 Project Structure

```text
.
├── app.py                # Main Flask Server & API Entry Point
├── model.pkl             # Serialized ML Model
├── locations.json        # Dynamic City/Area Metadata
├── historical_sales.json # Historical Reference Data
├── templates/            # Integrated Frontend (HTML Shell)
│   └── index.html
├── static/               # Production Assets (JS, CSS, Media)
│   └── assets/
├── requirements.txt      # Python Dependencies
└── Procfile              # Deployment Instructions
```

## 🛠️ Getting Started Locally

### 1. Installation
Install the required environment dependencies:
```bash
pip install -r requirements.txt
```

### 2. Launch
Start the integrated server:
```bash
python app.py
```

### 3. Access
Open your browser and navigate to:
**[http://localhost:10000](http://localhost:10000)**

> [!NOTE]
> The application is explicitly configured to host on port **10000**. This ensures environment parity between local development and production (Render).

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | Serves the main application. |
| `/api/locations` | `GET` | Returns all supported cities, areas, and property types. |
| `/api/predict` | `POST` | Calculates property value based on input specifications. |
| `/api/feature-importance` | `GET` | Returns influence factors for the prediction model. |

## ☁️ Deployment on Render

This project is pre-configured for **Render**'s Web Service environment.

1. **New Web Service**: Connect your GitHub repository.
2. **Runtime**: Select **Python**.
3. **Build Command**: `pip install -r requirements.txt`.
4. **Start Command**: `gunicorn app:app` (Referenced in `Procfile`).
5. **Auto-Detect Port**: Render will automatically detect the app on port **10000**.

---
*Created with ❤️ by Dhvanish17-design.*
