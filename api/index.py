from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import json
import numpy as np
import os

app = FastAPI(title="Smart Real Estate Price Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model and locations
try:
    __model = joblib.load(os.path.join(BASE_DIR, 'model.pkl'))
    with open(os.path.join(BASE_DIR, 'locations.json'), 'r') as f:
        data = json.load(f)
        __data_columns = data['data_columns']
        __feature_importances = data.get('feature_importances', {})
        __cities = data.get('cities', [])
        __nested_locations = data.get('nested_locations', {})
        __property_types = data.get('property_types', [])
        
    with open(os.path.join(BASE_DIR, 'historical_sales.json'), 'r') as f:
        __historical_sales = json.load(f)
except Exception as e:
    print(f"Error loading model artifacts: {e}")
    __model = None
    __data_columns = None
    __feature_importances = {}
    __cities = []
    __nested_locations = {}
    __property_types = []
    __historical_sales = []

class PredictRequest(BaseModel):
    city: str
    area: str
    property_type: str
    sqft: float
    bhk: int
    bath: int
    age: int

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Real Estate Price Predictor API"}

@app.get("/api/locations")
def get_locations():
    return {
        "cities": __cities,
        "nested_locations": __nested_locations,
        "property_types": __property_types
    }

@app.get("/api/feature-importance")
def get_feature_importance():
    return {"feature_importances": __feature_importances}

@app.post("/api/predict")
def predict_price(request: PredictRequest):
    if not __model or not __data_columns:
         raise HTTPException(status_code=500, detail="Model is not loaded")
         
    try:
        # Build feature vector
        x = np.zeros(len(__data_columns))
        # Feature order from train_model.py: total_sqft, bhk, bath, age, [loc...]
        # Wait, the df columns in train_model.py are: 'total_sqft', 'bhk', 'bath', 'age'
        # Let's check which index they are. We can dynamically find them.
        
        sqft_idx = __data_columns.index('total_sqft') if 'total_sqft' in __data_columns else 0
        bhk_idx = __data_columns.index('bhk') if 'bhk' in __data_columns else 1
        bath_idx = __data_columns.index('bath') if 'bath' in __data_columns else 2
        age_idx = __data_columns.index('age') if 'age' in __data_columns else 3
        months_ago_idx = __data_columns.index('months_ago') if 'months_ago' in __data_columns else -1
        
        x[sqft_idx] = request.sqft
        x[bhk_idx] = request.bhk
        x[bath_idx] = request.bath
        x[age_idx] = request.age
        
        if months_ago_idx != -1:
            x[months_ago_idx] = 0 # Predicting for current market (0 months ago)
        
        city_col = f"city_{request.city}".lower()
        area_col = f"area_{request.area}".lower()
        prop_col = f"property_type_{request.property_type}".lower()
        
        if city_col in __data_columns:
            x[__data_columns.index(city_col)] = 1
        if area_col in __data_columns:
            x[__data_columns.index(area_col)] = 1
        if prop_col in __data_columns:
            x[__data_columns.index(prop_col)] = 1

        # Reshape for prediction
        x_pred = x.reshape(1, -1)
        
        # Predict central value
        predicted_price = float(__model.predict(x_pred)[0])
        
        # Recent Comps lookup
        recent_comps = []
        if __historical_sales:
            comps = [s for s in __historical_sales if s['city'].lower() == request.city.lower() and s['area'].lower() == request.area.lower() and s['property_type'].lower() == request.property_type.lower()]
            comps.sort(key=lambda x: x['months_ago'])
            recent_comps = comps[:3] # Top 3 recent
            
            if len(recent_comps) > 0:
                # Blend prediction with actual recent historical data (price per sqft basis)
                comp_prices_per_sqft = [(c['price'] * 100000) / c['total_sqft'] for c in recent_comps]
                avg_comp_price_per_sqft = sum(comp_prices_per_sqft) / len(comp_prices_per_sqft)
                
                # Projected price for requested sqft based on recent history
                recent_sales_projected_price = (request.sqft * avg_comp_price_per_sqft) / 100000
                
                # Ensemble 50/50 blend
                predicted_price = (predicted_price + recent_sales_projected_price) / 2
                
        # Calculate price range and confidence from individual trees
        tree_predictions = []
        for tree in __model.estimators_:
            # Each tree might require different formatting depending on exactly how it's saved, 
            # but standard sklearn RF estimators take the same input.
            pred = tree.predict(x_pred)[0]
            tree_predictions.append(pred)
            
        std_dev = np.std(tree_predictions)
        
        # Price range: +/- 1 standard deviation
        price_range = [
            max(0, predicted_price - std_dev), # Don't go below 0
            predicted_price + std_dev
        ]
        
        # Confidence score (inverse of coefficient of variation, bounded to 0-100%)
        cv = std_dev / predicted_price if predicted_price > 0 else 1
        confidence = max(0.0, min(100.0, (1 - cv * 0.5) * 100))
        
        # Format recent comps for frontend
        formatted_comps = [
            {
                "prop_type": c['property_type'],
                "sqft": c['total_sqft'],
                "months_ago": c['months_ago'],
                "price": round(c['price'], 2)
            }
            for c in recent_comps
        ]
        
        # Breakdown & Insights
        base_price_lakhs = (request.sqft * 4500) / 100000 # 4500 roughly represents average Gujarat base rate
        location_premium = predicted_price - base_price_lakhs
        
        breakdown = [
            {"label": "Base Configuration (SQFT)", "value": round(base_price_lakhs, 2)},
            {"label": "Location & Demand Multipliers", "value": round(location_premium, 2)}
        ]
        
        insights = []
        if confidence >= 90:
            insights.append("Very high confidence—strong recent transaction density in this area.")
        else:
            insights.append("Estimates are slightly variable due to sparse recent transaction history.")
            
        if predicted_price > 80:
            insights.append("Premium valuation bracket—excellent potential for long-term rental yield.")
        else:
            insights.append("Highly accessible price point—consider for rapid capital appreciation.")
        
        return {
            "prediction": round(predicted_price, 2),
            "prediction_unit": "Lakhs",
            "price_range": [round(price_range[0], 2), round(price_range[1], 2)],
            "confidence": round(confidence, 1),
            "recent_comps": formatted_comps,
            "breakdown": breakdown,
            "insights": insights
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
