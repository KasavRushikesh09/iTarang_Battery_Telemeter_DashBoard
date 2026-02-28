const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Telemetry = require('./models/Telemetry'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
async function loadTelemetryData() {
  return Telemetry.find().sort({ time: 1 }).lean();
}

app.get('/api/telemetry', async (req, res) => {
  try {
    // 1️⃣ get page & limit from URL
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;

    // 2️⃣ calculate how many records to skip
    const skip = (page - 1) * limit;

    // 3️⃣ fetch only required records
    const data = await Telemetry
      .find()
      .sort({ time: -1 })   // latest first
      .skip(skip)
      .limit(limit);

    // 4️⃣ get total count
    const total = await Telemetry.countDocuments();

    // 5️⃣ send response
    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load telemetry' });
  }
});

app.get('/api/telemetry/latest', async (req, res) => {
  try {
    const latest = await Telemetry.findOne().sort({ time: -1 }).lean();
    if (!latest) return res.status(404).json({ error: 'No data' });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load latest' });
  }
});

app.get('/api/telemetry/insights', async (req, res) => {
  try {
    const data = await loadTelemetryData();
    if (!data.length) {
      return res.json({ average_soc: null, peak_voltage: null, time_spent: { charging: 0, discharging: 0, idle: 0 } });
    }

    const average_soc = data.reduce((sum, d) => sum + (d.soc ?? 0), 0) / data.length;
    const peak_voltage = Math.max(...data.map(d => d.battery_voltage ?? 0));

    let charging = 0;
    let discharging = 0;
    let idle = 0;

    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1];
      const curr = data[i];
      const deltaMs = curr.time - prev.time;

      if (prev.current > 0) {
        charging += deltaMs;
      } 
      else if (prev.current < 0) {
        discharging += deltaMs;
      }
      else {
        idle += deltaMs;
      }
    }

    res.json({
      average_soc: Math.round(average_soc * 10) / 10,
      peak_voltage,
      time_spent: { charging, discharging, idle }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute insights' });
  }
});

// Start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Battery telemetry API running on http://localhost:${PORT}`);
    });
  })
  .catch(() => process.exit(1));