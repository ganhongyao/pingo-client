import useGeoLocation from "../hooks/useGeoLocation";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { useEffect, useState } from "react";
import { Viewport } from "../types/viewport";
import { DEFAULT_MAP_CENTER, MAPBOX_STYLE } from "../util/constants";
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import { LocatableUser } from "../types/user";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";

import { makeStyles } from "@mui/styles";
import PingSendDialog from "../components/PingSendDialog";
import { Nullable } from "../types/nullable";
import { useSelector } from "react-redux";
import { getCurrentUser } from "../modules/user";
import { getOnlineUsers } from "../modules/onlineUsers";
import { getCurrentLocation } from "../modules/geolocation";

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

  const { socket } = useSelector(getCurrentUser);
  const onlineUsers = useSelector(getOnlineUsers);
  const location = useSelector(getCurrentLocation);

  const [selectedUser, setSelectedUser] =
    useState<Nullable<LocatableUser>>(null);
  const [pingSendDialogIsOpen, setPingSendDialogIsOpen] = useState(false);
  const [viewport, setViewport] = useState<Viewport>({
    ...DEFAULT_MAP_CENTER,
    width: "75vw",
    height: "75vh",
    zoom: 12,
  });

  // Update user location on map and on server
  useEffect(() => {
    if (location) {
      setViewport((prevViewport) => ({
        ...prevViewport,
        latitude: location.latitude,
        longitude: location.longitude,
      }));
    }
  }, [location]);

  const handleSelectUser = (user: LocatableUser) => {
    setSelectedUser(user);
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!location}
      >
        <Grid container flexDirection="column" alignItems="center">
          <Grid item>
            <CircularProgress color="inherit" />
          </Grid>
          <Grid item>
            <Typography variant="h6">Getting your location...</Typography>
          </Grid>
        </Grid>
      </Backdrop>

      {/* Dialogs */}
      <PingSendDialog
        isOpen={pingSendDialogIsOpen}
        setIsOpen={setPingSendDialogIsOpen}
        receiver={selectedUser}
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
                  color={user.socketId === socket.id ? "default" : "info"}
                  onClick={() => {
                    handleSelectUser(user);
                  }}
                >
                  <FaceIcon />
                  <Typography>
                    {user.socketId === socket.id ? "You" : user.name}
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
                  {selectedUser.socketId === socket.id
                    ? "You"
                    : selectedUser.name}
                </Typography>
              </Grid>
              <Grid item>
                {selectedUser.socketId !== socket.id && (
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
                    user.socketId === socket.id
                      ? classes.self
                      : classes.otherUser
                  }
                />
              </Grid>
              <Grid
                item
                className={
                  user.socketId === socket.id ? classes.self : classes.otherUser
                }
              >
                {user.socketId === socket.id ? "You" : user.name}
              </Grid>
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Dashboard;
