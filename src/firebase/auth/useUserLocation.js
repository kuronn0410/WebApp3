// useUserLocation.js
import { useEffect } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export const useUserLocation = () => {
  useEffect(() => {
    if (!auth.currentUser) return;

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          { location: { lat: latitude, lng: longitude } },
          { merge: true }
        );
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);
};
