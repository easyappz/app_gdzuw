const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const apiRoutes = require('./apiRoutes');

// Initialize express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api', apiRoutes);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/calculator_db';

const mongoDb = mongoose.createConnection(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoDb
  .asPromise()
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Store mongoDb connection in global scope for reuse
global.mongoDb = mongoDb;

// Define a schema for storing calculation history
const CalculationSchema = new mongoose.Schema({
  operation: { type: String, required: true },
  firstNumber: { type: Number, required: true },
  secondNumber: { type: Number, required: true },
  result: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Create a model for calculation history
const CalculationModel = mongoDb.model('Calculation', CalculationSchema);

global.CalculationModel = CalculationModel;

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
