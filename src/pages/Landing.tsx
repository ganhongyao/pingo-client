import { Button, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: "10%",
  },
}));

function Landing() {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      className={classes.container}
    >
      <Typography variant="h1">Pingo</Typography>
      <Button component={Link} to="/dashboard">
        Login
      </Button>
    </Grid>
  );
}

export default Landing;
