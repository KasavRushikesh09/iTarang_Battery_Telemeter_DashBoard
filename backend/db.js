const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/batteryTelemetry1';

async function connectDB() {
  const uri = process.env.MONGO_URI || DEFAULT_URI;

  mongoose.set('strictQuery', false);

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
}

module.exports = connectDB;

