import { Box, useTheme } from "@mui/material";
import DesignPage from "./Designpage";

function Template() {
  const theme = useTheme();
  return (
    <Box
      sx={{ bgcolor: theme.palette.background.backgroundColor }}
    >
      <DesignPage />
    </Box>

  );
}

export default Template;
