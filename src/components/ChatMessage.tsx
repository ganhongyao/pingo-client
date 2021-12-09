import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useUserSocket from "../hooks/useUserSocket";
import { Message } from "../types/message";

const useStyles = makeStyles((theme) => ({
  messageContainer: {
    display: "flex",
    marginBottom: "10px",
  },

  sentMessageContainer: {
    flexDirection: "row-reverse",
    alignSelf: "flex-end",
  },

  receivedMessageContainer: {},

  message: {
    display: "flex",
    alignItems: "center",
    borderRadius: "15px",
    padding: "10px 20px",
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
      className={`
        ${classes.messageContainer}
        ${
          isSender
            ? classes.sentMessageContainer
            : classes.receivedMessageContainer
        }
      `}
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
