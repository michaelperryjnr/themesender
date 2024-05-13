import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "setup/firebase";
import User from '../../interfaces/user'


const useGetUserStatus = (uid: User["uid"]) => {
  const [online, setOnline] = useState<boolean>(false);

  useEffect(() => {
    if(!uid){
      return;
    }

    const userDocRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnapShot) => {
      const data = docSnapShot.data();
      if(data) {
        setOnline(data.status === "online");
      } else {
        setOnline(false);
      }
    });

    return () => {
      unsubscribe();
    }
  }, [uid]);
  
  return online;
}

export default useGetUserStatus;
