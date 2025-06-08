import { useState } from "react";
import PadLibrary from "./PadLibrary";
import PadGrid from "./PadGrid";
import { useGlobalContext } from "../../context/GlobalContext";

export default function PadPage() {
  const { sessionCode, pseudo, resources = [], pads, assignPad, groups } = useGlobalContext();
  const [editPadIdx, setEditPadIdx] = useState(null);

  const [selectedAR, setSelectedAR] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("");

  // Ouvre la modale, pré-remplit si déjà affecté
  const openEditPad = (idx) => {
    setEditPadIdx(idx);
    setSelectedAR(pads[idx]?.ar || null);
    setSelectedGroup(pads[idx]?.groupId || "");
  };

  // Assigner AR + groupe au pad
  const handleAssign = async () => {
    if (!selectedAR) return;
    await assignPad(editPadIdx, { ar: selectedAR, groupId: selectedGroup });
    setEditPadIdx(null);
    setSelectedAR(null);
    setSelectedGroup("");
  };

  // Vide un pad
  const handleClearPad = (idx) => {
    assignPad(idx, null);
  };

  // Simule la diffusion
  const handlePlayPad = (pad) => {
    alert(
      `▶️ Diffusion AR: ${pad?.ar?.label || pad?.ar?.nom || pad?.ar?.id || "(vide)"}\nGroupe: ${groups.find(g => g.id === pad?.groupId)?.name || "aucun"}`
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen bg-gray-50 p-4">
      <h3 className="mb-2 font-bold text-lg text-indigo-800">🎛️ Pad DJ Live (AR + Groupe)</h3>
      <div className="text-sm mb-4 text-gray-500">
        <b>Session :</b> {sessionCode || "aucune"}<br />
        <b>Utilisateur :</b> {pseudo || "Anonyme"}
      </div>

      {/* Grille toujours visible */}
      <PadGrid
        pads={pads}
        groups={groups}
        onClickPad={openEditPad}
        onClearPad={handleClearPad}
        onPlayPad={handlePlayPad}
        activeIdx={editPadIdx}
      />

      {/* Modale assignation */}
      {editPadIdx !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-2xl p-5 shadow-lg max-w-xs w-full relative">
            <div className="mb-3 font-bold text-indigo-800">📚 Sélectionne AR et groupe</div>
            <PadLibrary
              resources={resources}
              selectedAR={selectedAR}
              onSelect={setSelectedAR}
            />
            <div className="my-3">
              <label className="block text-sm font-medium text-gray-700">Groupe :</label>
              <select
                className="mt-1 w-full border rounded px-2 py-1"
                value={selectedGroup}
                onChange={e => setSelectedGroup(e.target.value)}
              >
                <option value="">— Aucun —</option>
                {groups.map((g, i) =>
                  <option key={g.id || g.name} value={g.id || g.name}>
                    {g.name}
                  </option>
                )}
              </select>
            </div>
            <button
              onClick={handleAssign}
              className={`w-full mt-2 py-2 rounded-lg font-bold ${selectedAR ? "bg-indigo-600 text-white" : "bg-gray-300 text-gray-500"}`}
              disabled={!selectedAR}
            >
              ✅ Assigner à ce pad
            </button>
            <button
              onClick={() => setEditPadIdx(null)}
              className="w-full mt-2 py-2 rounded-lg text-indigo-700 bg-indigo-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}