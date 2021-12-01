import { Typography } from "@mui/material";
import useGeoLocation from "../hooks/useGeoLocation";

function Dashboard() {
  const location = useGeoLocation();

  if (!location) {
    return <div>Location not enabled.</div>;
  }

  return (
    <>
      <Typography paragraph>Latitude: {location.latitude}</Typography>
      <Typography paragraph>Longitude: {location.longitude}</Typography>
    </>
  );
}

export default Dashboard;
