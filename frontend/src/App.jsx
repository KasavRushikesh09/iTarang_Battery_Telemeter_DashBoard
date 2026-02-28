import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './App.css';
import StatusCards from './components/StatusCards.jsx';
import TimeSeriesCharts from './components/TimeSeriesCharts.jsx';
import DataTable from './components/DataTable.jsx';
import InsightsPanel from './components/InsightsPanel.jsx';

const API_BASE_URL = 'http://localhost:4000';

function formatTimestamp(ms) {
  if (!ms) return 'N/A';
  return new Date(ms).toLocaleString('en-IN', {
    year: '2-digit',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function App() {
 // In App.jsx

const [telemetry, setTelemetry] = useState([]);
const [pagination, setPagination] = useState(null);
const [days, setDays] = useState(3);           // default last 3 days
const [page, setPage] = useState(1);
const [error, setError] = useState('');
const [darkMode, setDarkMode] = useState(false);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(
      `${API_BASE_URL}/api/telemetry?page=${page}&limit=50`
      );

      setTelemetry(res.data.data);
      setPagination(res.data);
    } catch (err) {
      console.error(err);
      setError(
        'Failed to load telemetry data. Make sure the backend is running on port 4000.'
      );
    } finally {
      setLoading(false);
    }
  }

  fetchData();

}, [page]);

  const latest = useMemo(
    () => (telemetry.length ? telemetry[0] : null),
    [telemetry]
  );

  if (loading) {
    return (
      <div className={`app app-loading ${darkMode ? 'dark' : 'light'}`}>
        <div className="loader" />
        <p>Loading battery telemetry…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`app app-error ${darkMode ? 'dark' : 'light'}`}>
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <div>
          <h1>Battery Telemetry Dashboard</h1>
          <p className="subtitle">
            Live health & performance view for a single e-rickshaw battery
          </p>
        </div>
        <div className="header-controls">
          <div className="dark-toggle">
            <span>{darkMode ? 'Dark' : 'Light'} mode</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode((v) => !v)}
              />
              <span className="slider round" />
            </label>
          </div>
          {latest && (
            <div className="timestamp-pill">
              Last sample: {formatTimestamp(latest.time)}
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="grid-section full-width">
          <StatusCards latest={latest} />
        </section>

        <section className="grid-section">
          <TimeSeriesCharts data={telemetry} />
        </section>

        <section className="grid-section insights-section">
          <InsightsPanel data={telemetry} />
        </section>

        <section className="grid-section full-width">
          <DataTable data={telemetry} />
        </section>

        <div className="pagination">
  <button
    onClick={() => setPage(p => Math.max(p - 1, 1))}
    disabled={page === 1}
  >
    Prev
  </button>

  <span>
    Page {page} of {pagination?.totalPages || 1}
  </span>

  <button
    onClick={() =>
      setPage(p =>
        pagination && p < pagination.totalPages ? p + 1 : p
      )
    }
    disabled={page === pagination?.totalPages}
  >
    Next
  </button>
</div>

      </main>
    </div>
  );
}

export default App;