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
import { useContext, useEffect, useState } from "react";
import ChatMessage from "../components/ChatMessage";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { SocketContext } from "../context/socket";
import { getAllConversations } from "../modules/conversations";
import { Conversation } from "../types/conversation";
import { Nullable } from "../types/nullable";
import { useParams } from "react-router";

const useStyles = makeStyles((theme) => ({
  name: {
    marginBottom: "10px",
  },
}));

export default function Chats() {
  const conversations = useSelector(getAllConversations);
  const classes = useStyles();
  const { chatId } = useParams();
  const socket = useContext(SocketContext);
  const [currentConversation, setCurrentConversation] =
    useState<Nullable<Conversation>>(null);
  const [draftMessage, setDraftMessage] = useState("");

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };

  useEffect(() => {
    if (chatId && conversations.length > 0) {
      handleSelectConversation(conversations[conversations.length - 1]);
    }
  }, [chatId]);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <List style={{ width: "20%" }}>
          {conversations.map((conversation, index) => (
            <ListItem disablePadding key={index}>
              <ListItemButton
                onClick={() => handleSelectConversation(conversation)}
              >
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={conversation.otherUser.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider orientation="vertical" />
        <Paper variant="outlined" style={{ width: "80%", padding: "20px" }}>
          <Typography variant="h4" className={classes.name}>
            {currentConversation?.otherUser.name || "No chats selected"}
          </Typography>
          {currentConversation?.messages.map((message, index) => (
            <ChatMessage message={message.content} sender={message.sender} />
          ))}
          {currentConversation && (
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
          )}
        </Paper>
      </Box>
    </>
  );
}
