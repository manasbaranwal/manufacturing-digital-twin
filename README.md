# Manufacturing Digital Twin

A hackathon-ready digital twin for a smart manufacturing environment. This starter project includes a FastAPI backend that simulates live machine telemetry and a React + Vite dashboard for visualizing production health, efficiency, and alerts.

## Project goals

- Model a small factory line with multiple machines
- Simulate production telemetry in real time
- Track KPIs like throughput, efficiency, and downtime
- Highlight maintenance risks and anomalies
- Provide a clean dashboard for a technology demo

## Repository structure

- `backend/`: Python API and simulation logic
- `frontend/`: React dashboard UI
- `README.md`: project overview and setup

## Quick start

### 1) Start the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2) Start the frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

Then open the Vite dev URL and the app will connect to the backend API.

## API endpoints

- `GET /api/health`
- `GET /api/telemetry`
- `GET /api/analytics`

## Example use cases

- Machine health monitoring
- Predictive maintenance alerts
- OEE and throughput insights
- Digital twin demo for manufacturing operations

## Tech stack

- Backend: FastAPI, Python
- Frontend: React, Vite
- Simulated telemetry: Python-generated machine metrics

## Hackathon extension ideas

- Add a digital twin of the full production line
- Use machine learning to predict failure windows
- Add sensor history and charts
- Integrate IoT/PLC-style data streams
- Show downtime and maintenance recommendations
