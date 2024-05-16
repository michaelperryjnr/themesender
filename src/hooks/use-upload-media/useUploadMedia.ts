import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable as uploadBytes,
  FirebaseStorage,
} from "firebase/storage";
import { useAppDispatch } from "hooks/use-reducer-hooks/useReducerHooks";
import React, { useEffect, useState } from "react";
import { createToast } from "toastSlice";
import { v4 as uuid } from "uuid";

type MediaType = "image" | "video" | "audio" | "file";

type UploadMediaParams = {
  mediaFile: File;
  mediaType: MediaType;
  mediaInputRef?: React.RefObject<HTMLInputElement>;
  storage: FirebaseStorage;
};

const useUploadMedia = (storage: FirebaseStorage) => {
  const [mediaURL, setMediaURL] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isMediaPending, setIsMediaPending] = useState<boolean>(false);
  const [mediaStorageName, setMediaStorageName] = useState("");
  const [uploadTask, setUploadTask] = useState<any>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      if (uploadTask) {
        uploadTask.cancel();
        console.log("Upload task canceled");
      }
    };
  }, [uploadTask]);

  const uploadMedia = async ({
    mediaFile,
    mediaType,
    mediaInputRef,
    storage,
  }: UploadMediaParams) => {
    try {
      setIsMediaPending(true);
      const mediaUpload = mediaFile;
      if (!mediaUpload) return;

      const mediaName = `${mediaType}/${mediaUpload.name + uuid()}`;
      const mediaRef = ref(storage, mediaName);
      setMediaStorageName(mediaName);

      const uploadTaskInstance = uploadBytes(mediaRef, mediaUpload);
      setUploadTask(uploadTaskInstance);

      uploadTaskInstance.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          dispatch(createToast(`Upload failed: ${error.message}`));
          setIsMediaPending(false);
          setUploadProgress(0);
        },
        async () => {
          const downloadURL = await getDownloadURL(
            uploadTaskInstance.snapshot.ref
          );
          if (mediaInputRef && mediaInputRef.current) {
            mediaInputRef.current.value = "";
          }
          setMediaURL(downloadURL);
          setIsMediaPending(false);
          setUploadProgress(100);
        }
      );
    } catch (error: any) {
      console.error("Error uploading media:", error);
      dispatch(createToast("Something went wrong while uploading media."));
      setIsMediaPending(false);
      setUploadProgress(0);
    }
  };

  const removeUploadMedia = () => {
    if (!mediaStorageName) return;
    const mediaRef = ref(storage, mediaStorageName);
    deleteObject(mediaRef)
      .then(() => {
        setMediaURL("");
        setMediaStorageName("");
      })
      .catch((error) => {
        console.error("Error removing media:", error);
        dispatch(createToast("Something went wrong while removing media."));
      });
  };

  return {
    uploadMedia,
    removeUploadMedia,
    mediaURL,
    isMediaPending,
    uploadProgress,
  };
};

export default useUploadMedia;
