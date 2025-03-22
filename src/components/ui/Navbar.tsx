// app/components/Navbar.tsx
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { ButtonAppBarProps } from '@/interfaces/common';
import { DynamicButton } from '@/components/ui';

// Tipado para las rutas
interface RouteConfig {
  path: string;
  text: string;
  url: string;
}

export function Navbar({
  icon: Icon,
  title,
  routes = [],
  defaultButtonText = "Home",
  defaultButtonUrl = "/",
}: ButtonAppBarProps & {
  routes?: RouteConfig[];
  defaultButtonText?: string;
  defaultButtonUrl?: string;
}) {
  return (
    <Box sx={{ flexGrow: 1, marginBottom: '10px' }}>
      <AppBar position="static" sx={{ py: 1.5 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Icon sx={{ fontSize: { xs: '30px', sm: '40px' } }} />
          </IconButton>
          <Typography
            variant="h4"
            component="div"
            sx={{ flexGrow: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}
          >
            {title}
          </Typography>
          <DynamicButton
            routes={routes}
            defaultButtonText={defaultButtonText}
            defaultButtonUrl={defaultButtonUrl}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}