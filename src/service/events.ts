// Server to client events
export const EVENT_FRIEND_CONNECTION = "friendConnection";
export const EVENT_FRIEND_DISCONNECTION = "friendDisconnection";
export const EVENT_FRIEND_LOCATIONS = "friendLocations";
export const EVENT_FRIEND_LOCATION_UPDATE = "friendLocationUpdate";
export const EVENT_PING = "ping";
export const EVENT_RECEIVE_MESSAGE = "message";

// Client to server events
export const EVENT_UPDATE_NAME = "updateName";
export const EVENT_UPDATE_LOCATION = "updateLocation";
export const EVENT_QUERY_FRIEND_LOCATIONS = "queryFriendLocations";
export const EVENT_PING_FRIEND = "pingFriend";
export const EVENT_SEND_MESSAGE = "sendMessage";