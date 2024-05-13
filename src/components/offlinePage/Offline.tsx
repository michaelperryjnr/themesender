import React from "react";

const OfflinePage = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-bgmain-dark p-4">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold text-gray-50">Offline</h1>
        <p className="text-gray-300">
          Looks like your internet connection is down. We're working on
          reconnecting you.
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="h-3 w-3 animate-pulse rounded-full bg-primary-main" />
          <div className="h-3 w-3 animate-pulse rounded-full bg-primary-main" />
          <div className="h-3 w-3 animate-pulse rounded-full bg-primary-main" />
        </div>
        <p className="text-gray-300">
          Please check your internet connection and try again.
        </p>
      </div>
    </div>
  );
};

export default OfflinePage;
