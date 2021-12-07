import { Message } from "./message";
import { User } from "./user";

export type Conversation = {
  sender: User;
  receiver: User;
  messages: Message[];
};
