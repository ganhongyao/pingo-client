import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";

interface UserState {
  name: string;
}

const initialState: UserState = {
  name: "",
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

export const getUserName = (state: AppState) => state.user.name;
