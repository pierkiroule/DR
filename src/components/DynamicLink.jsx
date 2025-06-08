// src/components/DynamicLink.jsx
import { useMemo } from "react";
import { Polygon } from "react-leaflet";
import L from "leaflet";

export default function DynamicLink({ fromBubble, toBubble, thickness = 5, color = "red" }) {
  const path = useMemo(() => {
    const from = L.latLng(fromBubble.lat, fromBubble.lng);
    const to = L.latLng(toBubble.lat, toBubble.lng);

    const angleDeg = (Math.atan2(to.lng - from.lng, to.lat - from.lat) * 180) / Math.PI;

    const offsetPoint = (point, angle, dist) => {
      const rad = (angle * Math.PI) / 180;
      const latOffset = (dist / 111111) * Math.cos(rad);
      const lngOffset = (dist / 111111) * Math.sin(rad) / Math.cos(point.lat * Math.PI / 180);
      return [point.lat + latOffset, point.lng + lngOffset];
    };

    const a = offsetPoint(from, angleDeg + 90, thickness);
    const b = offsetPoint(to, angleDeg + 90, thickness);
    const c = offsetPoint(to, angleDeg - 90, thickness);
    const d = offsetPoint(from, angleDeg - 90, thickness);

    return [a, b, c, d];
  }, [fromBubble, toBubble, thickness]);

  return (
    <Polygon
      positions={path}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: 0.5,
        weight: 0
      }}
    />
  );
}