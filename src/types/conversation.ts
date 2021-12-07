import { Message } from "./message";
import { User } from "./user";

export type Conversation = {
  otherUser: User;
  messages: Message[];
};
