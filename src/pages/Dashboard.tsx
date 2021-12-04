import useGeoLocation from "../hooks/useGeoLocation";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
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
import { User } from "../types/user";
import NamePrompt from "../components/NamePrompt";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import {
  queryFriendsLocations,
  updateLocation,
  updateName,
} from "../service/operations";
import {
  EVENT_FRIEND_CONNECTION,
  EVENT_FRIEND_DISCONNECTION,
  EVENT_FRIEND_LOCATIONS,
  EVENT_FRIEND_LOCATION_UPDATE,
} from "../service/events";

function Dashboard() {
  const location = useGeoLocation();
  const socket = useSocket();
  const { enqueueSnackbar } = useSnackbar();

  const [name, setName] = useState("");
  const [lastUpdated, setLastUpdated] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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

  // Update name on server
  useEffect(() => {
    if (name) {
      updateName(socket, name);
    }
  }, [name]);

  // Update user location on map and on server
  useEffect(() => {
    if (location && name) {
      setViewport((prevViewport) => ({
        ...prevViewport,
        latitude: location.latitude,
        longitude: location.longitude,
      }));

      if (isUpdateDue(lastUpdated)) {
        updateLocation(socket, location);
        queryFriendsLocations(socket);

        setLastUpdated(Date.now());
      }
    }
  }, [socket, location, name]);

  // Listen for friend activity
  useEffect(() => {
    // Only allow access to friends' locations when name is set
    if (name) {
      socket?.on(EVENT_FRIEND_LOCATIONS, (data) => {
        setOnlineUsers(data);
      });

      socket?.on(EVENT_FRIEND_CONNECTION, (name: string) => {
        enqueueSnackbar(`${name} is online!`, { variant: "success" });
        queryFriendsLocations(socket);
      });

      socket?.on(EVENT_FRIEND_DISCONNECTION, () => {
        queryFriendsLocations(socket);
        if (selectedUser && !onlineUsers.includes(selectedUser)) {
          // Selected user has disconnected
          console.log("Selected user disconnected");
          setSelectedUser(null);
        }
      });

      socket?.on(EVENT_FRIEND_LOCATION_UPDATE, (location) => {
        queryFriendsLocations(socket);
      });
    }

    return () => {
      socket?.removeAllListeners();
    };
  }, [socket, name]);

  if (!location) {
    return <div>Location not enabled.</div>;
  }

  return (
    <>
      <NamePrompt handleUpdateName={setName} />
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle={MAPBOX_STYLE}
        onViewportChange={setViewport}
      >
        {/* Markers */}
        {onlineUsers.map((user, index) => {
          return (
            user.location &&
            user.location.latitude &&
            user.location.longitude && (
              <Marker
                key={index}
                latitude={user.location.latitude}
                longitude={user.location.longitude}
              >
                <IconButton
                  color={user.socketId === socket?.id ? "default" : "info"}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedUser(user);
                  }}
                >
                  <FaceIcon />
                </IconButton>
              </Marker>
            )
          );
        })}

        {selectedUser && (
          <Popup
            latitude={selectedUser.location.latitude}
            longitude={selectedUser.location.longitude}
            offsetLeft={20}
            onClose={() => {
              setSelectedUser(null);
            }}
          >
            <Grid container direction="column">
              <Typography variant="h6">
                {selectedUser.socketId === socket?.id
                  ? "You are here"
                  : selectedUser.name}
              </Typography>
              {selectedUser.socketId !== socket?.id && (
                <IconButton size="small">
                  <EmojiPeopleIcon />
                </IconButton>
              )}
            </Grid>
          </Popup>
        )}
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
