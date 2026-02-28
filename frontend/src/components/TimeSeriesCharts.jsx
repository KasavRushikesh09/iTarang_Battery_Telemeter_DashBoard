import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

function formatTimeShort(ms) {
  if (!ms) return '';
  return new Date(ms).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}


function TimeSeriesCharts({ data }) {
  if (!data || !data.length) {
    return <p>No data to display.</p>;
  }

  const tempData = data.filter(
    (d) => d.battery_temp !== null && d.battery_temp !== undefined
  );

  return (
    <div className="charts-container">
      <h2>Trends over time</h2>

      <div className="chart-wrapper">
        <h3>State of Charge (%)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tickFormatter={formatTimeShort} />
            <YAxis domain={[0, 100]} />
            <Tooltip
              labelFormatter={(label) =>
                new Date(label).toLocaleString('en-IN')
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="soc"
              name="SoC"
              stroke="#00b894"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-wrapper two-column">
        <div>
          <h3>Voltage (V)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tickFormatter={formatTimeShort} />
              <YAxis />
              <Tooltip
                labelFormatter={(label) =>
                  new Date(label).toLocaleString('en-IN')
                }
              />
              <Line
                type="monotone"
                dataKey="battery_voltage"
                name="Voltage"
                stroke="#0984e3"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3>Current (A)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tickFormatter={formatTimeShort} />
              <YAxis />
              <Tooltip
                labelFormatter={(label) =>
                  new Date(label).toLocaleString('en-IN')
                }
              />
              <Line
                type="monotone"
                dataKey="current"
                name="Current"
                stroke="#d63031"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-wrapper">
        <h3>Temperature (°C)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={tempData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tickFormatter={formatTimeShort} />
            <YAxis />
            <Tooltip
              labelFormatter={(label) =>
                new Date(label).toLocaleString('en-IN')
              }
            />
            <Line
              type="monotone"
              dataKey="battery_temp"
              name="Temperature"
              stroke="#e17055"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="chart-note">
          Null temperature readings are shown as missing points (sensor offline).
        </p>
      </div>
    </div>
  );
}

export default TimeSeriesCharts;

