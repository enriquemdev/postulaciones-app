import Typography from "@mui/material/Typography";

export const Titles = ({
  title = "Titulo de la página",
  subtitle = "",
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <>
      <Typography variant="h6">{title}</Typography>
      <p className="text-gray-500 mb-5">{subtitle}</p>
    </>
  );
};
