import { Chip } from '@mui/material';
// import type { ChipProps } from '@mui/material';

type PaletteColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

interface CustomBadgeProps {
  color: PaletteColor | string;
  text: string;
}

function isPaletteColor(color: string): color is PaletteColor {
  return (['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const).includes(
    color as PaletteColor
  );
}

export function CustomBadge({ color, text }: CustomBadgeProps) {
  return (
    <Chip
      label={text}
      sx={(theme) => ({
        display: 'inline-flex',
        alignItems: 'center',
        minWidth: 75,
        width: 75,
        justifyContent: 'center',
        px: 2.5,
        py: 0.5,
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 500,
        backgroundColor: isPaletteColor(color)
          ? theme.palette[color].main
          : color,
        color: 'white',
        '& .MuiChip-label': {
          px: 0,
          py: 0.25,
          overflow: 'visible', // FOr large texts
        },
      })}
    />
  );
}