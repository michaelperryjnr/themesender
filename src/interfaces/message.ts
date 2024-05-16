import { Timestamp } from "firebase/firestore";

export default interface Message {
  id: string;
  senderId: string;
  message: string;
  date: Timestamp;
  mediaURL: string;
  lastEdited: Timestamp | null;
  isEdited: boolean;
  mediaType?: |"image" | "video" | "audio" | "file" | "none";
}
