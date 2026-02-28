const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema(
  {
    time: { type: Number, required: true, index: true },
    soc: { type: Number },
    soh: { type: Number },
    battery_voltage: { type: Number },
    current: { type: Number },
    charge_cycle: { type: Number },
    battery_temp: { type: Number, default: null }
  },
  {
    collection: 'telemetry',
    timestamps: false
  }
);

module.exports = mongoose.model('Telemetry', telemetrySchema);

