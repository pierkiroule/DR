import { useEffect, useState } from "react";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

function buildOverpassQuery(lat, lon, radius = 2000) {
  return `
    [out:json];
    (
      node(around:${radius},${lat},${lon})[historic];
      way(around:${radius},${lat},${lon})[historic];
      relation(around:${radius},${lat},${lon})[historic];
    );
    out center;
  `;
}

export default function OverpassSummary({ coords }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!coords) return;

    const query = buildOverpassQuery(coords.lat, coords.lng);
    const url = `${OVERPASS_URL}?data=${encodeURIComponent(query)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const places = data.elements
          .filter((el) => el.tags?.name)
          .map((el) => ({
            name: el.tags.name,
            type: el.tags.historic || "inconnu",
          }));
        setResults(places);
      })
      .catch((err) => {
        console.error("Erreur Overpass", err);
        setResults([]);
      });
  }, [coords]);

  if (results.length === 0) return null;

  return (
    <div style={{ background: "#eef2f7", padding: 10, borderRadius: 8 }}>
      <h4 style={{ fontWeight: "bold", marginBottom: 6 }}>🏛️ Lieux historiques proches</h4>
      <ul style={{ fontSize: 14 }}>
        {results.map((place, i) => (
          <li key={i}>
            • <strong>{place.name}</strong> ({place.type})
          </li>
        ))}
      </ul>
    </div>
  );
}