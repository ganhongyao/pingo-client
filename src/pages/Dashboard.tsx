import useGeoLocation from "../hooks/useGeoLocation";
import ReactMapGL, { Marker } from "react-map-gl";
import { useEffect, useState } from "react";
import { Viewport } from "../types/viewport";
import {
  DEFAULT_MAP_CENTER,
  LOCATION_UPDATE_TIME_INTERVAL,
  MAPBOX_STYLE,
} from "../util/constants";
import { useSocket } from "../hooks/useSocket";
import { useSnackbar } from "notistack";
import { Grid, IconButton, Typography } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import { ClientSocket } from "../types/clientSocket";

function Dashboard() {
  const location = useGeoLocation();
  const socket = useSocket();
  const { enqueueSnackbar } = useSnackbar();

  const [lastUpdated, setLastUpdated] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<ClientSocket[]>([]);
  const [viewport, setViewport] = useState<Viewport>({
    ...DEFAULT_MAP_CENTER,
    width: "75vw",
    height: "75vh",
    zoom: 12,
  });

  const isUpdateDue = (lastUpdated: number): boolean => {
    // Socket not available yet, unable to update anyway
    if (!socket) {
      return false;
    }

    const now = Date.now();
    const timeElapsed = now - lastUpdated;
    return timeElapsed > LOCATION_UPDATE_TIME_INTERVAL;
  };

  // Get the current location of the user
  useEffect(() => {
    if (location) {
      setViewport((prevViewport) => ({
        ...prevViewport,
        latitude: location.latitude,
        longitude: location.longitude,
      }));

      if (isUpdateDue(lastUpdated)) {
        socket?.emit("location update", location);
        socket?.emit("query friend locations");

        setLastUpdated(Date.now());
      }
    }
  }, [socket, location]);

  // Listen for friend connections
  useEffect(() => {
    socket?.on("friend locations", (data) => {
      setOnlineUsers(data);
    });

    socket?.on("friend connection", () => {
      enqueueSnackbar("Friend is online!", { variant: "success" });
      socket?.emit("query friend locations");
    });

    socket?.on("friend location update", (location) => {
      console.log("Friend updated location");
    });

    return () => {
      socket?.off("friend connection");
      socket?.off("friend locations");
      socket?.off("friend location update");
    };
  }, [socket]);

  if (!location) {
    return <div>Location not enabled.</div>;
  }

  console.log(onlineUsers);

  return (
    <>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle={MAPBOX_STYLE}
        onViewportChange={setViewport}
      >
        {onlineUsers.map((user, index) => {
          return user.location &&
            user.location.latitude &&
            user.location.longitude ? (
            <Marker
              key={index}
              latitude={user.location.latitude}
              longitude={user.location.longitude}
            >
              <IconButton
                color={user.socketId === socket?.id ? "default" : "info"}
              >
                <FaceIcon />
              </IconButton>
            </Marker>
          ) : null;
        })}
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
