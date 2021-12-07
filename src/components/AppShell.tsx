import { CssBaseline, AppBar, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import { ReactNode } from "react";
import { Routes, Route } from "react-router";
import Chats from "../pages/Chats";
import Dashboard from "../pages/Dashboard";
import AppDrawer from "./AppDrawer";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "center",
  },
}));

interface OwnProps {
  children?: ReactNode;
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
        <Routes>
          <Route element={<Dashboard />} path="dashboard" />
          <Route element={<Chats />} path="chats/" />
          <Route element={<Chats />} path="chats/:chatId" />
        </Routes>
      </Box>
    </Box>
  );
}
