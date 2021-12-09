import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router";
import useGeoLocation from "../hooks/useGeoLocation";
import useUserSocket from "../hooks/useUserSocket";
import { addReceivedMessage, addSentMessage } from "../modules/conversations";
import { setOnlineUsers } from "../modules/onlineUsers";
import Chats from "../pages/Chats";
import Dashboard from "../pages/Dashboard";
import {
  EVENT_FRIEND_LOCATIONS,
  EVENT_PING,
  EVENT_PING_ACCEPTED,
  EVENT_FRIEND_CONNECTION,
  EVENT_FRIEND_DISCONNECTION,
  EVENT_FRIEND_LOCATION_UPDATE,
  EVENT_RECEIVE_MESSAGE,
} from "../service/events";
import { updateLocation, queryFriendsLocations } from "../service/operations";
import { Message } from "../types/message";
import { Nullable } from "../types/nullable";
import { Ping } from "../types/ping";
import { isLocationUpdateDue } from "../util/functions";
import AppDrawer from "./AppDrawer";
import NamePrompt from "./NamePrompt";
import PingReceiveDialog from "./PingReceiveDialog";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "center",
  },

  snackbarButton: {
    color: "#0288d1",
  },
}));

interface OwnProps {
  children?: ReactNode;
}

export default function AppShell({ children }: OwnProps) {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { name, socket } = useUserSocket();
  const location = useGeoLocation();

  const [lastUpdated, setLastUpdated] = useState(0);
  const [openPing, setOpenPing] = useState<Nullable<Ping>>(null);
  const [pingReceiveDialogIsOpen, setPingReceiveDialogIsOpen] = useState(false);

  const handleOpenPing = (ping: Ping) => {
    setOpenPing(ping);
    setPingReceiveDialogIsOpen(true);
  };

  // Update user location on server
  useEffect(() => {
    if (isLocationUpdateDue(lastUpdated) && location && name) {
      updateLocation(socket, location);
      queryFriendsLocations(socket);

      setLastUpdated(Date.now());
    }
  }, [socket, location, name]);

  // Listen for friend activity
  useEffect(() => {
    // Only allow access to friends' locations when name is set
    if (name) {
      socket.on(EVENT_FRIEND_LOCATIONS, (users) => {
        dispatch(setOnlineUsers({ users: users, userSocket: socket }));
      });

      socket.on(EVENT_PING, (incomingPing: Ping) => {
        const { sender } = incomingPing;
        enqueueSnackbar(`${sender.name} pinged you`, {
          variant: "info",
          action: (key) => (
            <Button
              className={classes.snackbarButton}
              onClick={() => handleOpenPing(incomingPing)}
            >
              Respond
            </Button>
          ),
        });
      });

      socket.on(EVENT_PING_ACCEPTED, (sentPing: Ping) => {
        const { receiver } = sentPing;
        dispatch(
          addSentMessage({
            sender: sentPing.sender,
            receiver: sentPing.receiver,
            content: sentPing.message,
          })
        );
        enqueueSnackbar(`${receiver.name} accepted your ping`, {
          variant: "success",
          action: (key) => (
            <Button
              className={classes.snackbarButton}
              onClick={() => {
                navigate("/chats/latest");
              }}
            >
              Chat
            </Button>
          ),
        });
      });

      socket.on(EVENT_FRIEND_CONNECTION, (name: string) => {
        const snackbarKey = enqueueSnackbar(`${name} is online!`, {
          variant: "info",
          onClick: () => closeSnackbar(snackbarKey),
        });
        queryFriendsLocations(socket);
      });

      socket.on(EVENT_FRIEND_DISCONNECTION, () => {
        queryFriendsLocations(socket);
      });

      socket.on(EVENT_FRIEND_LOCATION_UPDATE, (location) => {
        queryFriendsLocations(socket);
      });

      socket.on(EVENT_RECEIVE_MESSAGE, (message: Message) => {
        dispatch(addReceivedMessage(message));
        enqueueSnackbar(`New message from ${message.sender.name} `, {
          variant: "info",
        });
      });
    }

    return () => {
      socket.removeAllListeners();
    };
  }, [socket, name]);

  return (
    <>
      <NamePrompt />
      <PingReceiveDialog
        isOpen={pingReceiveDialogIsOpen}
        setIsOpen={setPingReceiveDialogIsOpen}
        incomingPing={openPing}
      />
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
          <Routes>
            <Route element={<Dashboard />} path="dashboard" />
            <Route element={<Chats />} path="chats/" />
            <Route element={<Chats />} path="chats/:chatId" />
          </Routes>
        </Box>
      </Box>
    </>
  );
}
