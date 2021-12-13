import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./modules/user";
import conversationsReducer from "./modules/conversations";
import onlineUsersReducer from "./modules/onlineUsers";
import geolocationReducer from "./modules/geolocation";

export const store = configureStore({
  reducer: {
    user: userReducer,
    conversations: conversationsReducer,
    onlineUsers: onlineUsersReducer,
    geolocation: geolocationReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;