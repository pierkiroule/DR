import { useState, useEffect } from "react";
import useCurrentLocation from "./useCurrentLocation";

function overpassQuery(lat, lng, radius = 2000) {
  const query = `
    [out:json][timeout:15];
    (
      node(around:${radius},${lat},${lng})[tourism~"museum|attraction|artwork|viewpoint"];
      node(around:${radius},${lat},${lng})[historic];
    );
    out body;
  `;
  return fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  }).then((r) => r.json());
}

function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
  return fetch(url, {
    headers: {
      "User-Agent": "IAme-app",
    },
  }).then((res) => res.json());
}

const blacklist = ["wayside_cross", "cross", "yes"];

export default function ZoneExplorer({ onContextReady }) {
  const { coords, error, loading: geoLoading, refresh } = useCurrentLocation();
  const [pois, setPOIs] = useState([]);

  useEffect(() => {
    if (!coords) return;

    const { lat, lng } = coords;

    Promise.all([overpassQuery(lat, lng), reverseGeocode(lat, lng)])
      .then(([poiData, geoData]) => {
        const elements = poiData.elements || [];
        const filtered = elements
          .filter((e) => e.tags)
          .map((e) => ({
            name: e.tags.name || e.tags.tourism || e.tags.historic || "",
            lat: e.lat,
            lon: e.lon,
          }))
          .filter((p) => p.name && !blacklist.includes(p.name.toLowerCase()));

        const unique = [...new Set(filtered.map((p) => p.name))];
        setPOIs(filtered);

        const address = geoData.address || {};

        onContextReady?.({
          coords,
          resume: unique,
          pois: filtered,
          city: address.city || address.town || address.village || address.hamlet || "",
          department: address.county || "",
          region: address.state || "",
        });
      })
      .catch((err) => console.error("Erreur récupération zone :", err));
  }, [coords]);

  return (
    <div style={{ marginBottom: 10 }}>
      <button onClick={refresh} disabled={geoLoading}>
        {geoLoading ? "Recherche GPS..." : "Actualiser ma position"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {coords && <div>GPS : {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</div>}
      {pois.length > 0 && (
        <ul>
          {pois.slice(0, 5).map((p, i) => (
            <li key={i}>{p.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}