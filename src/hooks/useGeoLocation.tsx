import { useState } from "react";
import { GeoLocation } from "../types/geolocation";
import { Nullable } from "../types/nullable";

export default function useGeoLocation(): Nullable<GeoLocation> {
  const [location, setLocation] = useState<Nullable<GeoLocation>>(null);

  navigator.geolocation.getCurrentPosition((pos) => {
    setLocation({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    });
  });

  return location;
}
