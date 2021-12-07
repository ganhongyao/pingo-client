import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { Conversation } from "../types/conversation";

interface ConversationsState {
  allConversations: Conversation[];
}

const initialState: ConversationsState = {
  allConversations: [],
};

export const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    createConversation: (state, action: PayloadAction<Conversation>) => {
      state.allConversations.push(action.payload);
    },
  },
});

export const { createConversation } = conversationsSlice.actions;

export default conversationsSlice.reducer;

export const getAllConversations = (state: AppState) =>
  state.conversations.allConversations;
