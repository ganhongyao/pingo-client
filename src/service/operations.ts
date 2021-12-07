import { Socket } from "socket.io-client";
import { addSentMessage } from "../modules/conversations";
import { setName } from "../modules/user";
import { store } from "../store";
import { GeoLocation } from "../types/geolocation";
import { Message } from "../types/message";
import { Nullable } from "../types/nullable";
import { PingOutgoing } from "../types/user";
import {
  EVENT_PING_FRIEND,
  EVENT_QUERY_FRIEND_LOCATIONS,
  EVENT_SEND_MESSAGE,
  EVENT_UPDATE_LOCATION,
  EVENT_UPDATE_NAME,
} from "./events";

export function updateName(socket: Nullable<Socket>, name: string): void {
  if (!socket) {
    throw new Error("Socket is not initialized");
  }
  store.dispatch(setName(name));
  socket.emit(EVENT_UPDATE_NAME, name);
}

export function updateLocation(
  socket: Nullable<Socket>,
  location: GeoLocation
): void {
  if (!socket) {
    throw new Error("Socket is not initialized");
  }
  socket.emit(EVENT_UPDATE_LOCATION, location);
}

export function queryFriendsLocations(socket: Nullable<Socket>): void {
  if (!socket) {
    throw new Error("Socket is not initialized");
  }
  socket.emit(EVENT_QUERY_FRIEND_LOCATIONS);
}

export function pingFriend(
  socket: Nullable<Socket>,
  pingAction: PingOutgoing
): void {
  if (!socket) {
    throw new Error("Socket is not initialized");
  }
  socket.emit(EVENT_PING_FRIEND, pingAction);
}

export function sendMessage(socket: Nullable<Socket>, message: Message): void {
  if (!socket) {
    throw new Error("Socket is not initialized");
  }
  store.dispatch(addSentMessage(message));
  socket.emit(EVENT_SEND_MESSAGE, message);
}
