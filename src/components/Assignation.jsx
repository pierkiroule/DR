import { useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { set, ref } from "firebase/database";
import { db } from "../firebase";
import { X } from "lucide-react";

export default function AssignationPage({ isOpen, onClose, selected }) {
  const { bubbles, links, syncFirebase, resources = [], sessionCode } = useGlobalContext();

  const [checkedARs, setCheckedARs] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isOpen || !selected) return null;

  const handleCheck = (id) => {
    setCheckedARs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (checkedARs.length === 0 || !selected || saving) return;
    setSaving(true);

    let updatedBubbles = bubbles;
    let updatedLinks = links;
    let path = "";
    let assignData = {};

    if (selected.type === "bulle") {
      updatedBubbles = bubbles.map((b) =>
        b.id === selected.id
          ? { ...b, arIds: [...new Set([...(b.arIds || []), ...checkedARs])] }
          : b
      );
      path = `sessions/${sessionCode}/bubbles`;
      assignData = updatedBubbles;
    } else if (selected.type === "cordon") {
      updatedLinks = links.map((l) =>
        l.id === selected.id
          ? { ...l, arIds: [...new Set([...(l.arIds || []), ...checkedARs])] }
          : l
      );
      path = `sessions/${sessionCode}/links`;
      assignData = updatedLinks;
    }

    try {
      await set(ref(db, path), assignData);

      setFeedback(`✅ Assignation : ${checkedARs.length} AR → ${selected.type} ${selected.id}`);
      setCheckedARs([]);

      // Update local state
      if (selected.type === "bulle") syncFirebase(assignData, links);
      if (selected.type === "cordon") syncFirebase(bubbles, assignData);

      setTimeout(() => {
        setFeedback("");
        setSaving(false);
        onClose(); // Ferme la modale ET efface la sélection
      }, 600);
    } catch (err) {
      setFeedback("❌ Erreur assignation : " + err.message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-5000 flex justify-center items-start p-8 overflow-y-auto">
      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-lg border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700">🎭 Assignation AR</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm mb-2 text-gray-700">
          Assigner un ou plusieurs AR à <strong>{selected.id}</strong> (<em>{selected.type === "bulle" ? "Bulle" : "Lien"}</em>)
        </p>
        <div className="border p-2 rounded mb-4 max-h-48 overflow-y-auto text-sm space-y-1">
          {resources.length === 0 && (
            <p className="text-xs text-gray-400">Aucun AR disponible.</p>
          )}
          {resources.map((ar) => (
            <label key={ar.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checkedARs.includes(ar.id)}
                onChange={() => handleCheck(ar.id)}
                disabled={saving}
              />
              {ar.label || ar.nom || ar.id}
            </label>
          ))}
        </div>
        <button
          className={`w-full py-2 rounded text-sm ${
            checkedARs.length === 0 || saving
              ? "bg-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
          onClick={handleAssign}
          disabled={checkedARs.length === 0 || saving}
        >
          {saving ? "Enregistrement..." : "💾 Valider l’assignation"}
        </button>
        {feedback && (
          <div className="mt-4 text-xs bg-gray-50 border rounded p-2 text-center">
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}