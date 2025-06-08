import { useState, useCallback, useEffect } from "react";

export default function useCurrentLocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fallbackIP = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      if (data?.latitude && data?.longitude) {
        setCoords({ lat: data.latitude, lng: data.longitude });
      } else {
        setError("Localisation IP indisponible.");
      }
    } catch (e) {
      setError("Erreur de fallback IP.");
    }
    setLoading(false);
  };

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Géolocalisation non supportée.");
      fallbackIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError("Erreur GPS : " + err.message);
        fallbackIP();
      },
      {
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 30000,
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    coords,
    error,
    loading,
    refresh: requestLocation,
  };
}