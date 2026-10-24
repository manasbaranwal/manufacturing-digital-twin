from datetime import datetime, timezone
from random import gauss

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Manufacturing Digital Twin API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MACHINES = [
    {"id": "M-101", "name": "CNC Lathe", "line": "Line A", "status": "Running"},
    {"id": "M-102", "name": "Laser Cutter", "line": "Line A", "status": "Running"},
    {"id": "M-103", "name": "Robot Arm", "line": "Line B", "status": "Maintenance"},
    {"id": "M-104", "name": "Assembly Cell", "line": "Line B", "status": "Running"},
]


def clamp(value, minimum, maximum):
    return max(minimum, min(value, maximum))


def build_machine_snapshot(machine):
    base = {
        "M-101": {"temperature": 74, "vibration": 2.7, "throughput": 98, "efficiency": 91, "power": 61},
        "M-102": {"temperature": 81, "vibration": 3.2, "throughput": 93, "efficiency": 88, "power": 64},
        "M-103": {"temperature": 92, "vibration": 5.1, "throughput": 64, "efficiency": 73, "power": 72},
        "M-104": {"temperature": 70, "vibration": 2.2, "throughput": 101, "efficiency": 96, "power": 58},
    }

    values = base[machine["id"]]
    noise = gauss(0, 1.5)
    temp = clamp(values["temperature"] + noise, 55, 110)
    vibration = clamp(values["vibration"] + gauss(0, 0.4), 1.0, 7.0)
    throughput = clamp(values["throughput"] + gauss(0, 8), 40, 130)
    efficiency = clamp(values["efficiency"] + gauss(0, 4), 50, 100)
    power = clamp(values["power"] + gauss(0, 5), 35, 90)

    if machine["status"] == "Maintenance":
        temp += 10
        vibration += 1.4
        efficiency -= 12
        throughput -= 20

    return {
        "id": machine["id"],
        "name": machine["name"],
        "line": machine["line"],
        "status": machine["status"],
        "temperature_c": round(temp, 1),
        "vibration_mm_s": round(vibration, 2),
        "throughput_per_hour": round(throughput, 1),
        "efficiency_pct": round(efficiency, 1),
        "power_kw": round(power, 1),
    }


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "manufacturing-digital-twin-api"}


@app.get("/api/telemetry")
def telemetry():
    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "machines": [build_machine_snapshot(machine) for machine in MACHINES],
    }


@app.get("/api/analytics")
def analytics():
    telemetry = [build_machine_snapshot(machine) for machine in MACHINES]
    avg_efficiency = sum(item["efficiency_pct"] for item in telemetry) / len(telemetry)
    total_throughput = sum(item["throughput_per_hour"] for item in telemetry)
    at_risk = [item for item in telemetry if item["temperature_c"] > 85 or item["vibration_mm_s"] > 4.5]

    alerts = []
    for item in at_risk:
        alerts.append(
            {
                "machine_id": item["id"],
                "message": "Temperature and vibration are trending high; inspect before next shift.",
                "severity": "High" if item["temperature_c"] > 90 else "Medium",
            }
        )

    if not alerts:
        alerts.append({"machine_id": "ALL", "message": "Factory line running within normal thresholds.", "severity": "Low"})

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "overall_efficiency_pct": round(avg_efficiency, 1),
        "total_throughput_per_hour": round(total_throughput, 1),
        "alerts": alerts,
        "machines": telemetry,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
