import { AppBar, Box, CssBaseline, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AppDrawer from "../components/AppDrawer";
import useGeoLocation from "../hooks/useGeoLocation";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "center",
  },
}));

function Dashboard() {
  const classes = useStyles();
  const location = useGeoLocation();

  if (!location) {
    return <div>Location not enabled.</div>;
  }

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
        <Typography paragraph>Latitude: {location.latitude}</Typography>
        <Typography paragraph>Longitude: {location.longitude}</Typography>
      </Box>
    </Box>
  );
}

export default Dashboard;
