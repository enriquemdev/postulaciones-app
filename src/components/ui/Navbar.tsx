import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { ButtonAppBarProps } from '@/interfaces/applications';
import Link from 'next/link';

export function Navbar({
  icon: Icon,
  title,
  buttonText,
  buttonLink,
}: ButtonAppBarProps) {
  return (
    <Box sx={{ flexGrow: 1, marginBottom: '10px' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Icon sx={{ fontSize: '50px' }} />
          </IconButton>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {/* <Link href={buttonLink} passHref> */}
            <Button color="inherit" component="a">
              {buttonText}
            </Button>
          {/* </Link> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}