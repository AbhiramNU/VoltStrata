from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np
import os

app = FastAPI(title="VoltStrata API")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
reg_model = None
clf_model = None

@app.on_event("startup")
def load_models():
    global reg_model, clf_model
    base_path = os.path.dirname(os.path.abspath(__file__))
    reg_path = os.path.join(base_path, "energy_reg_model.pkl")
    clf_path = os.path.join(base_path, "energy_clf_model.pkl")
    
    if os.path.exists(reg_path):
        with open(reg_path, "rb") as f:
            reg_model = pickle.load(f)
        print(f"🚀 Regression model loaded from {reg_path}")
    else:
        print(f"❌ Regression model NOT found at {reg_path}")
        
    if os.path.exists(clf_path):
        with open(clf_path, "rb") as f:
            clf_model = pickle.load(f)
        print(f"🚀 Classification model loaded from {clf_path}")
    else:
        print(f"❌ Classification model NOT found at {clf_path}")


class PredictionRequest(BaseModel):
    hour: int
    day_of_week: int
    month: int
    power_lag_1: float

@app.get("/")
def home():
    return {"status": "VoltStrata API is online", "models_loaded": reg_model is not None}

@app.post("/predict")
def predict(data: PredictionRequest):
    if reg_model is None or clf_model is None:
        return {"error": "Models not loaded"}
    
    # Prepare input for scikit-learn
    input_df = pd.DataFrame([[data.hour, data.day_of_week, data.month, data.power_lag_1]], 
                            columns=['Hour', 'Day_of_Week', 'Month', 'power_lag_1'])
    
    # Run predictions
    reg_pred = reg_model.predict(input_df)[0]
    clf_pred = int(clf_model.predict(input_df)[0])
    
    return {
        "predicted_power": round(reg_pred, 3),
        "usage_class": "High" if clf_pred == 1 else "Normal",
        "class_id": clf_pred
    }

@app.get("/visualize")
def visualize():
    if reg_model is None:
        return {"error": "Model not loaded"}
    
    # Simulate a full 24h sequence for the current day
    import datetime
    now = datetime.datetime.now()
    results = []
    
    # We'll use a realistic baseline power_lag
    last_power = 1.2 
    
    for h in range(24):
        input_df = pd.DataFrame([[h, now.weekday(), now.month, last_power]], 
                                columns=['Hour', 'Day_of_Week', 'Month', 'power_lag_1'])
        pred = reg_model.predict(input_df)[0]
        results.append({
            "hour": h,
            "val": round(pred, 3)
        })
        last_power = pred # Lag logic
        
    return results

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
