import { GeoLocation } from "./geolocation";

export type User = {
  socketId: string;
  location: GeoLocation;
};
