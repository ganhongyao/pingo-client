import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { DEFAULT_MAP_CENTER } from "../util/constants";
import { GeoLocation } from "../types/geolocation";

const initialState: GeoLocation = DEFAULT_MAP_CENTER;

export const geolocationSlice = createSlice({
  name: "geolocation",
  initialState,
  reducers: {
    setGeoLocation: (state, action: PayloadAction<GeoLocation>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
  },
});

export const { setGeoLocation } = geolocationSlice.actions;

export default geolocationSlice.reducer;

export const getCurrentLocation = (state: AppState) => state.geolocation;
