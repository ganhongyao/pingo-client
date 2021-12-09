import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { AppState, store } from "../store";
import { LocatableUser } from "../types/user";

interface OnlineUsersState {
  allOnlineUsers: LocatableUser[];
}

const initialState: OnlineUsersState = {
  allOnlineUsers: [],
};

export const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState,
  reducers: {
    setOnlineUsers: (
      state,
      action: PayloadAction<{ users: LocatableUser[]; userSocket: Socket }>
    ) => {
      const { users, userSocket } = action.payload;
      // Moves self to front so that legend displays self first before other users
      // TODO: Store otherUsers and self separately
      const self = users.filter(
        (user: LocatableUser) => user.socketId === userSocket.id
      );
      const otherUsers = users.filter(
        (user: LocatableUser) => user.socketId !== userSocket.id
      );
      const allUsers = [...self, ...otherUsers];
      state.allOnlineUsers = allUsers;
    },
  },
});

export const { setOnlineUsers } = onlineUsersSlice.actions;

export default onlineUsersSlice.reducer;

export const getOnlineUsers = (state: AppState) =>
  state.onlineUsers.allOnlineUsers;
