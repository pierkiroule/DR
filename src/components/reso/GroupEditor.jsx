import { useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext";

export default function GroupEditor() {
  const {
    groups = [],
    addGroup,
    addMemberToGroup,
    removeGroup,
    removeMemberFromGroup,
  } = useGlobalContext();

  const [newName, setNewName] = useState("");
  const [newMember, setNewMember] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [busy, setBusy] = useState(false);

  // Ajout d’un groupe (anti-doublon, anti-double-clic, id correct)
  const handleAddGroup = async () => {
    const trimmed = newName.trim();
    if (!trimmed || busy) return;
    if (groups.some(g => g.name.toLowerCase() === trimmed.toLowerCase())) {
      alert("Ce nom de groupe existe déjà.");
      return;
    }
    setBusy(true);
    try {
      // Passe bien l’objet groupe complet
      await addGroup({ name: trimmed, id: "g_" + Date.now(), members: [] });
      setNewName("");
    } catch (e) {
      alert("Erreur lors de l'ajout.");
    }
    setBusy(false);
  };

  // Ajout d’un membre au groupe sélectionné
  const handleAddMember = async (groupIdx) => {
    const trimmed = newMember.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    try {
      await addMemberToGroup(groupIdx, trimmed);
      setNewMember("");
    } catch (e) {
      alert("Erreur lors de l'ajout du membre.");
    }
    setBusy(false);
  };

  return (
    <div className="w-full p-4 rounded-xl shadow bg-gray-50 mt-2">
      <h3 className="font-bold mb-2">👥 Groupes et participants</h3>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 mb-4">
        <input
          className="border rounded px-2 py-1 text-sm w-full sm:w-auto"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Nom du groupe"
        />
        <button
          className="bg-indigo-600 text-white px-3 py-1 rounded text-sm disabled:opacity-60"
          onClick={handleAddGroup}
          disabled={busy || !newName.trim()}
        >
          {busy ? "Ajout..." : "Ajouter groupe"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {groups.map((group, i) => (
          <div key={group.id || i} className="border p-3 rounded bg-white">
            <div className="flex items-center mb-2">
              <span className="font-semibold">{group.name}</span>
              <button
                className={`ml-2 text-xs px-2 py-1 rounded ${selectedGroup === i ? "bg-indigo-100" : "bg-gray-200"}`}
                onClick={() => setSelectedGroup(selectedGroup === i ? null : i)}
              >
                {selectedGroup === i ? "Annuler" : "Ajouter membre"}
              </button>
              <button
                onClick={() => removeGroup(i)}
                className="ml-2 text-xs px-2 py-1 bg-red-100 rounded text-red-600"
                disabled={busy}
              >Suppr</button>
            </div>
            <ul className="list-disc ml-5 mb-2">
              {group.members?.length === 0 && <li className="text-gray-400">Aucun membre</li>}
              {group.members?.map((m, j) => (
                <li key={j} className="flex items-center">
                  {m}
                  <button
                    onClick={() => removeMemberFromGroup(i, j)}
                    className="ml-2 text-xs text-red-500"
                    disabled={busy}
                  >✕</button>
                </li>
              ))}
            </ul>
            {selectedGroup === i && (
              <div className="flex gap-2 mt-2">
                <input
                  className="border rounded px-2 py-1 text-sm w-full"
                  value={newMember}
                  onChange={e => setNewMember(e.target.value)}
                  placeholder="Nom du membre"
                />
                <button
                  className="bg-indigo-500 text-white px-3 py-1 rounded text-sm disabled:opacity-60"
                  onClick={() => handleAddMember(i)}
                  disabled={busy || !newMember.trim()}
                >Ajouter</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}