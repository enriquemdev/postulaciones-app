import { Box, Paper } from '@mui/material';
import * as React from 'react';

export const PageCard = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Box
      sx={{
        mx: 'auto',
      }}
    >
      <Paper
        sx={{
          overflow: 'hidden',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          borderRadius: '0.6rem',
          p: {
            xs: 1,
            sm: 3
          }
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};