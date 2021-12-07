import { makeStyles } from "@mui/styles";
import { User } from "../types/user";

const useStyles = makeStyles((theme) => ({
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
  message: string;
  user: User;
}

export default function ChatMessage({ message, user }: OwnProps) {
  const classes = useStyles();

  return <div className={classes.message}>{message}</div>;
}
