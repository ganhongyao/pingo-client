import { CssBaseline, AppBar, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import { ReactNode } from "react";
import AppDrawer from "./AppDrawer";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "center",
  },
}));

interface OwnProps {
  children: ReactNode;
}

export default function AppShell({ children }: OwnProps) {
  const classes = useStyles();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar className={classes.header}>
          <Typography variant="h6" noWrap component="div" align="right">
            Pingo
          </Typography>
        </Toolbar>
      </AppBar>
      <AppDrawer />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        {children ?? {}}
      </Box>
    </Box>
  );
}
