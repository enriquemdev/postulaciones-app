"use client";

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Button from '@mui/material/Button';

interface RouteConfig {
  path: string;
  text: string;
  url: string;
}

export function DynamicButton({
  routes = [],
  defaultButtonText = "Home",
  defaultButtonUrl = "/",
}: {
  routes?: RouteConfig[];
  defaultButtonText?: string;
  defaultButtonUrl?: string;
}) {
  const currentPath = usePathname(); // Obtiene la ruta actual en el cliente

  const matchedRoute = routes.find((route) => route.path === currentPath) || {
    text: defaultButtonText,
    url: defaultButtonUrl,
  };

  return (
    <Button
      color="inherit"
      href={matchedRoute.url}
      sx={{ fontSize: { xs: '0.8rem', sm: '0.95rem' }, textAlign: 'center' }}
    >
      {matchedRoute.text}
    </Button>
  );
}