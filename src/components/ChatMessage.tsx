import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
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
    backgroundColor: "skyblue",
    maxWidth: "30%",
  },
}));

interface OwnProps {
  message: Message;
}

export default function ChatMessage({ message }: OwnProps) {
  const classes = useStyles();

  return (
    <div className={classes.receivedMessageContainer}>
      <Typography className={classes.message}>{message.content}</Typography>
    </div>
  );
}
