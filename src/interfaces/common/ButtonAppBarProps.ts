import { SvgIconComponent } from "@mui/icons-material";

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
