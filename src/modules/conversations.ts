import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { Conversation } from "../types/conversation";
import { Message } from "../types/message";

interface ConversationsState {
  allConversations: Conversation[];
}

const initialState: ConversationsState = {
  allConversations: [],
};

const addMessage =
  (userIsSender: boolean) =>
  (state: ConversationsState, action: PayloadAction<Message>) => {
    const message = action.payload;
    const otherUser = userIsSender ? message.receiver : message.sender;
    const existingConversation = state.allConversations.find(
      (conversation) => conversation.otherUser.socketId === otherUser.socketId
    );
    if (existingConversation) {
      existingConversation.messages.push(message);
    } else {
      state.allConversations.push({
        otherUser: otherUser,
        messages: [message],
      });
    }
  };

export const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    addSentMessage: addMessage(true),
    addReceivedMessage: addMessage(false),
  },
});

export const { addSentMessage, addReceivedMessage } =
  conversationsSlice.actions;

export default conversationsSlice.reducer;

export const getAllConversations = (state: AppState) =>
  state.conversations.allConversations;
export const getConversationByIndex = (index: number) => (state: AppState) => {
  return index >= 0 && index < state.conversations.allConversations.length
    ? state.conversations.allConversations[index]
    : null;
};
