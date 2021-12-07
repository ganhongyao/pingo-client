import { User } from "./user";

export type Message = {
  sender: User;
  receiver: User;
  content: string;
};
