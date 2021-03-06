import {
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getAllConversations,
  getConversationByIndex,
} from "../modules/conversations";
import { useNavigate, useParams } from "react-router";
import ChatWindow from "../components/ChatWindow";

export default function Chats() {
  const navigate = useNavigate();

  const conversations = useSelector(getAllConversations);
  const { chatId } = useParams();
  const selectedConversation = useSelector(
    getConversationByIndex(Number(chatId))
  );

  const handleSelectConversation = (index: number) => {
    navigate(`/chats/${index}`);
  };

  useEffect(() => {
    if (chatId === "latest" && conversations.length > 0) {
      handleSelectConversation(conversations.length - 1);
    }
  }, [chatId]);

  return (
    <Grid container flexDirection="row" spacing={3}>
      <Grid item xs={12} md={3}>
        <List>
          <ListSubheader>Users</ListSubheader>
          {conversations.map((conversation, index) => (
            <ListItem disablePadding key={index}>
              <ListItemButton
                onClick={() => handleSelectConversation(index)}
                selected={Number(chatId) === index}
              >
                <ListItemIcon>
                  <Avatar>
                    {conversation.otherUser.name.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary={conversation.otherUser.name} />
              </ListItemButton>
            </ListItem>
          ))}
          {conversations.length === 0 && (
            <Typography variant="caption">
              Users whom you have messages with will appear here.
            </Typography>
          )}
        </List>
      </Grid>
      <Grid item xs={12} md={9}>
        <ChatWindow selectedConversation={selectedConversation} />
      </Grid>
    </Grid>
  );
}
