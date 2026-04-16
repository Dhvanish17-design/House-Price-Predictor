from flask import Flask, request, jsonify, abort, render_template
from flask_cors import CORS
import joblib
import json
import numpy as np
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})

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
        
    # Ensure model compatibility across scikit-learn versions (specifically for 'monotonic_cst')
    if __model and hasattr(__model, 'estimators_'):
        for tree in __model.estimators_:
            if not hasattr(tree, 'monotonic_cst'):
                tree.monotonic_cst = None
except Exception as e:
    print(f"Error loading model artifacts: {e}")
    __model = None
    __data_columns = None
    __feature_importances = {}
    __cities = []
    __nested_locations = {}
    __property_types = []
    __historical_sales = []
    
@app.route("/", methods=['GET'])
def home():
    return render_template("index.html")

# Aliases for compatibility with different frontend versions
@app.route("/locations", methods=['GET'])
def get_locations_alias():
    return get_locations()

@app.route("/predict", methods=['POST'])
def predict_price_alias():
    return predict_price()

@app.route("/feature-importance", methods=['GET'])
def get_feature_importance_alias():
    return get_feature_importance()


@app.route("/api/locations", methods=['GET'])
def get_locations():
    return jsonify({
        "cities": __cities,
        "nested_locations": __nested_locations,
        "property_types": __property_types
    })

@app.route("/api/feature-importance", methods=['GET'])
def get_feature_importance():
    return jsonify({"feature_importances": __feature_importances})

@app.route("/api/predict", methods=['POST'])
def predict_price():
    if not __model or not __data_columns:
         return jsonify({"detail": "Model is not loaded"}), 500
         
    try:
        # Get data from JSON request
        data = request.get_json()
        print("Incoming data:", data)
        if not data:
            return {"error": "No input data provided"}, 400
            
        city = data.get('city')
        area = data.get('area')
        property_type = data.get('property_type')
        sqft = float(data.get('sqft', 0))
        bhk = int(data.get('bhk', 0))
        bath = int(data.get('bath', 0))
        age = int(data.get('age', 0))

        # Build feature vector
        x = np.zeros(len(__data_columns))
        
        sqft_idx = __data_columns.index('total_sqft') if 'total_sqft' in __data_columns else 0
        bhk_idx = __data_columns.index('bhk') if 'bhk' in __data_columns else 1
        bath_idx = __data_columns.index('bath') if 'bath' in __data_columns else 2
        age_idx = __data_columns.index('age') if 'age' in __data_columns else 3
        months_ago_idx = __data_columns.index('months_ago') if 'months_ago' in __data_columns else -1
        
        x[sqft_idx] = sqft
        x[bhk_idx] = bhk
        x[bath_idx] = bath
        x[age_idx] = age
        
        if months_ago_idx != -1:
            x[months_ago_idx] = 0 # Predicting for current market (0 months ago)
        
        city_col = f"city_{city}".lower()
        area_col = f"area_{area}".lower()
        prop_col = f"property_type_{property_type}".lower()
        
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
            comps = [s for s in __historical_sales if s['city'].lower() == city.lower() and s['area'].lower() == area.lower() and s['property_type'].lower() == property_type.lower()]
            comps.sort(key=lambda x: x['months_ago'])
            recent_comps = comps[:3] # Top 3 recent
            
            if len(recent_comps) > 0:
                # Blend prediction with actual recent historical data (price per sqft basis)
                comp_prices_per_sqft = [(c['price'] * 100000) / c['total_sqft'] for c in recent_comps]
                avg_comp_price_per_sqft = sum(comp_prices_per_sqft) / len(comp_prices_per_sqft)
                
                # Projected price for requested sqft based on recent history
                recent_sales_projected_price = (sqft * avg_comp_price_per_sqft) / 100000
                
                # Ensemble 50/50 blend
                predicted_price = (predicted_price + recent_sales_projected_price) / 2
                
        # Calculate price range and confidence from individual trees
        tree_predictions = []
        for tree in __model.estimators_:
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
        base_price_lakhs = (sqft * 4500) / 100000 # 4500 roughly represents average Gujarat base rate
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
        
        return jsonify({
            "prediction": round(predicted_price, 2),
            "prediction_unit": "Lakhs",
            "price_range": [round(price_range[0], 2), round(price_range[1], 2)],
            "confidence": round(confidence, 1),
            "recent_comps": formatted_comps,
            "breakdown": breakdown,
            "insights": insights
        })
    except Exception as e:
        import traceback
        print("ERROR:", str(e))
        print(traceback.format_exc())
        return {"error": str(e)}, 500

# Catch-all route for SPA (React Router) compatibility
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=True)

