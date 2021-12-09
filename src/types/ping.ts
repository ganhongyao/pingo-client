import { User } from "./user";

export type Ping = {
  sender: User;
  receiver: User;
  message: string;
};
