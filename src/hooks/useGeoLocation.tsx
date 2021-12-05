import { useEffect, useState } from "react";
import { GeoLocation } from "../types/geolocation";
import { Nullable } from "../types/nullable";

export default function useGeoLocation(): Nullable<GeoLocation> {
  const [location, setLocation] = useState<Nullable<GeoLocation>>(null);

  const onChange = ({ coords }: GeolocationPosition) => {
    setLocation({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  };

  useEffect(() => {
    const geoloc = navigator.geolocation;
    if (!geoloc) {
      return;
    }

    const watcher = geoloc.watchPosition(onChange);
    return () => {
      geoloc.clearWatch(watcher);
    };
  }, []);

  return location;
}
