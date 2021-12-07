import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useContext, useState } from "react";
import { updateName } from "../service/operations";
import { useDispatch } from "react-redux";
import { SocketContext } from "../context/socket";

export default function NamePrompt() {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const [isOpen, setIsOpen] = useState(true);
  const [draftName, setDraftName] = useState("");

  const handleSubmit = () => {
    setIsOpen(false);
    updateName(socket, draftName.trim());
  };

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Welcome to Pingo!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter your name, so that people nearby know who you are!
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>Proceed</Button>
      </DialogActions>
    </Dialog>
  );
}
