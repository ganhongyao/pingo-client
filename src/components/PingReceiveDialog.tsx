import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Nullable } from "../types/nullable";
import { PingIncoming, User } from "../types/user";

interface OwnProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  incomingPing: Nullable<PingIncoming>;
}

export default function PingReceiveDialog({
  isOpen,
  setIsOpen,
  incomingPing,
}: OwnProps) {
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDecline = () => {
    handleClose();
  };

  const handleAccept = () => {
    handleClose();
  };

  if (!incomingPing) {
    return null;
  }

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
        <Button onClick={handleDecline} color="warning" variant="contained">
          Decline
        </Button>
        <Button onClick={handleAccept} color="success" variant="contained">
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}
