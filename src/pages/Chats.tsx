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
import { useDispatch, useSelector } from "react-redux";
import {
  addReceivedMessage,
  getAllConversations,
  getConversationByIndex,
} from "../modules/conversations";
import { useNavigate, useParams } from "react-router";
import useUserSocket from "../hooks/useUserSocket";
import { EVENT_RECEIVE_MESSAGE } from "../service/events";
import { Message } from "../types/message";
import { useSnackbar } from "notistack";
import ChatWindow from "../components/ChatWindow";

export default function Chats() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const conversations = useSelector(getAllConversations);
  const { chatId } = useParams();
  const selectedConversation = useSelector(
    getConversationByIndex(Number(chatId))
  );
  const { socket } = useUserSocket();

  const handleSelectConversation = (index: number) => {
    navigate(`/chats/${index}`);
  };

  useEffect(() => {
    if (chatId === "latest" && conversations.length > 0) {
      handleSelectConversation(conversations.length - 1);
    }
  }, [chatId]);

  useEffect(() => {
    socket.on(EVENT_RECEIVE_MESSAGE, (message: Message) => {
      dispatch(addReceivedMessage(message));
      if (
        message.sender.socketId !== selectedConversation?.otherUser.socketId
      ) {
        // Only show notification if the message is not from the open conversation
        enqueueSnackbar(`New message from ${message.sender.name} `, {
          variant: "info",
        });
      }
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [socket]);

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
