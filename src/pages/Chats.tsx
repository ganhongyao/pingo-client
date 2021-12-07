import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import { useState } from "react";
import { User } from "../types/user";
import ChatMessage from "../components/ChatMessage";
import { useSocket } from "../hooks/useSocket";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  name: {
    marginBottom: "10px",
  },
}));

export default function Chats() {
  const myName = useSelector((state: any) => state.user.name);
  const classes = useStyles();
  const socket = useSocket();
  const [users, setUsers] = useState<User[]>([
    {
      name: "Billie Jean",
      socketId: "",
      location: { latitude: 0, longitude: 0 },
    },
    {
      name: "John Doe",
      socketId: "",
      location: { latitude: 0, longitude: 0 },
    },
  ]);
  const currentUser = users[0];
  const [messages, setMessages] = useState<string[]>([
    "hello",
    "this is you",
    "this is me",
  ]);
  const [draftMessage, setDraftMessage] = useState("");

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <List style={{ width: "20%" }}>
          {users.map((user, index) => (
            <ListItem disablePadding key={index}>
              <ListItemButton>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={user.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider orientation="vertical" />
        <Paper variant="outlined" style={{ width: "80%", padding: "20px" }}>
          <Typography variant="h4" className={classes.name}>
            I AM {socket?.id}
          </Typography>
          {messages.map((message, index) => (
            <ChatMessage message={message} user={currentUser} />
          ))}
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Message"
            type="text"
            fullWidth
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                // handleSubmit();
              }
            }}
          />
        </Paper>
      </Box>
    </>
  );
}
