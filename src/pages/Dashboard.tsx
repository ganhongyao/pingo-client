import useGeoLocation from "../hooks/useGeoLocation";
import ReactMapGL, { Marker } from "react-map-gl";
import { useEffect, useState } from "react";
import { Viewport } from "../types/viewport";
import { GeoLocation } from "../types/geolocation";
import { DEFAULT_MAP_CENTER, MAPBOX_STYLE } from "../util/constants";
import { useSocket } from "../hooks/useSocket";
import { useSnackbar } from "notistack";

function Dashboard() {
  const location = useGeoLocation();
  const socket = useSocket();
  const { enqueueSnackbar } = useSnackbar();
  const [viewport, setViewport] = useState<Viewport>({
    ...DEFAULT_MAP_CENTER,
    width: "75vw",
    height: "80vh",
    zoom: 12,
  });

  useEffect(() => {
    if (location) {
      setViewport((prevViewport) => ({
        ...prevViewport,
        latitude: location.latitude,
        longitude: location.longitude,
      }));
    }
  }, [location]);

  useEffect(() => {
    socket?.on("friend connection", () => {
      console.log("friend connected");
      enqueueSnackbar("Friend is online!", { variant: "success" });
    });
    return () => {
      socket?.off("friend connection");
    };
  });

  if (!location) {
    return <div>Location not enabled.</div>;
  }

  // TODO: Add friends' markers here as well
  const markers: GeoLocation[] = [location];

  return (
    <>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle={MAPBOX_STYLE}
        onViewportChange={setViewport}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            latitude={marker.latitude}
            longitude={marker.longitude}
          >
            <img src="/avatar.png" width="25" height="25" />
          </Marker>
        ))}
      </ReactMapGL>
    </>
  );
}

export default Dashboard;
