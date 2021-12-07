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
import { useEffect, useState } from "react";
import ChatMessage from "../components/ChatMessage";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import {
  getAllConversations,
  getConversationByIndex,
} from "../modules/conversations";
import { useNavigate, useParams } from "react-router";
import { sendMessage } from "../service/operations";
import { getCurrentUser } from "../modules/user";

const useStyles = makeStyles((theme) => ({
  name: {
    marginBottom: "10px",
  },
}));

export default function Chats() {
  const classes = useStyles();
  const navigate = useNavigate();

  const conversations = useSelector(getAllConversations);
  const { chatId } = useParams();
  const currentConversation = useSelector(
    getConversationByIndex(Number(chatId))
  );
  const { socket } = useSelector(getCurrentUser);
  const [draftMessage, setDraftMessage] = useState("");

  const handleSendMessage = () => {
    if (draftMessage) {
      sendMessage(socket, {
        sender: currentConversation!.otherUser, // TODO: get current user
        receiver: currentConversation!.otherUser,
        content: draftMessage.trim(),
      });
      setDraftMessage("");
    }
  };

  const handleSelectConversation = (index: number) => {
    navigate(`/chats/${index}`);
  };

  useEffect(() => {
    if (chatId === "latest" && conversations.length > 0) {
      handleSelectConversation(conversations.length - 1);
    }
  }, [chatId]);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <List style={{ width: "20%" }}>
          {conversations.map((conversation, index) => (
            <ListItem disablePadding key={index}>
              <ListItemButton onClick={() => handleSelectConversation(index)}>
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
            <ChatMessage key={index} message={message} />
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
                  handleSendMessage();
                }
              }}
            />
          )}
        </Paper>
      </Box>
    </>
  );
}
