import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Socket } from "socket.io-client";
import { pingFriend } from "../service/operations";
import { Nullable } from "../types/nullable";
import { User } from "../types/user";

interface OwnProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  socket: Nullable<Socket>;
  receiver: Nullable<User>;
}

const DEFAULT_INVITATION_MESSAGE = "Let's meet!";

export default function PingSendDialog({
  isOpen,
  setIsOpen,
  socket,
  receiver,
}: OwnProps) {
  const [message, setMessage] = useState(DEFAULT_INVITATION_MESSAGE);

  if (!receiver) {
    return null;
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = () => {
    pingFriend(socket, { receiver: receiver, message: message });
    handleClose();
    setMessage(DEFAULT_INVITATION_MESSAGE);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{`Ping ${receiver.name}`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Send a message along with your ping!
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="message"
          label="Message"
          type="text"
          fullWidth
          multiline
          variant="standard"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Ping
        </Button>
      </DialogActions>
    </Dialog>
  );
}
