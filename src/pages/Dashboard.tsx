import useGeoLocation from "../hooks/useGeoLocation";
import ReactMapGL, { Marker } from "react-map-gl";
import { useEffect, useState } from "react";
import { Viewport } from "../types/viewport";
import { GeoLocation } from "../types/geolocation";
import {
  DEFAULT_MAP_CENTER,
  LOCATION_UPDATE_TIME_INTERVAL,
  MAPBOX_STYLE,
} from "../util/constants";
import { useSocket } from "../hooks/useSocket";
import { useSnackbar } from "notistack";
import { Grid, IconButton, Typography } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";

// TODO: Find better way to handle this
let lastUpdated: number = 0;

function Dashboard() {
  const location = useGeoLocation();
  const socket = useSocket();
  const { enqueueSnackbar } = useSnackbar();
  const [viewport, setViewport] = useState<Viewport>({
    ...DEFAULT_MAP_CENTER,
    width: "75vw",
    height: "75vh",
    zoom: 12,
  });

  const updateLocationOnServer = () => {
    const now = Date.now();
    const timeElapsed = now - lastUpdated;
    if (timeElapsed > LOCATION_UPDATE_TIME_INTERVAL) {
      socket?.emit("location update", location);
      lastUpdated = now;
    }
    return;
  };

  useEffect(() => {
    socket?.emit("location update", location);
    socket?.emit("query friend locations");
  }, [socket]);

  // Get the current location of the user
  useEffect(() => {
    if (location) {
      setViewport((prevViewport) => ({
        ...prevViewport,
        latitude: location.latitude,
        longitude: location.longitude,
      }));

      updateLocationOnServer();
    }
  }, [location]);

  // Listen for friend connections
  useEffect(() => {
    socket?.on("friend locations", (data) => {
      console.log(data);
    });

    socket?.on("friend connection", () => {
      enqueueSnackbar("Friend is online!", { variant: "success" });
    });
    socket?.on("friend location update", (location) => {
      console.log("Friend updated location" + location);
    });

    return () => {
      socket?.off("friend connection");
      socket?.off("friend locations");
      socket?.off("friend location update");
    };
  });

  if (!location) {
    return <div>Location not enabled.</div>;
  }

  // TODO: Add friends' markers here as well
  const markers: GeoLocation[] = [location];

  return (
    <>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle={MAPBOX_STYLE}
        onViewportChange={setViewport}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            latitude={marker.latitude}
            longitude={marker.longitude}
          >
            <IconButton color="default">
              <FaceIcon />
            </IconButton>
          </Marker>
        ))}
      </ReactMapGL>

      {/* Legend */}
      <Grid container direction="row" spacing={1}>
        <Grid item>
          <FaceIcon color="action" />
        </Grid>
        <Grid item>
          <Typography>You</Typography>
        </Grid>
        <Grid item>
          <FaceIcon color="info" />
        </Grid>
        <Grid item>
          <Typography>Friend</Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
