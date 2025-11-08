# AI-Powered Personal Finance Dashboard

## Description

The **AI-Powered Personal Finance Dashboard** is a web application designed to help users manage personal finances effectively. It tracks income and expenses, predicts future trends using AI, and provides actionable insights through a modern, responsive dashboard.

---

## Features

* **Interactive Dashboard**: Visualize income and expenses using Chart.js or D3.js.
* **AI-Powered Forecasting**: Predict finances for the next 3–6 months with LSTM, ARIMA, or Prophet models.
* **Budget Alerts**: Receive notifications for overspending.
* **Data Export**: Export transactions and charts as CSV or PDF.
* **Mobile-Friendly Design**: Responsive UI with clean colors, neumorphism, or soft gradients.
* **Modern UI**: Sleek interface with TailwindCSS or Material-UI.

---

## Technologies

* **Backend**: Python (Flask or FastAPI)
* **Frontend**: JavaScript (React or Vue.js)
* **Database**: PostgreSQL or SQLite
* **AI/ML**: Time Series Forecasting (Prophet, ARIMA, LSTM)
* **Charts**: Chart.js or D3.js
* **UI Frameworks**: TailwindCSS or Material-UI

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/Pavlos-Stefanidis/Personal_Finance.git
cd finance-dashboard
```

2. **Backend setup**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Database setup**

* Configure PostgreSQL or SQLite in the backend config.
* Run migrations:

```bash
python manage.py db upgrade
```

4. **Frontend setup**

```bash
cd frontend
npm install
npm start
```

---

## AI Module Example

```python
import pandas as pd
from keras.models import Sequential
from keras.layers import LSTM, Dense

def predict_finances(transaction_data):
    """
    Fetch, clean, and preprocess transaction data.
    Apply LSTM to forecast income and expenses.
    Return results as JSON.
    """
    df = pd.DataFrame(transaction_data)
    # Feature engineering and scaling...

    model = Sequential()
    model.add(LSTM(50, activation='relu', input_shape=(timesteps, features)))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mse')

    # Train model and predict...
    forecast = model.predict(df_input)

    return {"forecast": forecast.tolist()}
```

---

## Frontend Note

Use **TailwindCSS** or **Material-UI** for a sleek, responsive UI. Ensure charts are interactive and the dashboard works seamlessly on desktop and mobile devices.

---

## Usage

1. Log in or create an account.
2. Add income and expense transactions.
3. View interactive charts for insights.
4. Enable AI forecasts for 3–6 month predictions.
5. Set budget alerts.
6. Export data and charts as CSV or PDF.

---

## Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature/feature-name`
3. Commit: `git commit -m "Add some feature"`
4. Push: `git push origin feature/feature-name`
5. Open a Pull Request.

---

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## Acknowledgements

* [Prophet](https://facebook.github.io/prophet/)
* [ARIMA Models](https://www.statsmodels.org/stable/tsa.html)
* [Keras LSTM](https://keras.io/guides/sequential_model/)
* [Chart.js](https://www.chartjs.org/)
* [D3.js](https://d3js.org/)
* [TailwindCSS](https://tailwindcss.com/)
* [Material-UI](https://mui.com/)
