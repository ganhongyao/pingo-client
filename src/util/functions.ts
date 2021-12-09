import { LOCATION_UPDATE_TIME_INTERVAL } from "./constants";

export const isLocationUpdateDue = (lastUpdated: number): boolean => {
  const now = Date.now();
  const timeElapsed = now - lastUpdated;
  return timeElapsed > LOCATION_UPDATE_TIME_INTERVAL;
};
