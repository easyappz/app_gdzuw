import React, { useState } from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import CalculatorDisplay from './CalculatorDisplay';
import { styled } from '@mui/material/styles';

const CalculatorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: 'auto',
  maxWidth: 400,
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
}));

const ButtonStyled = styled(Button)(({ theme, operation, equals }) => ({
  height: 60,
  fontSize: '1.2rem',
  backgroundColor: equals 
    ? theme.palette.primary.main 
    : operation 
      ? theme.palette.secondary.main 
      : theme.palette.grey[300],
  color: equals 
    ? theme.palette.common.white 
    : operation 
      ? theme.palette.common.white 
      : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: equals 
      ? theme.palette.primary.dark 
      : operation 
        ? theme.palette.secondary.dark 
        : theme.palette.grey[400],
  },
}));

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForSecondValue, setWaitingForSecondValue] = useState(false);

  const handleNumberClick = (value) => {
    if (display === '0' && value === '0') return;
    if (display === '0' && value !== '.') {
      setDisplay(value);
    } else {
      if (value === '.' && display.includes('.')) return;
      setDisplay(display + value);
    }
    if (waitingForSecondValue) {
      setWaitingForSecondValue(false);
    }
  };

  const handleOperationClick = (op) => {
    setPreviousValue(parseFloat(display));
    setOperation(op);
    setWaitingForSecondValue(true);
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForSecondValue(false);
  };

  const handleEquals = () => {
    if (!previousValue || !operation) return;

    const currentValue = parseFloat(display);
    let result = 0;

    if (operation === '+') {
      result = previousValue + currentValue;
    } else if (operation === '-') {
      result = previousValue - currentValue;
    } else if (operation === '*') {
      result = previousValue * currentValue;
    } else if (operation === '/') {
      if (currentValue === 0) {
        setDisplay('Error');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForSecondValue(false);
        return;
      }
      result = previousValue / currentValue;
    }

    setDisplay(result.toString());
    setPreviousValue(null);
    setOperation(null);
    setWaitingForSecondValue(false);
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', 'C', '+',
    '='
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <CalculatorContainer elevation={3}>
        <Typography variant="h6" align="center" gutterBottom>
          Calculator
        </Typography>
        <CalculatorDisplay value={display} />
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {buttons.map((btn) => (
            <Grid item xs={3} key={btn}>
              {btn === 'C' ? (
                <ButtonStyled
                  fullWidth
                  variant="contained"
                  onClick={handleClear}
                  operation="true"
                >
                  {btn}
                </ButtonStyled>
              ) : btn === '=' ? (
                <ButtonStyled
                  fullWidth
                  variant="contained"
                  onClick={handleEquals}
                  equals="true"
                  sx={{ gridColumn: 'span 4' }}
                >
                  {btn}
                </ButtonStyled>
              ) : ['+', '-', '*', '/'].includes(btn) ? (
                <ButtonStyled
                  fullWidth
                  variant="contained"
                  onClick={() => handleOperationClick(btn)}
                  operation="true"
                >
                  {btn}
                </ButtonStyled>
              ) : (
                <ButtonStyled
                  fullWidth
                  variant="contained"
                  onClick={() => handleNumberClick(btn)}
                >
                  {btn}
                </ButtonStyled>
              )}
            </Grid>
          ))}
        </Grid>
      </CalculatorContainer>
    </Box>
  );
};

export default Calculator;
