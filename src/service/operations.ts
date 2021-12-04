import { Socket } from "socket.io-client";
import { GeoLocation } from "../types/geolocation";
import { Nullable } from "../types/nullable";
import {
  EVENT_QUERY_FRIEND_LOCATIONS,
  EVENT_UPDATE_LOCATION,
  EVENT_UPDATE_NAME,
} from "./events";

export function updateName(socket: Nullable<Socket>, name: string): void {
  if (!socket) {
    throw new Error("Socket is not initialized");
  }
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
