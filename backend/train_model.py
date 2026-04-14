import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib
import json
import logging
import random

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Define Gujarat City and Area structure with base prices per sqft and demand multiplier
CITIES = {
    "Ahmedabad": {
        "base_price": 5000,
        "areas": {
            "Satellite": 1.7, "SG Highway": 1.4, "Navrangpura": 1.4, 
            "Bopal": 1.6, "Nikol": 0.8, "Naroda": 0.7, "Vastrapur": 1.3,
            "Maninagar": 1.6, "Sindhu Bhavan": 1.8
        }
    },
    "Surat": {
        "base_price": 4500,
        "areas": {
            "Vesu": 1.4, "Adajan": 1.1, "Varachha": 0.9, "Piplod": 1.3, "Palanpur": 1.0,
            "Mota Varachha": 1.5
        }
    },
    "Vadodara": {
        "base_price": 4000,
        "areas": {
            "Alkapuri": 1.5, "Gotri": 1.1, "Waghodia": 0.5, "Karelibaug": 1.0, "Manjalpur": 0.9,
            "Akota": 1.35
        }
    },
    "Rajkot": {
        "base_price": 3800,
        "areas": {
            "Kalawad Road": 1.4, "Amin Marg": 1.2, "Mavdi": 0.9, "Nana Mava": 1.0
        }
    },
    "Gandhinagar": {
        "base_price": 4200,
        "areas": {
            "Sargasan": 1.3, "Kudasan": 1.2, "Info City": 1.1, "Sector 21": 1.0
        }
    },
    "Bhavnagar": { "base_price": 3200, "areas": { "Kalanala": 1.2, "Waghawadi Road": 1.4, "Suburbs": 0.9 } },
    "Jamnagar": { "base_price": 3100, "areas": { "Park Colony": 1.3, "Digvijay Plot": 1.0, "Suburbs": 0.9 } },
    "Junagadh": { "base_price": 2800, "areas": { "Zanzarda Road": 1.2, "Talav Gate": 1.1, "Suburbs": 0.9 } },
    "Anand": { "base_price": 3500, "areas": { "Vidyanagar Road": 1.3, "Town Hall": 1.1, "Suburbs": 0.9 } },
    "Navsari": { "base_price": 3300, "areas": { "Lunsikui": 1.2, "Station Road": 1.1, "Suburbs": 0.9 } },
    "Bharuch": { "base_price": 3400, "areas": { "Zadeshwar": 1.3, "Link Road": 1.1, "Suburbs": 0.9 } },
    "Mehsana": { "base_price": 3000, "areas": { "Radhanpur Road": 1.2, "Modhera Road": 1.1, "Suburbs": 0.9 } },
    "Morbi": { "base_price": 2900, "areas": { "Sanala Road": 1.2, "Rapar Road": 1.0, "Suburbs": 0.9 } },
    "Gandhidham": { "base_price": 3100, "areas": { "Sector 1": 1.2, "Sector 4": 1.1, "Suburbs": 0.9 } },
    "Porbandar": { "base_price": 2700, "areas": { "Chhaya": 1.1, "Khapat": 1.0, "Suburbs": 0.9 } },
    "Patan": { "base_price": 2600, "areas": { "City Center": 1.1, "University Road": 1.2, "Suburbs": 0.9 } },
    "Bhuj": { "base_price": 2900, "areas": { "Hospital Road": 1.2, "Jubilee Ground": 1.1, "Suburbs": 0.9 } },
    "Valsad": { "base_price": 3300, "areas": { "Halar Road": 1.2, "Tithal Road": 1.4, "Suburbs": 0.9 } },
    "Vapi": { "base_price": 3400, "areas": { "Chala": 1.2, "Gunjan": 1.1, "Suburbs": 0.9 } },
    "Godhra": { "base_price": 2500, "areas": { "City Center": 1.1, "Prabha Tract": 1.0, "Suburbs": 0.9 } },
    "Palanpur": { "base_price": 2700, "areas": { "Highway": 1.2, "City Center": 1.1, "Suburbs": 0.9 } },
    "Himmatnagar": { "base_price": 2800, "areas": { "Motipura": 1.2, "Polo Ground": 1.1, "Suburbs": 0.9 } }
}

PROPERTY_TYPES = {
    "Flat": 1.0,
    "Apartment": 1.1,
    "Duplex": 1.4,
    "Bungalow": 1.8
}

def generate_synthetic_data(num_records=15000):
    logger.info("Generating Synthetic Gujarat Dataset...")
    np.random.seed(42)
    random.seed(42)
    
    data = []
    cities_list = list(CITIES.keys())
    
    for _ in range(num_records):
        city = random.choice(cities_list)
        area = random.choice(list(CITIES[city]["areas"].keys()))
        prop_type = random.choice(list(PROPERTY_TYPES.keys()))
        
        # Base specifications
        bhk = random.choices([1, 2, 3, 4, 5, 6], weights=[5, 30, 40, 15, 8, 2])[0]
        
        # SqFt varies by BHK and prop type
        if prop_type in ["Bungalow", "Duplex"]:
            bhk = max(3, bhk)
            sqft = np.random.normal(bhk * 800, 400)
        else:
            sqft = np.random.normal(bhk * 550, 150)
            
        sqft = max(500, int(sqft))
        
        # Bath depends on BHK
        bath = max(1, min(bhk + random.randint(0, 1), 6))
        
        age = random.randint(0, 30)
        
        # Baseline price logic (in Rupees)
        base_rate = CITIES[city]["base_price"]
        area_multiplier = CITIES[city]["areas"][area]
        prop_multiplier = PROPERTY_TYPES[prop_type]
        
        price_per_sqft = base_rate * area_multiplier * prop_multiplier
        
        # Age depreciation (1% per yr, capped at 20%)
        depreciation = max(0.8, 1 - (age * 0.01))
        
        # Natural variation +/- 10%
        variation = np.random.uniform(0.9, 1.1)
        
        # Historical factor (simulating transactions up to 5 years ago)
        months_ago = random.randint(1, 60)
        
        # Base price today
        current_price_rupees = sqft * price_per_sqft * depreciation * variation
        
        # Deflate price based on how many months ago it was sold (~0.5% growth per month to simulate market appreciation)
        historical_price_rupees = current_price_rupees / ((1 + 0.005) ** months_ago)
        price_in_lakhs = historical_price_rupees / 100000
        
        data.append([city, area, prop_type, sqft, bhk, bath, age, months_ago, price_in_lakhs])
        
    df = pd.DataFrame(data, columns=['city', 'area', 'property_type', 'total_sqft', 'bhk', 'bath', 'age', 'months_ago', 'price'])
    
    # Save a slice of raw data to act as our historical database
    logger.info("Saving historical sales data database...")
    historical_df = df.copy()
    historical_df.to_json('historical_sales.json', orient='records')
    
    return df

def train():
    df = generate_synthetic_data()
    
    logger.info("One-Hot Encoding features...")
    # Add dummies for categorical fields
    df_with_dummies = pd.get_dummies(df, columns=['city', 'area', 'property_type'], drop_first=True)
    
    X = df_with_dummies.drop('price', axis=1)
    y = df_with_dummies['price']
    
    logger.info("Training Random Forest Dataset...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    rf_clf = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=15, min_samples_leaf=3)
    rf_clf.fit(X_train, y_train)
    
    score = rf_clf.score(X_test, y_test)
    logger.info(f"Model trained with R^2 score: {score:.4f}")
    
    # Feature Importances
    importances = rf_clf.feature_importances_
    feature_importances = {}
    base_features = ['total_sqft', 'bhk', 'bath', 'age', 'months_ago']
    
    # Combine importances conceptually
    cat_imp = {"city": 0, "area": 0, "property_type": 0}
    for idx, col in enumerate(X.columns):
        if col in base_features:
            feature_importances[col] = float(importances[idx])
        elif col.startswith('city_'):
            cat_imp['city'] += importances[idx]
        elif col.startswith('area_'):
            cat_imp['area'] += importances[idx]
        elif col.startswith('prop_') or col.startswith('property_type_'):
            cat_imp['property_type'] += importances[idx]
            
    feature_importances['location (city/area)'] = float(cat_imp['city'] + cat_imp['area'])
    feature_importances['property_type'] = float(cat_imp['property_type'])
    
    logger.info("Saving artifacts...")
    joblib.dump(rf_clf, 'model.pkl')
    
    # Built nested structure for frontend dropdowns
    nested_locations = {}
    for city, details in CITIES.items():
        nested_locations[city] = list(details["areas"].keys())
        
    prop_types_list = list(PROPERTY_TYPES.keys())
    
    columns_data = {
        'data_columns': [col.lower() for col in X.columns],
        'feature_importances': feature_importances,
        'nested_locations': nested_locations,
        'property_types': prop_types_list,
        'cities': list(CITIES.keys())
    }
    
    with open('locations.json', 'w') as f:
        json.dump(columns_data, f)
        
    logger.info("Training and packaging completed successfully!")

if __name__ == "__main__":
    train()
