import { Typography } from "@mui/material";
import useGeoLocation from "../hooks/useGeoLocation";

function Dashboard() {
  const location = useGeoLocation();
  if (!location) {
    return <div>Location not enabled.</div>;
  }

  return (
    <div>
      <Typography variant="h1">Dashboard</Typography>
      <Typography variant="h3">Latitude: {location.latitude}</Typography>
      <Typography variant="h3">Longitude: {location.longitude}</Typography>
    </div>
  );
}

export default Dashboard;
