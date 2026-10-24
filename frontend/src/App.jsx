import { useEffect, useState } from 'react';

function formatNumber(value) {
  return Number(value).toFixed(1);
}

export default function App() {
  const [telemetry, setTelemetry] = useState({ machines: [] });
  const [analytics, setAnalytics] = useState({ alerts: [], overall_efficiency_pct: 0, total_throughput_per_hour: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [telemetryRes, analyticsRes] = await Promise.all([
          fetch('/api/telemetry'),
          fetch('/api/analytics'),
        ]);

        const telemetryData = await telemetryRes.json();
        const analyticsData = await analyticsRes.json();

        setTelemetry(telemetryData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Failed to fetch digital twin data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const timer = setInterval(fetchData, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-shell">
      <style>{`
        :root {
          color-scheme: dark;
          font-family: Inter, 'Segoe UI', sans-serif;
          background: #06141f;
          color: #ecf7ff;
        }

        * { box-sizing: border-box; }

        body {
          margin: 0;
          background: linear-gradient(180deg, #06141f 0%, #0d1d2b 100%);
          color: #ecf7ff;
        }

        .app-shell {
          max-width: 1300px;
          margin: 0 auto;
          padding: 32px 24px 48px;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
        }

        .eyebrow {
          margin: 0 0 6px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 11px;
          color: #7ec5ff;
        }

        h1 {
          margin: 0;
          font-size: clamp(2rem, 4vw, 3rem);
        }

        .status-pill {
          background: rgba(87, 199, 141, 0.15);
          color: #7df2b0;
          border: 1px solid rgba(125, 242, 176, 0.3);
          padding: 8px 16px;
          border-radius: 999px;
          font-weight: 600;
        }

        .loading {
          padding: 40px 0;
          text-align: center;
          color: #a7d8ff;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 18px;
          margin-bottom: 24px;
        }

        .metric-card {
          border-radius: 18px;
          padding: 20px 18px;
          border: 1px solid rgba(148, 163, 184, 0.15);
          background: rgba(11, 23, 35, 0.75);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.18);
        }

        .metric-card span {
          display: block;
          font-size: 0.85rem;
          color: #9ec2dc;
          margin-bottom: 12px;
        }

        .metric-card strong {
          font-size: clamp(1.2rem, 3vw, 2rem);
          font-weight: 700;
        }

        .accent-blue { border-top: 4px solid #4aa8ff; }
        .accent-green { border-top: 4px solid #58d68d; }
        .accent-orange { border-top: 4px solid #ffb454; }
        .accent-purple { border-top: 4px solid #a78bfa; }

        .content-grid {
          display: grid;
          grid-template-columns: 1.7fr 1fr;
          gap: 24px;
        }

        .panel {
          background: rgba(11, 23, 35, 0.78);
          border: 1px solid rgba(148, 163, 184, 0.12);
          border-radius: 18px;
          padding: 18px 20px;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
        }

        .panel h2 {
          margin: 0 0 16px;
          font-size: 1.2rem;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          text-align: left;
          padding: 12px 10px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.12);
        }

        th {
          color: #9ec2dc;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        tbody tr:hover {
          background: rgba(74, 168, 255, 0.05);
        }

        .alert-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .alert {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
          padding: 12px 14px;
          border-left: 4px solid #4aa8ff;
        }

        .alert-low { border-left-color: #58d68d; }
        .alert-medium { border-left-color: #ffb454; }
        .alert-high { border-left-color: #ff5d5d; }

        .severity {
          display: inline-block;
          min-width: 56px;
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.1);
          color: #dfeefb;
          font-size: 0.7rem;
          font-weight: 700;
          text-align: center;
        }

        .alert p {
          margin: 6px 0 0;
          color: #dfeefb;
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header className="topbar">
        <div>
          <p className="eyebrow">Manufacturing Digital Twin</p>
          <h1>Factory Operations Console</h1>
        </div>
        <div className="status-pill">Live Data</div>
      </header>

      {loading ? (
        <div className="loading">Loading telemetry…</div>
      ) : (
        <>
          <section className="metrics-grid">
            <div className="metric-card accent-blue">
              <span>Overall Efficiency</span>
              <strong>{formatNumber(analytics.overall_efficiency_pct)}%</strong>
            </div>
            <div className="metric-card accent-green">
              <span>Total Throughput</span>
              <strong>{formatNumber(analytics.total_throughput_per_hour)} units/hr</strong>
            </div>
            <div className="metric-card accent-orange">
              <span>Active Alerts</span>
              <strong>{analytics.alerts.length}</strong>
            </div>
            <div className="metric-card accent-purple">
              <span>Updated</span>
              <strong>{new Date(telemetry.timestamp).toLocaleTimeString()}</strong>
            </div>
          </section>

          <section className="content-grid">
            <div className="panel">
              <h2>Machine Status</h2>
              <table>
                <thead>
                  <tr>
                    <th>Machine</th>
                    <th>Line</th>
                    <th>Temp</th>
                    <th>Vibration</th>
                    <th>Output</th>
                    <th>Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {telemetry.machines.map((machine) => (
                    <tr key={machine.id}>
                      <td>{machine.name}</td>
                      <td>{machine.line}</td>
                      <td>{formatNumber(machine.temperature_c)}°C</td>
                      <td>{formatNumber(machine.vibration_mm_s)} mm/s</td>
                      <td>{formatNumber(machine.throughput_per_hour)}/hr</td>
                      <td>{formatNumber(machine.efficiency_pct)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="panel">
              <h2>Operational Alerts</h2>
              <ul className="alert-list">
                {analytics.alerts.map((alert, index) => (
                  <li key={`${alert.machine_id}-${index}`} className={`alert alert-${alert.severity.toLowerCase()}`}>
                    <span className="severity">{alert.severity}</span>
                    <div>
                      <strong>{alert.machine_id}</strong>
                      <p>{alert.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
