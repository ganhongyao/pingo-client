import { createContext } from "react";
import io, { Socket } from "socket.io-client";
import { Nullable } from "../types/nullable";
import { SOCKET_URL } from "../util/constants";

export const socket = io(SOCKET_URL);
export const SocketContext = createContext<Nullable<Socket>>(null);
