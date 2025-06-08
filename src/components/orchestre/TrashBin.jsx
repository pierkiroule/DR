import { useEffect, useState } from "react";
import { ref, onValue, remove, set } from "firebase/database";
import { db } from "../../firebase";
import { toast } from "sonner";

export default function TrashBin({ onClose }) {
  const [trashed, setTrashed] = useState([]);

  useEffect(() => {
    const trashRef = ref(db, "trash");
    const now = Date.now();
    const delay = 3600000; // 1h

    const unsubscribe = onValue(trashRef, (snap) => {
      const data = snap.val() || {};
      const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setTrashed(list.sort((a, b) => b.trashedAt - a.trashedAt));

      // Suppression auto
      Object.entries(data).forEach(([id, val]) => {
        if (val.trashedAt && now - val.trashedAt > delay) {
          remove(ref(db, `trash/${id}`));
        }
      });
    });

    return () => unsubscribe();
  }, []);

  const handleRestore = (ar) => {
    const restoreRef = ref(db, `arlibrary/${ar.id}`);
    set(restoreRef, { ...ar, createdAt: Date.now() })
      .then(() => remove(ref(db, `trash/${ar.id}`)))
      .then(() => toast.success("♻️ Ressource restaurée"));
  };

  const handlePermanentDelete = (id) => {
    if (window.confirm("Supprimer définitivement cette ressource ?")) {
      remove(ref(db, `trash/${id}`));
      toast.success("💥 Supprimée définitivement");
    }
  };

  const handleEmptyTrash = () => {
    if (!trashed.length) return;
    if (window.confirm("Vider entièrement la corbeille ?")) {
      trashed.forEach((item) => remove(ref(db, `trash/${item.id}`)));
      toast.success("🧹 Corbeille vidée");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-auto">
      <div className="bg-white w-full max-w-3xl rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600">
            🗃️ Corbeille (Auto-suppression après 1h)
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">
            ✖
          </button>
        </div>

        {trashed.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="text-sm text-red-600 mb-4 hover:underline"
          >
            🔥 Vider la corbeille
          </button>
        )}

        <div className="space-y-3">
          {trashed.map((ar) => (
            <div
              key={ar.id}
              className="border p-3 rounded flex justify-between items-start shadow-sm hover:shadow-md"
            >
              <div className="flex-1">
                <p className="font-semibold text-indigo-700">{ar.label || "🌱 Sans titre"}</p>
                <p className="text-sm italic text-gray-600">{ar.content?.slice(0, 100)}…</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => handleRestore(ar)}
                  className="text-green-600 text-sm"
                >
                  ♻️ Restaurer
                </button>
                <button
                  onClick={() => handlePermanentDelete(ar.id)}
                  className="text-red-500 text-sm"
                >
                  🧨 Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>

        {trashed.length === 0 && (
          <p className="text-center text-gray-500 italic mt-6">La corbeille est vide</p>
        )}
      </div>
    </div>
  );
}