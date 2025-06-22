import React from 'react';
import { Box, Typography } from '@mui/material';

const Patients: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Patients
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Patient management page - Coming soon
      </Typography>
    </Box>
  );
};

export default Patients;