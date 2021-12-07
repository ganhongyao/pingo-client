import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "../util/constants";

interface UserState {
  name: string;
  socket: Socket;
}

const initialState: UserState = {
  name: "",
  socket: io(SOCKET_URL),
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export const { setName } = userSlice.actions;

export default userSlice.reducer;

export const getCurrentUser = (state: AppState) => state.user;
