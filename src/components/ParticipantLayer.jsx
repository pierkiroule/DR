import { useEffect, useState } from "react";
import { Circle, useMap } from "react-leaflet";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

export default function ParticipantLayer({ sessionCode, enabled = true }) {
  const [positions, setPositions] = useState([]);
  const map = useMap();

  useEffect(() => {
    if (!enabled || !sessionCode) return;

    const locRef = ref(db, `locations/${sessionCode}`);
    const unsubscribe = onValue(locRef, (snap) => {
      const data = snap.val() || {};
      const all = Object.values(data).map((p) => ({
        lat: p.lat,
        lng: p.lng,
        id: p.id || "",
        role: p.role || "user",
      }));
      setPositions(all);
    });

    return () => unsubscribe();
  }, [sessionCode, enabled]);

  // Zoom automatique sur les participants
  useEffect(() => {
    if (positions.length > 0 && enabled) {
      const bounds = positions.map((p) => [p.lat, p.lng]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    }
  }, [positions, enabled, map]);

  if (!enabled) return null;

  return (
    <>
      {positions.map((p, i) => (
        <Circle
          key={i}
          center={[p.lat, p.lng]}
          radius={p.role === "dj" ? 15 : 10}
          pathOptions={{
            color: p.role === "dj" ? "#ff0066" : "#6699ff",
            fillOpacity: 0.4,
            weight: 1,
          }}
        />
      ))}
    </>
  );
}