import { useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import ARLibraryModal from "./orchestre/ARLibraryModal";
import EditARModal from "./orchestre/EditARModal";
import { Pencil, Trash2 } from "lucide-react";

export default function Orchestrator() {
  const {
    sessionCode,
    sessionMeta,
    resources = [],
    deleteResource,
  } = useGlobalContext() || {};

  const [showLibrary, setShowLibrary] = useState(false);
  const [editingARId, setEditingARId] = useState(null);
  const [feedback, setFeedback] = useState(null); // "updated" | "deleted"

  const handleDelete = (arId) => {
    if (!deleteResource) return;
    const confirm = window.confirm("Supprimer définitivement cet ART?");
    if (confirm) deleteResource(arId);
  };

  const handleModalClose = (action) => {
    setEditingARId(null);
    if (action === "updated" || action === "deleted") {
      setFeedback(action);
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const renderFeedback = () => {
    if (feedback === "updated") {
      return (
        <div className="mb-4 px-4 py-2 bg-green-100 text-green-800 border border-green-300 rounded text-sm">
          ✅  ART modifié avec succès
        </div>
      );
    }
    if (feedback === "deleted") {
      return (
        <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded text-sm">
          🗑️ART supprimé
        </div>
      );
    }
    return null;
  };

  const renderPreview = (ar) => {
    const src = ar?.url || ar?.src;
    if (!src) return null;

    const preview = {
      audio: <audio controls src={src} className="w-full mt-2" />,
      video: <video controls src={src} className="w-full mt-2 rounded" />,
      image: <img src={src} alt={ar.label} className="w-full mt-2 rounded shadow" />,
      pdf: (
        <a href={src} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs underline mt-2">
          📄 Ouvrir le document PDF
        </a>
      ),
      url: (
        <a href={src} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs underline mt-2">
          🌐 Accéder au lien externe
        </a>
      ),
    };

    return preview[ar.type] || null;
  };

  return (
    <div className="p-4 text-sm text-gray-800">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">🎛 Acteurs Ressources Transnuméristes</h2>

      {renderFeedback()}

      {/* Commandes */}
      <div className="mb-4">
        <button
          onClick={() => setShowLibrary(true)}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          📥 Ouvrir la bibliothèque d’ART
        </button>
      </div>

      {/* Infos session */}
      <p>
        <strong>Session :</strong> {sessionCode || "–"}
      </p>
      {sessionMeta && (
        <p>
          <strong>Nom :</strong> {sessionMeta.name} —{" "}
          <strong>Par :</strong> {sessionMeta.createdBy}
        </p>
      )}

      {/* Liste des AR */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">📚 AR disponibles</h3>

        {resources.length === 0 ? (
          <p className="text-gray-400 italic">Aucun AR chargé.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resources.map((ar) => (
              <div
                key={ar.id}
                className="border border-gray-300 p-3 rounded bg-white shadow-sm flex flex-col gap-1"
              >
                <div className="flex justify-between items-center">
                  <div className="text-sm font-semibold">
                    {ar.label || "Sans titre"}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingARId(ar.id)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Modifier l’AR"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(ar.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Supprimer l’AR"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  <strong>Type :</strong> {ar.type || "—"}
                </div>
                {ar.description && (
                  <div className="text-xs text-gray-500 mt-1 italic">
                    {ar.description}
                  </div>
                )}
                {renderPreview(ar)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      {showLibrary && (
        <ARLibraryModal
          isOpen={true}
          onClose={() => setShowLibrary(false)}
          sessionCode={sessionCode}
        />
      )}

      {editingARId && (
        <EditARModal
          ar={resources.find((r) => r.id === editingARId)}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}