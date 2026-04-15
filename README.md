# 🏡 Smart Real Estate Price Predictor

An advanced, full-stack AI platform designed to dynamically estimate and compare real estate property values across 22 major cities in Gujarat. Powered by a highly trained Random Forest Regression model, this application provides users with granular price predictions, base configuration breakdowns, location multipliers, and confidence scoring.

## ✨ Features

- **High-Precision AI Estimates**: Enter the city, neighborhood area, property type, and BHK/SqFt specifics to receive instantaneous dynamic valuations.
- **Visual Property Comparison**: Seamlessly evaluate two distinct properties side-by-side. Uses `recharts` to render comparative graphical insights.
- **The Vault (Saved Estimates)**: Save your generated property valuation blueprints locally directly in your browser.
- **Cinematic UI/UX**: Crafted with React & Tailwind CSS, featuring heavy glassmorphism, fluid dark/light theming, and butter-smooth scrolling physics via Lenis.
- **Production-Ready**: Engineered for serverless deployment on Vercel, utilizing an optimized routing configuration and modular file structure.

## 📂 Project Structure

```text
.
├── api/                    # Python Backend (Serverless)
│   ├── index.py            # FastAPI Entry point
│   ├── model.pkl           # AI Model
│   ├── locations.json      # Metadata
│   ├── historical_sales.json # Sales History Data
│   └── requirements.txt    # Backend Dependencies
├── frontend/               # React Frontend
│   ├── src/                # Source code
│   ├── vite.config.js      # Build & Proxy Config
│   └── package.json        # Frontend Dependencies
└── vercel.json             # Global Deployment Config
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations / Scroll**: [Lenis](https://lenis.studiofreight.com/) & Native CSS transitions.
- **Data Viz & Icons**: [Recharts](https://recharts.org/) & [Lucide React](https://lucide.dev/)

### Backend
- **Server Framework**: [FastAPI](https://fastapi.tiangolo.com/) + Uvicorn
- **Machine Learning**: [Scikit-learn](https://scikit-learn.org/) (RandomForestRegressor)
- **Data Handling**: Pandas & Numpy
- **Persistence**: Joblib & built-in JSON artifact caching.

## 💡 How to Use

1. **Select Location**: Choose a target City and Neighborhood area in Gujarat.
2. **Input Specs**: Enter property details including Square Footage, BHK, Bathrooms, and Property Age.
3. **Analyze**: Receive an instant AI-generated valuation, confidence score, and base rate breakdown.
4. **Compare & Save**: Use the comparison view for side-by-side analysis or save blueprints to your local Vault.

## ⚠️ Limitations

- **Geographic Scope**: The current model is optimized specifically for major real estate hubs in Gujarat.
- **Estimate Nature**: Predictions are statistical estimates based on historical trends and should not be treated as official legal appraisals.
- **Latency**: Due to the serverless architecture on Vercel, the first request may experience a minor "cold start" delay.
- **Real-time Data**: This version does not include real-time property market API integration.

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have **Node.js** (for development and production builds) and **Python 3.9+** installed. Note that Vercel operates within a serverless Python environment; ensure version parity with `requirements.txt`.

### 1. Backend Setup
1. Open a terminal and navigate to the `api` directory.
   ```bash
   cd api
   ```
2. Create and activate a Virtual Environment.
   *(Windows)*
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
   *(macOS/Linux)*
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install the API Dependencies.
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI engine.
   ```bash
   uvicorn index:app --reload
   ```
   *(The backend API is now hosting on `http://localhost:8000/`. Locally, the frontend communicates via a Vite proxy; in production, all requests are routed via the relative `/api` prefix defined in `vercel.json`.)*

### 2. Frontend Setup
1. Open a **new terminal** and navigate to the `frontend` folder.
   ```bash
   cd frontend
   ```
2. Install NodeJS dependencies.
   ```bash
   npm install
   ```
3. Launch the Application.
   ```bash
   npm run dev
   ```
   *(The interface will launch on `http://localhost:5173/`!)*

## ⚙️ Configuration & Security

- **Environment Settings**: The frontend supports custom backend endpoints via the `VITE_API_URL` variable in a `.env` file (optional).
- **CORS Policy**: The FastAPI backend is configured with Cross-Origin Resource Sharing (CORS) middleware to securely allow requests from the frontend in both development and production.

## ☁️ Deployment

The repository is built completely ready for **Vercel**. 

Simply link this GitHub repository to your **Vercel Dashboard**. Vercel will automatically execute `npm run build`, capturing the frontend output from the `dist` folder and mapping all `/api/*` traffic to the backend serverless engine.

> [!NOTE]
> Large artifacts like `model.pkl` (serialized Random Forest models) may impact deployment times and initial serverless cold start responsiveness. For production environments, consider model quantization or weight pruning to minimize artifact size.

---
*Created by [Dhvanish17-design](https://github.com/Dhvanish17-design).*
