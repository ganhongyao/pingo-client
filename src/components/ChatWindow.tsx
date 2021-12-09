import { Paper, Typography, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import useUserSocket from "../hooks/useUserSocket";
import { sendMessage } from "../service/operations";
import { Conversation } from "../types/conversation";
import { Nullable } from "../types/nullable";
import ChatMessage from "./ChatMessage";

const useStyles = makeStyles((theme) => ({
  name: {
    marginBottom: "10px",
  },

  paper: {
    padding: "20px",
  },

  messagesContainer: {
    height: "280px",
    overflow: "auto",
    display: "flex",
    flexDirection: "column-reverse",
  },
}));

interface OwnProps {
  selectedConversation: Nullable<Conversation>;
}

export default function ChatWindow({ selectedConversation }: OwnProps) {
  const classes = useStyles();
  const { name, socket } = useUserSocket();
  const [draftMessage, setDraftMessage] = useState("");

  const handleSendMessage = () => {
    if (draftMessage) {
      const message = {
        sender: { name: name, socketId: socket.id },
        receiver: selectedConversation!.otherUser,
        content: draftMessage.trim(),
      };
      sendMessage(socket, message);
      setDraftMessage("");
    }
  };

  return (
    <Paper elevation={2} className={classes.paper}>
      <Typography variant="h4" className={classes.name}>
        {selectedConversation?.otherUser.name || "No chats selected"}
      </Typography>
      <div className={classes.messagesContainer}>
        <div>
          {/* Wrapper div so that we do not have to manually reverse the order of items 
          since column-reverse is used in the outer container. See
          https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up*/}
          {selectedConversation?.messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
      </div>
      {selectedConversation && (
        <TextField
          autoFocus
          margin="dense"
          id="message"
          label="Message"
          type="text"
          size="small"
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
  );
}
