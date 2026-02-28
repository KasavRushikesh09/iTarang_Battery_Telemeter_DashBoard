import React, { useMemo } from 'react';

function formatDuration(ms) {
  const minutes = Math.round(ms / 60000);
  if (minutes < 1) return '< 1 min';
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  if (hours === 0) return `${remMinutes} min`;
  return `${hours} h ${remMinutes} min`;
}

function InsightsPanel({ data }) {
  const insights = useMemo(() => {
    if (!data || data.length === 0) return null;

    const socValues = data.map((d) => d.soc).filter((v) => v != null);
    const avgSoC =
      socValues.length > 0
        ? socValues.reduce((sum, v) => sum + v, 0) / socValues.length
        : null;

    const voltages = data
      .map((d) => d.battery_voltage)
      .filter((v) => v != null);
    const peakVoltage = voltages.length ? Math.max(...voltages) : null;

    let chargingMs = 0;
    let dischargingMs = 0;
    let idleMs = 0;

    for (let i = 1; i < data.length; i += 1) {
      const prev = data[i - 1];
      const curr = data[i];
      const dt = curr.time - prev.time;

      if (prev.current < 0) chargingMs += dt;
      else if (prev.current > 0) dischargingMs += dt;
      else idleMs += dt;
    }

    const totalMs = chargingMs + dischargingMs + idleMs || 1;
    const pct = (ms) => Math.round((ms / totalMs) * 100);

    return {
      avgSoC,
      peakVoltage,
      chargingMs,
      dischargingMs,
      idleMs,
      chargingPct: pct(chargingMs),
      dischargingPct: pct(dischargingMs),
      idlePct: pct(idleMs)
    };
  }, [data]);

  if (!insights) return null;

  return (
    <div className="insights-panel">
      <h2>Health & usage insights</h2>
      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-label">Average SoC</div>
          <div className="insight-value">
            {insights.avgSoC != null
              ? `${insights.avgSoC.toFixed(1)} %`
              : 'N/A'}
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-label">Peak voltage</div>
          <div className="insight-value">
            {insights.peakVoltage != null
              ? `${insights.peakVoltage.toFixed(2)} V`
              : 'N/A'}
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-label">Time discharging</div>
          <div className="insight-value">
            {formatDuration(insights.dischargingMs)} ({insights.dischargingPct}
            %)
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-label">Time charging</div>
          <div className="insight-value">
            {formatDuration(insights.chargingMs)} ({insights.chargingPct}
            %)
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-label">Time idle</div>
          <div className="insight-value">
            {formatDuration(insights.idleMs)} ({insights.idlePct}
            %)
          </div>
        </div>
      </div>
      <p className="insights-note">
        Charging is inferred when current &lt; 0, discharging when current &gt; 0,
        idle when current = 0.
      </p>
    </div>
  );
}

export default InsightsPanel;

