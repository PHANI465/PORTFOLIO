---
title: "SARIMAX for Crowd Forecasting: Lessons from TravelIQ"
excerpt: "How I used SARIMAX time-series models to predict tourist crowd density for real-time travel optimization — and what I learned along the way."
date: "2024-06-01"
author: "Phaneendra Gavara"
tags: ["time-series", "SARIMAX", "forecasting", "machine-learning", "python"]
category: "Machine Learning"
published: true
coverImage: "/images/blog/sarimax-cover.png"
---

# SARIMAX for Crowd Forecasting: Lessons from TravelIQ

When I built **TravelIQ**, one of the core technical challenges was predicting how crowded a tourist location would be at any given date and time. Nobody wants to visit the Eiffel Tower at peak rush hour — but how do you predict that reliably?

The answer I landed on was **SARIMAX** (Seasonal AutoRegressive Integrated Moving Average with eXogenous regressors) — a classic but powerful time-series model that turned out to be surprisingly well-suited for this problem.

## Why Not Just Use a Neural Network?

My first instinct was to throw a transformer at the problem. But for structured, low-frequency, interpretable forecasting with clear seasonal patterns (weekends, holidays, weather), SARIMAX gave us:

- **Interpretability** — you can actually explain what the model is doing
- **Data efficiency** — works well with limited historical data
- **Explicit seasonality modeling** — tourist crowds have weekly, monthly, and yearly patterns
- **Exogenous variable support** — plug in weather, events, holidays directly

## The Core Formula

SARIMAX(p, d, q)(P, D, Q, s) models the series as:

```
y_t = c + φ₁y_{t-1} + ... + φₚy_{t-p} 
      + Φ₁y_{t-s} + ... + ΦₚY_{t-Ps}
      + β₁x_{t,1} + ... + βₖx_{t,k}
      + ε_t
```

For crowd data, I found `(1,1,1)(1,1,1,7)` — weekly seasonality — to work well as a starting point.

## Exogenous Features That Helped

```python
exog_features = [
    'temperature_celsius',    # from Open-Meteo API
    'precipitation_mm',
    'is_weekend',
    'is_holiday',
    'sentiment_score',        # from DistilBERT review analysis
    'month_sin',              # cyclical encoding
    'month_cos',
]
```

The `sentiment_score` from real-time review scraping was the most surprising addition — recent negative reviews reliably preceded crowd drops.

## Key Implementation Snippet

```python
from statsmodels.tsa.statespace.sarimax import SARIMAX
import pandas as pd

def fit_crowd_model(df: pd.DataFrame, location_id: str):
    series = df[df['location_id'] == location_id]['visitor_count']
    exog = df[df['location_id'] == location_id][exog_features]
    
    model = SARIMAX(
        series,
        exog=exog,
        order=(1, 1, 1),
        seasonal_order=(1, 1, 1, 7),
        enforce_stationarity=False,
        enforce_invertibility=False
    )
    
    result = model.fit(disp=False)
    return result
```

## What I'd Do Differently

1. **Auto-ARIMA first** — use `pmdarima.auto_arima()` to find optimal (p,d,q) instead of manual tuning
2. **Ensemble with Prophet** — Facebook Prophet handles holidays extremely well
3. **Location-specific models** — one model per location outperforms a global model significantly
4. **Prediction intervals** — report uncertainty ranges, not just point estimates

## Wrapping Up

SARIMAX is an underrated tool in the ML engineer's toolkit. When your data has strong seasonality and you care about interpretability and exogenous factors, it often beats more complex deep learning approaches — especially with limited data.

The key is knowing when to reach for it. For TravelIQ's crowd forecasting problem, it was the right tool.
