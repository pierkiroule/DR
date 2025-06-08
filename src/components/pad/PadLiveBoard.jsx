import { useState } from "react";
import PadGrid from "./pad/PadGrid";
import PadLibrary from "./pad/PadLibrary";

export default function PadLiveBoard() {
  const [editMode, setEditMode] = useState(true);
  const [padARs, setPadARs] = useState(Array(8).fill(null));
  const [dragAR, setDragAR] = useState(null);
  const [editingIdx, setEditingIdx] = useState(null);

  // Fake data (remplacer par contexte plus tard)
  const fakeResources = [
    { id: "ar1", label: "AR Océan", description: "Ambiance relaxante." },
    { id: "ar2", label: "AR Forêt", description: "Forêt magique." },
    // ...
  ];

  // Ouvre la modale d'assignation
  const handleEditPad = idx => setEditingIdx(idx);

  // Assigne l'AR sélectionné à la case editingIdx
  const handleAssignAR = (ar) => {
    if (editingIdx === null) return;
    setPadARs(prev => prev.map((p, i) => (i === editingIdx ? ar : p)));
    setEditingIdx(null);
  };

  // Vide un pad sans casser la grille
  const handleClearPad = (idx) => {
    setPadARs(prev => prev.map((p, i) => (i === idx ? null : p)));
  };

  // Drag and drop rapide pour assigner (mobile ready)
  const handleDropAR = (ar, idx) => {
    setPadARs(prev => prev.map((p, i) => (i === idx ? ar : p)));
    setDragAR(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen bg-gray-50 p-4">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="flex-1 font-extrabold text-xl tracking-tight text-gray-900">
          🎹 Pads Live
          <span className="ml-2 text-indigo-600 text-base font-semibold">(x{padARs.length})</span>
        </h2>
        <button
          onClick={() => setEditMode(e => !e)}
          className={`transition px-4 py-2 rounded-lg font-bold text-base shadow
            ${editMode ? "bg-indigo-600 text-white" : "bg-gray-200 text-indigo-700"}
          `}
        >
          {editMode ? "✅ Terminer" : "🖉 Éditer"}
        </button>
      </div>

      {/* Bibliothèque affichée seulement en édition */}
      {editMode && (
        <div className="mb-4">
          <PadLibrary
            resources={fakeResources}
            onStartDrag={ar => setDragAR(ar)}
            onSelectAR={ar => setDragAR(ar)}
          />
        </div>
      )}

      <PadGrid
        pads={padARs}
        editMode={editMode}
        onEditPad={handleEditPad}
        onClearPad={handleClearPad}
        dragAR={dragAR}
        onDropAR={handleDropAR}
      />

      {/* Modal simple d'assignation */}
      {editingIdx !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-xs w-full">
            <div className="mb-4 text-lg font-bold text-gray-700">Sélectionner un AR</div>
            <div className="grid gap-2">
              {fakeResources.map(ar =>
                <button
                  key={ar.id}
                  onClick={() => handleAssignAR(ar)}
                  className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg px-4 py-2 text-left"
                >
                  <div className="font-semibold">{ar.label}</div>
                  <div className="text-xs text-gray-500">{ar.description}</div>
                </button>
              )}
            </div>
            <button
              className="mt-6 text-indigo-600 text-sm"
              onClick={() => setEditingIdx(null)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}