# 🏡 Smart Real Estate Price Predictor

An advanced, full-stack AI platform designed to dynamically estimate and compare real estate property values across 22 major cities in Gujarat. Powered by a highly trained Random Forest Regression model, this application provides users with granular price predictions, base configuration breakdowns, location multipliers, and confidence scoring.

## ✨ Features

- **High-Precision AI Estimates**: Enter the city, neighborhood area, property type, and BHK/SqFt specifics to receive instantaneous dynamic valuations.
- **Visual Property Comparison**: Seamlessly evaluate two distinct properties side-by-side. Uses `recharts` to render comparative graphical insights.
- **The Vault (Saved Estimates)**: Save your generated property valuation blueprints locally directly in your browser.
- **Cinematic UI/UX**: Crafted with React & Tailwind CSS, featuring heavy glassmorphism, fluid dark/light theming, and butter-smooth scrolling physics via Lenis.
- **Production-Ready**: Configured strictly with `vercel.json` for one-click instantaneous deployment directly on Vercel's serverless architecture.

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

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have **Node.js** (for the frontend) and **Python 3.9+** (for the backend) installed.

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
   ```bash
   cd backend
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
   python app.py
   ```
   *(The backend API is now hosting on `http://localhost:8000/api`)*

### 2. Frontend Setup
1. Open a **new separate terminal** and navigate to the `frontend` folder.
   ```bash
   cd frontend
   ```
2. Install NodeJS dependencies.
   ```bash
   npm install
   ```
3. Launch the Vite Development Server.
   ```bash
   npm run dev
   ```
   *(The interface will launch on `http://localhost:5173/` or `5174`!)*

## ☁️ Deployment

The repository is built completely ready for **Vercel**. 

Because the project includes a complex `vercel.json` routing matrix, you can instantly deploy both the frontend interface and the Python/FastAPI backend API directly on Vercel simultaneously.

Simply click **Deploy** on your Vercel dashboard and link this GitHub repository. Vercel will natively map all `/api/*` traffic cleanly over to the backend engine.

---
*Created by [Dhvanish17-design](https://github.com/Dhvanish17-design).*
