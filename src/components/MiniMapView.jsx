import { MapContainer, TileLayer, Circle } from "react-leaflet";
import { useGlobalContext } from "../context/GlobalContext";
import "leaflet/dist/leaflet.css";

export default function MiniMapView({ selected, onDropAR }) {
  const { bubbles } = useGlobalContext();

  if (!selected) return null;

  const selectedBubble =
    selected.type === "bulle"
      ? bubbles.find((b) => b.id === selected.id)
      : null;

  const center = selectedBubble
    ? [selectedBubble.lat, selectedBubble.lng]
    : [48.8584, 2.2945]; // par défaut : Paris

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const arId = e.dataTransfer.getData("text/plain");
        if (arId) onDropAR(arId);
      }}
      className="w-full h-40 border rounded overflow-hidden mb-3"
    >
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        className="w-full h-full grayscale"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
          attribution=""
        />
        {selectedBubble && (
          <Circle
            center={[selectedBubble.lat, selectedBubble.lng]}
            radius={selectedBubble.r || 30}
            pathOptions={{ color: "indigo", fillOpacity: 0.4 }}
          />
        )}
      </MapContainer>
    </div>
  );
}