import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { ButtonAppBarProps } from '@/interfaces/common';

export function Navbar({
  icon: Icon,
  title,
  buttonText,
}: ButtonAppBarProps) {
  return (
    <Box sx={{ flexGrow: 1, marginBottom: '10px' }}>
      <AppBar position="static" sx={{ py:1.5 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Icon sx={{ fontSize: { xs: '30px', sm: '40px' } }} /> {/* Icono responsivo */}
          </IconButton>
          <Typography
            variant="h4"
            component="div"
            sx={{ flexGrow: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }} // Titulo responsivo
          >
            {title}
          </Typography>
          <Button
            color="inherit"
            component="a"
            sx={{ fontSize: { xs: '0.8rem', sm: '0.95rem' }, textAlign: 'center' }} // Boton responsivo
          >
            {buttonText}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}