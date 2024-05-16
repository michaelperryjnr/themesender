import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable as uploadBytes,
} from "firebase/storage";
import { useAppDispatch } from "hooks/use-reducer-hooks/useReducerHooks";
import React, { useEffect, useState } from "react";
import { storage } from "setup/firebase";
import { createToast } from "toastSlice";
import { v4 as uuid } from "uuid";

type uploadMediaParams = {
  mediaFile: File;
  mediaInputRef?: React.Ref<HTMLInputElement>;
  storage: any;
};

const useUploadMedia = (storage: any) => {
  const [mediaURL, setMediaURL] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isMediaPending, setIsMediaPending] = useState<boolean>(false);
  const [mediaStorageName, setMediaStorageName] = useState("");
  const [upLoadTask, setUploadTask] = useState<any>(null);

  const dispatch = useAppDispatch();

  useEffect(()=> {
    if(upLoadTask) {
      upLoadTask.cancel();
      console.log("upload task cancelled")
    }
  }, [upLoadTask])

  const uploadMedia = async ({mediaFile, mediaInputRef, storage}: uploadMediaParams) => {
    try {
      setIsMediaPending(true);
      const mediaUpload = mediaFile;
      if(!mediaUpload) return;

      const mediaName = `media/${mediaUpload.name + uuid()}`;
      const mediaRef = ref(storage, mediaName);

      setMediaStorageName(mediaName);

      const upLoadTaskInstance = uploadBytes(mediaRef, mediaUpload);
      setUploadTask(upLoadTaskInstance);

      upLoadTaskInstance.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          dispatch(createToast("something went wrong."));
          setIsMediaPending(false);
          setUploadProgress(0)
        },
        async () => {
          const downloadURL = await getDownloadURL(upLoadTask.snapshot.ref);
          if (mediaInputRef && mediaInputRef.current) {
            mediaInputRef.current.value = "";
          }
          setMediaURL(downloadURL);
          setIsMediaPending(false);
          setUploadProgress(100);
        }
      );}
    catch (error: any) {
      console.error("Error uploading media", error.message);
      dispatch(createToast("something went wrong while uploading media"));
      setIsMediaPending(false);
      setUploadProgress(0);
    }

   const removeUploadMedia = () => {
    if (!mediaStorageName) return;

    const mediaRef = ref(storage, mediaStorageName);
    deleteObject(mediaRef)
    .then(() => {
      setMediaURL("");
      setMediaStorageName("");
    })
    .catch((error) => {
      console.error("Error deleting media", error.message);
      dispatch(createToast("something went wrong while deleting media"));
    });
  };

  return { uploadMedia, removeUploadMedia, mediaURL, isMediaPending, uploadProgress};
};
};

export default useUploadMedia;
