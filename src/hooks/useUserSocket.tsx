import { useSelector } from "react-redux";
import { getCurrentUser } from "../modules/user";
import { UserSocket } from "../types/user";

export default function useUserSocket(): UserSocket {
  const currentUser = useSelector(getCurrentUser);
  return currentUser;
}
