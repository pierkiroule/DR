import { useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext";

export default function DesignSetComposer({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const {
    sessionCode,
    pseudo,
    resources,
    saveDesignSetToFirebase,
    selectedResources,
    setSelectedResources,
    toggleResourceInSet
  } = useGlobalContext();

  const handleSave = () => {
    if (!title.trim()) {
      setError("⚠️ Le titre est requis.");
      return;
    }

    saveDesignSetToFirebase({
      title,
      description,
      items: selectedResources,
      sessionCode,
      createdBy: pseudo || "anonyme",
    });

    onClose();
  };

  const renderPreview = (r) => {
    if (r.type === "image") return <img src={r.url} alt={r.label} className="h-16 rounded" />;
    if (r.type === "audio") return <audio src={r.url} controls className="w-full" />;
    if (r.type === "video") return <video src={r.url} controls className="h-20 w-auto rounded" />;
    if (r.type === "pdf") return <div className="text-xs text-gray-500">📄 PDF</div>;
    return (
      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
        🌐 Ouvrir lien
      </a>
    );
  };

  const isSelected = (r) => selectedResources.some((s) => s.id === r.id);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-indigo-600 mb-4">🎨 Composer un DesignSet</h2>

        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
          placeholder="Titre du DesignSet"
          className="w-full mb-2 border px-3 py-1 rounded text-sm"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (facultative)"
          className="w-full mb-4 border px-3 py-2 rounded text-sm"
          rows={2}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {resources.map((r) => (
            <div key={r.id} className="flex items-start gap-3 p-2 border rounded relative">
              <div className="flex-1">
                <div className="font-semibold text-sm">{r.label || "Sans titre"}</div>
                <div className="text-xs text-gray-500">{r.type}</div>
                {renderPreview(r)}
              </div>
              <button
                onClick={() => toggleResourceInSet(r)}
                className={`text-xs font-bold px-2 py-1 rounded ${
                  isSelected(r)
                    ? "bg-red-100 text-red-600 border border-red-400"
                    : "bg-green-100 text-green-600 border border-green-400"
                }`}
              >
                {isSelected(r) ? "– Retirer" : "+ Ajouter"}
              </button>
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mt-4 italic">{error}</p>}

        <div className="mt-6 flex justify-between items-center">
          <span className="text-sm italic text-gray-500">
            {selectedResources.length} élément(s) sélectionné(s)
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
            >
              ✖ Annuler
            </button>
            <button
              onClick={handleSave}
              className="text-sm px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              💾 Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}