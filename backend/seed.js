const fs = require('fs');
const path = require('path');
const connectDB = require('./db');
const Telemetry = require('./models/Telemetry');
require('dotenv').config();

async function seed() {
  try {
    console.log("Starting seed...");
    await connectDB();

    const dataPath = path.join(__dirname, 'data', 'battery_telemetry.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      throw new Error('Telemetry JSON must be an array');
    }

    await Telemetry.deleteMany({});
    await Telemetry.insertMany(data);

    console.log(`Seeded ${data.length} telemetry records into MongoDB.`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

