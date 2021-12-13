import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setGeoLocation } from "../modules/geolocation";
import { GeoLocation } from "../types/geolocation";
import { Nullable } from "../types/nullable";

export default function useGeoLocation(): Nullable<GeoLocation> {
  const dispatch = useDispatch();
  const [location, setLocation] = useState<Nullable<GeoLocation>>(null);

  const onChange = ({ coords }: GeolocationPosition) => {
    setLocation({ longitude: coords.longitude, latitude: coords.latitude });
    dispatch(
      setGeoLocation({ longitude: coords.longitude, latitude: coords.latitude })
    );
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
