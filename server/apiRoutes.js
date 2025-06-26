const express = require('express');
const router = express.Router();

// Access the MongoDB model for calculations
const CalculationModel = global.CalculationModel;

// GET /api/hello
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

// GET /api/status
router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// POST /api/calculate
router.post('/calculate', async (req, res) => {
  try {
    const { firstNumber, secondNumber, operation } = req.body;

    // Validate input data
    if (firstNumber === undefined || secondNumber === undefined || !operation) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (typeof firstNumber !== 'number' || typeof secondNumber !== 'number') {
      return res.status(400).json({ error: 'Numbers must be numeric values' });
    }

    if (['add', 'subtract', 'multiply', 'divide'].indexOf(operation) === -1) {
      return res.status(400).json({ error: 'Invalid operation' });
    }

    let result;
    let operationSymbol;

    // Perform the calculation based on operation
    if (operation === 'add') {
      result = firstNumber + secondNumber;
      operationSymbol = '+';
    } else if (operation === 'subtract') {
      result = firstNumber - secondNumber;
      operationSymbol = '-';
    } else if (operation === 'multiply') {
      result = firstNumber * secondNumber;
      operationSymbol = '*';
    } else if (operation === 'divide') {
      if (secondNumber === 0) {
        return res.status(400).json({ error: 'Division by zero is not allowed' });
      }
      result = firstNumber / secondNumber;
      operationSymbol = '/';
    }

    // Save the calculation to MongoDB
    const calculation = new CalculationModel({
      operation: operationSymbol,
      firstNumber,
      secondNumber,
      result
    });

    await calculation.save();

    // Return the result
    res.json({
      success: true,
      operation: operationSymbol,
      result
    });
  } catch (error) {
    console.error('Error processing calculation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/history
router.get('/history', async (req, res) => {
  try {
    // Fetch the last 10 calculations from the database
    const history = await CalculationModel.find()
      .sort({ timestamp: -1 })
      .limit(10);

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Error fetching calculation history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
