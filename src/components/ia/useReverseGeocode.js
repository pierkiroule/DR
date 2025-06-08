import { useState, useEffect } from "react";

// BigDataCloud Reverse Geocoding (gratuit, pas de clé)
export default function useReverseGeocode(coords) {
  const [locInfo, setLocInfo] = useState(null);
  useEffect(() => {
    if (!coords) return;
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.lat}&longitude=${coords.lng}&localityLanguage=fr`)
      .then((r) => r.json())
      .then((data) => {
        setLocInfo({
          city: data.city || data.locality || data.principalSubdivision,
          admin1: data.principalSubdivision,
          country: data.countryName
        });
      })
      .catch(console.error);
  }, [coords]);
  return locInfo;
}