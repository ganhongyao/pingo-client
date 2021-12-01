import useGeoLocation from "../hooks/useGeoLocation";
import ReactMapGL, { Marker } from "react-map-gl";
import { useState } from "react";
import { Viewport } from "../types/viewport";
import { GeoLocation } from "../types/geolocation";
import { DEFAULT_MAP_CENTER } from "../util/constants";

function Dashboard() {
  const location = useGeoLocation();
  const [viewport, setViewport] = useState<Viewport>({
    ...DEFAULT_MAP_CENTER,
    width: "75vw",
    height: "80vh",
    zoom: 10,
  });

  if (!location) {
    return <div>Location not enabled.</div>;
  }

  const markers: GeoLocation[] = [location];

  return (
    <>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/ganhongyao/ckwnnjipi9szk15p7h646a8vk"
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
