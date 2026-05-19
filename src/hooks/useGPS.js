import { useState, useRef, useEffect } from "react";

export function useGPS() {
  const [userPos, setUserPos] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [watching, setWatching] = useState(false);
  const watchId = useRef(null);

  const startWatching = () => {
    if (!navigator.geolocation) { setGpsError("Geolocation not supported."); return; }
    setWatching(true);
    watchId.current = navigator.geolocation.watchPosition(
      p => setUserPos({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }),
      e => setGpsError(e.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  };

  const stopWatching = () => {
    if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    setWatching(false);
  };

  useEffect(() => () => { if (watchId.current) navigator.geolocation.clearWatch(watchId.current); }, []);

  const getDistance = (la1, lo1, la2, lo2) => {
    const R = 6371000, dL = (la2 - la1) * Math.PI / 180, dO = (lo2 - lo1) * Math.PI / 180;
    const a = Math.sin(dL / 2) ** 2 + Math.cos(la1 * Math.PI / 180) * Math.cos(la2 * Math.PI / 180) * Math.sin(dO / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const navigateTo = (lat, lng) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    if (isIOS) window.open(`maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=w`, "_blank");
    else if (isAndroid) window.open(`google.navigation:q=${lat},${lng}&mode=w`, "_blank");
    else window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`, "_blank");
  };

  return { userPos, gpsError, watching, startWatching, stopWatching, getDistance, navigateTo };
}