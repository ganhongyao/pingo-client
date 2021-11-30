import { useState } from "react";
import { Location } from "../types/location";
import { Nullable } from "../types/nullable";

export default function useGeoLocation(): Nullable<Location> {
  const [location, setLocation] = useState<Nullable<Location>>(null);

  navigator.geolocation.getCurrentPosition((pos) => {
    setLocation({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    });
  });

  return location;
}
