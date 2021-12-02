import { useEffect, useState } from "react";
import { singletonHook } from "react-singleton-hook";
import { SOCKET_URL } from "../util/constants";
import { io, Socket } from "socket.io-client";
import { Nullable } from "../types/nullable";

const init = null; // Socket is only created when first called

const useSocketImpl = (): Socket => {
  const [socket, setSocket] = useState<Nullable<Socket>>(init);
  useEffect(() => {
    setSocket(io(SOCKET_URL));
  }, []);

  return socket as Socket;
};

export const useSocket = singletonHook(init, useSocketImpl);
