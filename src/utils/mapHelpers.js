// src/utils/mapHelpers.js
import * as turf from "@turf/turf";

export function newBubble(id, lat, lng, opts = {}) {
  return {
    id,
    lat,
    lng,
    r: opts.r || 30,
    color: opts.color || "#3388ff",
    ...opts,
  };
}

export function newLink(id, from, to, opts = {}) {
  return {
    id,
    from,
    to,
    thickness: opts.thickness || 5,
    ...opts,
  };
}

export function pastelColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;
}

export function computeCordonSensible(b1, b2, thickness = 5) {
  const line = turf.lineString([[b1.lng, b1.lat], [b2.lng, b2.lat]]);
  const buffer = turf.buffer(line, thickness / 2, { units: "meters" });
  return buffer.geometry.coordinates[0].map(([lng, lat]) => ({ lat, lng }));
}