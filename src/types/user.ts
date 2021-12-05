import { GeoLocation } from "./geolocation";

export type User = {
  name: string;
  socketId: string;
  location: GeoLocation;
};

export type PingOutgoing = {
  receiver: User;
  message: string;
};

export type PingIncoming = {
  sender: User;
  message: string;
};