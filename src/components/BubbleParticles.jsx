import { useEffect, useRef } from "react";

export default function BubbleParticles({ lat, lng, map }) {
  const divRef = useRef();

  useEffect(() => {
    if (!map || !divRef.current) return;

    const point = map.latLngToContainerPoint([lat, lng]);
    const el = divRef.current;
    el.style.left = `${point.x}px`;
    el.style.top = `${point.y}px`;
  }, [lat, lng, map]);

  return (
    <div
      ref={divRef}
      style={{
        position: "absolute",
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "rgba(128,0,128,0.6)",
        animation: "bubbleFade 1s ease-out infinite",
        pointerEvents: "none",
        zIndex: 999,
      }}
    />
  );
}