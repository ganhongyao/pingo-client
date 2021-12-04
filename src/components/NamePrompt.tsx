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

interface OwnProps {
  handleUpdateName: (name: string) => void;
}

export default function NamePrompt({ handleUpdateName }: OwnProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [name, setName] = useState("");

  const handleSubmit = () => {
    setIsOpen(false);
    handleUpdateName(name);
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
          value={name}
          onChange={(e) => setName(e.target.value)}
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
