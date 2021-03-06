import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useUserSocket from "../hooks/useUserSocket";
import { addReceivedMessage } from "../modules/conversations";
import { acceptPing } from "../service/operations";
import { Nullable } from "../types/nullable";
import { Ping } from "../types/ping";

interface OwnProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  incomingPing: Nullable<Ping>;
}

export default function PingReceiveDialog({
  isOpen,
  setIsOpen,
  incomingPing,
}: OwnProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, socket } = useUserSocket();

  if (!incomingPing) {
    return null;
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDecline = () => {
    handleClose();
  };

  const handleAccept = () => {
    acceptPing(socket, incomingPing);
    dispatch(
      addReceivedMessage({
        sender: incomingPing.sender,
        receiver: { name: name, socketId: socket.id },
        content: incomingPing.message,
      })
    );
    handleClose();
    navigate("/chats/latest");
  };

  const { sender, message } = incomingPing;

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle>{`Ping from ${sender.name}`}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          id="message"
          label="Message"
          type="text"
          fullWidth
          multiline
          disabled
          variant="standard"
          value={message || "(blank)"}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDecline} color="error">
          Ignore
        </Button>
        <Button onClick={handleAccept} color="info" variant="contained">
          Chat
        </Button>
      </DialogActions>
    </Dialog>
  );
}
