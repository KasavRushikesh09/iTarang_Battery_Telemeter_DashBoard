import React from 'react';

function formatValue(value, unit, fallback = 'N/A') {
  if (value === null || value === undefined) return fallback;
  return `${value}${unit ? ` ${unit}` : ''}`;
}

function StatusCards({ latest }) {
  if (!latest) {
    return <p>No telemetry data available.</p>;
  }

  const { soc, soh, battery_voltage, current, battery_temp, charge_cycle } =
    latest;

  const socCritical = soc !== null && soc !== undefined && soc < 20;
  const tempCritical =
    battery_temp !== null && battery_temp !== undefined && battery_temp > 45;

  return (
    <div className="status-cards">
      <div className={`card ${socCritical ? 'card-warning' : ''}`}>
        <div className="card-label">State of Charge</div>
        <div className="card-value">{formatValue(soc, '%')}</div>
        {socCritical && <div className="card-badge">Low SoC</div>}
      </div>

      <div className="card">
        <div className="card-label">State of Health</div>
        <div className="card-value">{formatValue(soh, '%')}</div>
      </div>

      <div className="card">
        <div className="card-label">Battery Voltage</div>
        <div className="card-value">{formatValue(battery_voltage, 'V')}</div>
      </div>

      <div className="card">
        <div className="card-label">Current</div>
        <div className="card-value">{formatValue(current, 'A')}</div>
        <div className="card-sub">
          {current > 0 && 'Discharging'}
          {current < 0 && 'Charging'}
          {current === 0 && 'Idle'}
        </div>
      </div>

      <div className={`card ${tempCritical ? 'card-warning' : ''}`}>
        <div className="card-label">Battery Temperature</div>
        <div className="card-value">
          {battery_temp === null || battery_temp === undefined
            ? 'Sensor offline'
            : `${battery_temp} °C`}
        </div>
        {tempCritical && <div className="card-badge">High Temp</div>}
      </div>

      <div className="card">
        <div className="card-label">Charge Cycles</div>
        <div className="card-value">{formatValue(charge_cycle, '')}</div>
      </div>
    </div>
  );
}

export default StatusCards;

