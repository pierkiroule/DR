import React, { useRef, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { Plus, Minus, PaintBucket, Copy, Trash2, Link2 } from "lucide-react";

export default function FloatingMenus() {
  const {
    selectedIds,
    bubbles,
    links,
    resources = [],
    linkEditMode,
    setLinkEditMode,
    resizeSelected,
    colorizeSelected,
    duplicateSelected,
    deleteSelected,
    createLinkBetweenSelected,
    increaseLinkThickness,
    decreaseLinkThickness,
    updateLinkThickness,
    openAssignationModal,
  } = useGlobalContext();

  const [sizeInput, setSizeInput] = useState(30);
  const [cordonInput, setCordonInput] = useState(2);
  const [confirm, setConfirm] = useState("");
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 10, y: 80 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const menuRef = useRef(null);

  const startDrag = (e) => {
    setDragging(true);
    const rect = menuRef.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const onDrag = (e) => {
    if (!dragging) return;
    setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const endDrag = () => setDragging(false);

  const showConfirm = (msg) => {
    setConfirm(msg);
    setTimeout(() => setConfirm(""), 1500);
  };

  // LOGIQUE D’AFFICHAGE DU BOUTON ASSIGNATION
  let canAssign = false;
  let assignTargetType = null;
  let assignTargetId = null;

  if (selectedIds.length === 1) {
    canAssign = true;
    assignTargetType = "bulle";
    assignTargetId = selectedIds[0];
  } else if (selectedIds.length === 2) {
    const [a, b] = selectedIds;
    const existing = links.find(
      (l) => (l.from === a && l.to === b) || (l.from === b && l.to === a)
    );
    if (existing) {
      canAssign = true;
      assignTargetType = "cordon";
      assignTargetId = existing.id;
    }
  }

  // Affichage des AR assignés
  let assignedARs = [];
  if (selectedIds.length === 1) {
    const b = bubbles?.find((b) => b.id === selectedIds[0]);
    if (b?.arIds && b.arIds.length > 0) {
      assignedARs = resources.filter((ar) => b.arIds.includes(ar.id));
    }
  } else if (selectedIds.length === 2) {
    const [a, b] = selectedIds;
    const link = links?.find(
      (l) => (l.from === a && l.to === b) || (l.from === b && l.to === a)
    );
    if (link?.arIds && link.arIds.length > 0) {
      assignedARs = resources.filter((ar) => link.arIds.includes(ar.id));
    }
  }

  return (
    <div
      ref={menuRef}
      onMouseDown={startDrag}
      onMouseMove={onDrag}
      onMouseUp={endDrag}
      onTouchStart={(e) => startDrag(e.touches[0])}
      onTouchMove={(e) => onDrag(e.touches[0])}
      onTouchEnd={endDrag}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        background: "rgba(255,255,255,0.7)",
        padding: "10px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        fontFamily: "sans-serif",
        zIndex: 1,
        minWidth: 130,
        userSelect: "none",
        touchAction: "none",
        cursor: dragging ? "grabbing" : "grab",
        backdropFilter: "blur(4px)",
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: "bold" }}>🛠️ Outils Réso•°</div>

      <button
        onClick={() => setLinkEditMode(!linkEditMode)}
        style={{
          background: linkEditMode ? "lightgreen" : "white",
          border: "1px solid #aaa",
          padding: 4,
          borderRadius: 4,
          fontSize: 12,
          marginBottom: 8,
          width: "100%",
        }}
      >
        {linkEditMode ? "Mode Liens ✔" : "Mode Cordon Résonant"}
      </button>

      {selectedIds.length === 1 && (
        <>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <button onClick={() => resizeSelected(+10)}><Plus size={16} /></button>
            <button onClick={() => resizeSelected(-10)}><Minus size={16} /></button>
            <button onClick={duplicateSelected}><Copy size={16} /></button>
            <button onClick={deleteSelected}><Trash2 size={16} /></button>
            <button onClick={colorizeSelected}><PaintBucket size={16} /></button>
          </div>
          <div style={{ marginBottom: 6 }}>
            <input
              type="number"
              value={sizeInput}
              onChange={(e) => setSizeInput(Number(e.target.value))}
              onBlur={() => resizeSelected(sizeInput)}
              placeholder="Taille"
              style={{ width: "100%", fontSize: 12 }}
            />
          </div>
        </>
      )}

      {selectedIds.length === 2 && (
        <>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <button onClick={createLinkBetweenSelected}><Link2 size={16} /></button>
            <button onClick={increaseLinkThickness}><Plus size={16} /></button>
            <button onClick={decreaseLinkThickness}><Minus size={16} /></button>
          </div>
          <div style={{ marginBottom: 6 }}>
            <input
              type="number"
              value={cordonInput}
              onChange={(e) => setCordonInput(Number(e.target.value))}
              onBlur={() => updateLinkThickness(cordonInput)}
              placeholder="Épaisseur du cordon gps"
              style={{ width: "100%", fontSize: 12 }}
            />
          </div>
        </>
      )}

      {/* --- BOUTON D’ASSIGNATION ET AR RÉSONNANTS --- */}
      {canAssign && (
        <>
          <button
            onClick={() => {
              openAssignationModal(assignTargetId, assignTargetType);
              showConfirm(
                assignTargetType === "bulle"
                  ? "🎭 Assignation à la bulle"
                  : "🎭 Assignation au cordon"
              );
            }}
            style={{
              fontSize: 12,
              marginTop: 6,
              width: "100%",
              background: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: 4,
              padding: "8px 0",
            }}
          >
            🎭 Associer son ART (Acteur Ressource Transnumériste )
          </button>

          <div style={{ marginTop: 6 }}>
            {assignedARs.length > 0 ? (
              <div className="text-xs text-gray-700">
                <b>ART associés:</b>
                <ul>
                  {assignedARs.map((ar) => (
                    <li key={ar.id}>
                      {ar.label || ar.nom || ar.id}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <span className="text-xs text-gray-400">
                Aucun ART pour l’instant.
              </span>
            )}
          </div>
        </>
      )}

      {confirm && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "green",
            textAlign: "center",
          }}
        >
          {confirm}
        </div>
      )}
    </div>
  );
}