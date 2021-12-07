import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./modules/user";
import conversationsReducer from "./modules/conversations";

export const store = configureStore({
  reducer: {
    user: userReducer,
    conversations: conversationsReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;