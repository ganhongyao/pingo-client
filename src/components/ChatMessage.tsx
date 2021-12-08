import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useUserSocket from "../hooks/useUserSocket";
import { Message } from "../types/message";

const useStyles = makeStyles((theme) => ({
  sentMessageContainer: {
    display: "flex",
    flexDirection: "row-reverse",
    alignSelf: "flex-end",
  },

  receivedMessageContainer: {
    display: "flex",
  },

  message: {
    display: "flex",
    alignItems: "center",
    borderRadius: "15px",
    padding: "10px 20px",
    marginBottom: "12px",
  },

  sentMessage: {
    backgroundColor: "silver",
  },

  receivedMessage: {
    backgroundColor: "skyblue",
  },
}));

interface OwnProps {
  message: Message;
}

export default function ChatMessage({ message }: OwnProps) {
  const classes = useStyles();
  const { socket } = useUserSocket();
  const isSender = message.sender.socketId === socket.id;

  return (
    <div
      className={
        isSender
          ? classes.sentMessageContainer
          : classes.receivedMessageContainer
      }
    >
      <Typography
        className={`${classes.message} ${
          isSender ? classes.sentMessage : classes.receivedMessage
        }`}
      >
        {message.content}
      </Typography>
    </div>
  );
}
