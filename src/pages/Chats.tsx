import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
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
      enqueueSnackbar("New message received", { variant: "info" });
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [socket]);

  return (
    <Grid container flexDirection="row" spacing={1}>
      <Grid item xs={12} md={3}>
        <List>
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
      </Grid>
      <Grid item xs={12} md={9}>
        <ChatWindow selectedConversation={selectedConversation} />
      </Grid>
    </Grid>
  );
}
