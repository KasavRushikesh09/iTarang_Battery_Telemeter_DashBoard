import React, { useMemo, useState } from 'react';

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

const columns = [
  { key: 'time', label: 'Time' },
  { key: 'soc', label: 'SoC (%)' },
  { key: 'soh', label: 'SoH (%)' },
  { key: 'battery_voltage', label: 'Voltage (V)' },
  { key: 'current', label: 'Current (A)' },
  { key: 'battery_temp', label: 'Temp (°C)' },
  { key: 'charge_cycle', label: 'Charge Cycle' }
];

function DataTable({ data }) {
  const [sortKey, setSortKey] = useState('time');
  const [direction, setDirection] = useState('asc');

  const sorted = useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];

      if (va === null || va === undefined) return 1;
      if (vb === null || vb === undefined) return -1;

      if (va < vb) return direction === 'asc' ? -1 : 1;
      if (va > vb) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, sortKey, direction]);

  function handleSort(key) {
    if (sortKey === key) {
      setDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setDirection('asc');
    }
  }

  return (
    <div className="table-container">
      <h2>Raw telemetry data</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} onClick={() => handleSort(col.key)}>
                  {col.label}
                  {sortKey === col.key && (
                    <span className="sort-indicator">
                      {direction === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
              ))}
              
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => (
              <tr key={idx}>
                <td>{formatTimestamp(row.time)}</td>
                <td>{row.soc}</td>
                <td>{row.soh}</td>
                <td>{row.battery_voltage}</td>
                <td>{row.current}</td>
                <td>
                  {row.battery_temp === null || row.battery_temp === undefined
                    ? 'N/A'
                    : row.battery_temp}
                </td>
                <td>{row.charge_cycle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="table-hint">
        Tip: Click column headers to sort by SoC, voltage, temperature, etc.
      </p>
    </div>


  );
}

export default DataTable;

