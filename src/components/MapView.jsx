import {
  useEffect
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import {
  useGlobalContext
} from "../context/GlobalContext";
import FloatingMenus from "./FloatingMenus";
import StartupConsole from "./StartupConsole";
import Assignation from "./Assignation";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  const {
    bubbles,
    links,
    selectedIds,
    setSelectedIds,
    updateBubble,
    setIsDragging,
    addBubble,
    linkEditMode,
    assignTarget,
    setAssignTarget,
  } = useGlobalContext();

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    });
  }, []);

  // Ajoute une bulle sur double-clic
  function AddBubbleOnDoubleClick() {
    useMapEvents( {
      dblclick: (e) => {
        const {
          lat, lng
        } = e.latlng;
        addBubble(lat, lng);
      }
    });
    return null;
  }

  // Désélectionne tout si clic vide
  function MapClickHandler() {
    useMapEvents( {
      click: () => setSelectedIds([]),
    });
    return null;
  }

  // Gère la sélection de bulle/cordon
  const handleSelect = (id) => {
    setSelectedIds((prev) => {
      if (linkEditMode) {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= 2) return [prev[1],
          id];
        return [...prev,
          id];
      } else {
        return prev.includes(id) ? prev.filter((x) => x !== id): [...prev,
          id];
      }
    });
  };

  // Passe l'objet sélectionné à la modale d'assignation
  const selectedFull = (() => {
    if (!assignTarget) return null;
    if (assignTarget.type === "bulle") {
      return bubbles.find((b) => b.id === assignTarget.id) || assignTarget;
    }
    if (assignTarget.type === "cordon") {
      return links.find((l) => l.id === assignTarget.id) || assignTarget;
    }
    return assignTarget;
  })();

  return (
    <div style={ { width: "100%",
      height: "100vh",
      position: "relative" }}>
      <StartupConsole
        style={ {
          position: "absolute",
          bottom: 100,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.8,
          zIndex: 1000,
        }}
        />



      <MapContainer
        center={[48.85,
          2.35]}
        zoom={13}
        style={ {
          height: "100%",
          width: "100%",
        }}
        >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <AddBubbleOnDoubleClick />
        <MapClickHandler />

        {links.map((link) => {
          const from = bubbles.find((b) => b.id === link.from);
          const to = bubbles.find((b) => b.id === link.to);
          if (!from || !to) return null;
          const coords = [
            [from.lat,
              from.lng],
            [to.lat,
              to.lng],
          ];
          return (
            <Polyline
              key={link.id}
              positions={coords}
              pathOptions={ {
                color: link.color || "black",
                weight: link.thickness || 3,
                opacity: 0.7,
              }}
              />
          );
        })}

        {bubbles.map((b) => (
          <Marker
            key={b.id}
            position={[b.lat, b.lng]}
            draggable={true}
            eventHandlers={ {
              dragstart: () => setIsDragging(true),
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng();
                updateBubble(b.id, { lat, lng });
                setIsDragging(false);
              },
              click: () => handleSelect(b.id),
            }}
            />
        ))}

        {bubbles.map((b) => {
          const isSelected = selectedIds.includes(b.id);
          return (
            <Circle
              key={"c" + b.id}
              center={[b.lat, b.lng]}
              radius={b.r || 30}
              pathOptions={ {
                color: isSelected ? "purple": b.color || "#3388ff",
                fillColor: b.color || "#3388ff",
                weight: isSelected ? 5: 1,
                opacity: 1,
                fillOpacity: 0.5,
                dashArray: isSelected ? null: "5,10",
              }}
              eventHandlers={ {
                click: () => handleSelect(b.id),
              }}
              />
          );
        })}
      </MapContainer>

{assignTarget ? null : (
        <FloatingMenus />
      )}

      <Assignation
        isOpen={!!assignTarget}
        onClose={() => {
          setAssignTarget(null);
        }}
        selected={selectedFull}
      />
    </div>
  );
}