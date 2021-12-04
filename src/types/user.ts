import { GeoLocation } from "./geolocation";

export type User = {
  name: string;
  socketId: string;
  location: GeoLocation;
};
