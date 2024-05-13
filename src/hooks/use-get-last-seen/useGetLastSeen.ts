import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "setup/firebase";
import User from "../../interfaces/user";
import { useFormatDate } from "hooks";

const useGetLastSeen = (uid: User["uid"]) => {
  const [lastSeen, setLastSeen] = useState<string | undefined>(undefined);
  const formattedDate = useFormatDate();
  useEffect(() => {
    if (!uid) {
      return;
    }

    const userDocRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnapShot) => {
      const data = docSnapShot.data();
      if (data && data.lastSeen) {
        setLastSeen(formattedDate(data.lastSeen.toDate()));
      } else {
        setLastSeen("unknown");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [uid]);

  return lastSeen;
};

export default useGetLastSeen;
