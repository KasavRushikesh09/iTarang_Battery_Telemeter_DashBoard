import React from 'react';

function formatValue(value, unit, fallback = 'N/A') {
  if (value === null || value === undefined) return fallback;
  return `${value}${unit ? ` ${unit}` : ''}`;
}

function BatterySVG({ soc }) {
  const percent = Math.max(0, Math.min(100, soc || 0));
  const fillWidth = percent * 0.72; // 72px max fill
  const isCritical = soc !== null && soc !== undefined && soc < 20;
  const fillColor = isCritical ? '#ef4444' : '#22c55e';

  return (
    <svg width="130" height="68" viewBox="0 0 130 68" className="battery-svg">
      {/* Outer body - 3D metallic look */}
      <rect
        x="8"
        y="10"
        width="88"
        height="48"
        rx="10"
        fill="#1e2937"
        stroke="#64748b"
        strokeWidth="6"
      />
      {/* Inner body */}
      <rect
        x="12"
        y="14"
        width="80"
        height="40"
        rx="6"
        fill="#334155"
      />

      {/* Battery tip */}
      <rect
        x="96"
        y="22"
        width="12"
        height="24"
        rx="3"
        fill="#64748b"
      />

      {/* Fill with bouncy animation */}
      <rect
        x="16"
        y="18"
        width={fillWidth}
        height="32"
        rx="4"
        fill={fillColor}
        className="battery-fill"
      />

      {/* Shine layer */}
      <rect
        x="16"
        y="18"
        width={fillWidth}
        height="10"
        rx="4"
        fill="#ffffff"
        opacity="0.25"
      />

      {/* Percentage text */}
      <text
        x="52"
        y="44"
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="18"
        fontWeight="800"
        letterSpacing="-0.5px"
      >
        {soc ?? '—'}%
      </text>
    </svg>
  );
}

function StatusCards({ latest }) {
  if (!latest) {
    return <p>No telemetry data available.</p>;
  }

  const { soc, soh, battery_voltage, current, battery_temp, charge_cycle } = latest;

  const socCritical = soc !== null && soc !== undefined && soc < 20;
  const tempCritical = battery_temp !== null && battery_temp !== undefined && battery_temp > 45;

  return (
    <div className="status-cards">
      <div className={`card ${socCritical ? 'card-warning' : ''}`}>
        <div className="card-label">State of Charge</div>
        <BatterySVG soc={soc} />
        {socCritical && <div className="card-badge">LOW SOC ⚠️</div>}
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
        {tempCritical && <div className="card-badge">HIGH TEMP 🔥</div>}
      </div>

      <div className="card">
        <div className="card-label">Charge Cycles</div>
        <div className="card-value">{formatValue(charge_cycle, '')}</div>
      </div>
    </div>
  );
}

export default StatusCards;