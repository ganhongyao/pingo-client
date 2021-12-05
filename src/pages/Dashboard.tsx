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
import { Button, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import { PingIncoming, User } from "../types/user";
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
  EVENT_PING,
} from "../service/events";
import { makeStyles } from "@mui/styles";
import PingSendDialog from "../components/PingSendDialog";
import PingReceiveDialog from "../components/PingReceiveDialog";
import { Nullable } from "../types/nullable";

const useStyles = makeStyles((theme) => ({
  otherUser: {
    color: "#0288d1",
  },

  self: {
    color: "grey",
  },
}));

function Dashboard() {
  const classes = useStyles();
  const location = useGeoLocation();
  const socket = useSocket();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [name, setName] = useState("");
  const [lastUpdated, setLastUpdated] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<Nullable<User>>(null);
  const [openPing, setOpenPing] = useState<Nullable<PingIncoming>>(null);
  const [pingSendDialogIsOpen, setPingSendDialogIsOpen] = useState(false);
  const [pingReceiveDialogIsOpen, setPingReceiveDialogIsOpen] = useState(false);
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

  const handleOpenPing = (ping: PingIncoming) => {
    setOpenPing(ping);
    setPingReceiveDialogIsOpen(true);
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
        // Moves self to front so that legend displays self first before other users
        const self = data.filter((user: User) => user.socketId === socket.id);
        const otherUsers = data.filter(
          (user: User) => user.socketId !== socket.id
        );
        const allUsers = [...self, ...otherUsers];
        setOnlineUsers(allUsers);
      });

      socket?.on(EVENT_PING, (incomingPing: PingIncoming) => {
        const { sender } = incomingPing;
        enqueueSnackbar(`${sender.name} pinged you`, {
          variant: "info",
          action: (key) => (
            <Button
              className={classes.otherUser}
              onClick={() => handleOpenPing(incomingPing)}
            >
              Respond
            </Button>
          ),
        });
      });

      socket?.on(EVENT_FRIEND_CONNECTION, (name: string) => {
        const snackbarKey = enqueueSnackbar(`${name} is online!`, {
          variant: "success",
          onClick: () => closeSnackbar(snackbarKey),
        });
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

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <>
      {/* Dialogs */}
      <NamePrompt handleUpdateName={setName} />
      <PingSendDialog
        isOpen={pingSendDialogIsOpen}
        setIsOpen={setPingSendDialogIsOpen}
        socket={socket}
        receiver={selectedUser}
      />
      <PingReceiveDialog
        isOpen={pingReceiveDialogIsOpen}
        setIsOpen={setPingReceiveDialogIsOpen}
        incomingPing={openPing}
      />

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
                  onClick={() => {
                    handleSelectUser(user);
                  }}
                >
                  <FaceIcon />
                  <Typography>
                    {user.socketId === socket?.id ? "You" : user.name}
                  </Typography>
                </IconButton>
              </Marker>
            )
          );
        })}

        {/* Popup for selected user */}
        {selectedUser && (
          <Popup
            latitude={selectedUser.location.latitude}
            longitude={selectedUser.location.longitude}
            offsetLeft={20}
            onClose={() => setSelectedUser(null)}
          >
            <Grid container direction="column" alignItems="center">
              <Grid item>
                <Typography variant="h6">
                  {selectedUser.socketId === socket?.id
                    ? "You"
                    : selectedUser.name}
                </Typography>
              </Grid>
              <Grid item>
                {selectedUser.socketId !== socket?.id && (
                  <Tooltip title={`Ping ${selectedUser.name}`}>
                    <IconButton
                      size="small"
                      onClick={() => setPingSendDialogIsOpen(true)}
                    >
                      <EmojiPeopleIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid>
            </Grid>
          </Popup>
        )}
      </ReactMapGL>

      {/* Legend */}
      <Typography variant="h6">Online Users: </Typography>
      <Grid container direction="row" spacing={1}>
        {onlineUsers.map((user, index) => (
          <Grid
            key={index}
            container
            item
            direction="row"
            alignContent="center"
            xs={3}
            md={2}
          >
            <Button onClick={() => handleSelectUser(user)}>
              <Grid item>
                <FaceIcon
                  className={
                    user.socketId === socket?.id
                      ? classes.self
                      : classes.otherUser
                  }
                />
              </Grid>
              <Grid
                item
                className={
                  user.socketId === socket?.id
                    ? classes.self
                    : classes.otherUser
                }
              >
                {user.socketId === socket?.id ? "You" : user.name}
              </Grid>
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Dashboard;
