import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div>
      <Typography variant="h1">Pingo</Typography>
      <Button component={Link} to="/dashboard">
        Login
      </Button>
    </div>
  );
}

export default Landing;
