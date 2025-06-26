import React from 'react';
import { TextField, styled } from '@mui/material';

const DisplayField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    textAlign: 'right',
    fontSize: '2rem',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
  },
}));

const CalculatorDisplay = ({ value }) => {
  return (
    <DisplayField
      fullWidth
      variant="outlined"
      value={value}
      disabled
      InputProps={{
        readOnly: true,
      }}
    />
  );
};

export default CalculatorDisplay;
