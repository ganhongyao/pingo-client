import { GeoLocation } from "./geolocation";
import { Socket } from "socket.io-client";

export type User = {
  name: string;
  socketId: string;
};

export type LocatableUser = User & { location: GeoLocation };

export type UserSocket = {
  name: string;
  socket: Socket;
};
