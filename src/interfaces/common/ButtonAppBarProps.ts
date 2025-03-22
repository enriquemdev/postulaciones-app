import { SvgIconComponent } from "@mui/icons-material";

// Tipado para las rutas
interface RouteConfig {
  path: string;
  text: string;
  url: string;
}

export interface ButtonAppBarProps {
  icon: SvgIconComponent;
  title: string;
  routes?: RouteConfig[];
  defaultButtonText?: string;
  defaultButtonUrl?: string;
}
