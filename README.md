# ⚡ VOLTSTRATA: Neural Energy Intelligence

**VoltStrata** is a high-fidelity energy consumption forecasting platform that leverages context-aware Machine Learning to anticipate grid demand. Built with a brutalist-luxury aesthetic and a high-performance neural engine, it transforms raw household power data into actionable temporal intelligence.

![VoltStrata UI Preview](https://raw.githubusercontent.com/AbhiramNU/VoltStrata/main/public/preview.png)

## 🚀 Vision
The project aims to solve the "sensor-gap" in energy management by using pure temporal intelligence (Date/Time/Lag) to predict consumption patterns with **99% realism targets** for edge-node deployment.

## 🛠️ Tech Stack
- **Frontend**: Astro v4 + React (Islands Architecture)
- **Styling**: Tailwind CSS v4 + Framer Motion/GSAP
- **Intelligence**: FastAPI (Python) + Scikit-Learn (Random Forest Pipelines)
- **Data**: UCI Household Power Consumption (2M+ samples)

## 🧠 Machine Learning Engine
- **Inference Models**: Random Forest Regressor (KW Prediction) & Random Forest Classifier (Usage Tiering).
- **Feature Engineering**: Circular temporal encoding (Hour, Day, Month) and recursive Lag-1 awareness.
- **Accuracy**: 0.57 R² for regression and 71.2% classification accuracy on hourly resampled data.

## 📦 Installation & Setup

### 1. Backend (Python Server)
```bash
# Navigate to root
pip install pandas scikit-learn fastapi uvicorn pydantic
python backend_main.py
```

### 2. Frontend (Astro)
```bash
npm install
npm run dev
```

## 📂 Project Structure
- `/src`: Astro layouts, pages, and React components.
- `backend_main.py`: FastAPI inference engine.
- `export_models.py`: Model training and serialization script.
- `energy_consumption_prediction.ipynb`: Original Research & Data Wrangling notebook.
- `household_power_consumption.txt`: raw dataset (UCI Archive).

## 👤 Author
**Abhiram N udupa**
- [Instagram](https://www.instagram.com/abhi_udupa00/)
- [GitHub](https://github.com/AbhiramNU)
- [LinkedIn](https://www.linkedin.com/in/abhiramnu/)

---
*© 2026 ABHIRAM N UDUPA. Engineered for the future of energy.*
