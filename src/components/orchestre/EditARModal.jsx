import { useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import { X, Trash2 } from "lucide-react";

export default function EditARModal({ ar, onClose }) {
  // ⚠️ Prends SEULEMENT updateResource et deleteResource ici
  const { updateResource, deleteResource } = useGlobalContext();

  const [label, setLabel] = useState(ar?.label || "");
  const [description, setDescription] = useState(ar?.description || "");

  const source = ar?.url || ar?.src || ar?.data;
  const type = ar?.type || "text";

  const handleSave = async () => {
    if (!ar?.id) return alert("Erreur : ID manquant");
    await updateResource(ar.id, {
      ...ar,
      label: label.trim(),
      description: description.trim(),
    });
    onClose("updated");
  };

  const handleDelete = async () => {
    if (!ar?.id) return;
    await deleteResource(ar.id);
    onClose("deleted");
  };

  const renderPreview = () => {
    if (!source) return <p className="text-xs italic text-gray-400">Aucun contenu.</p>;

    switch (type) {
      case "text":
        return <pre className="text-xs p-2 bg-gray-100 rounded whitespace-pre-wrap">{source}</pre>;
      case "image":
        return <img src={source} alt="Aperçu" className="w-full max-h-64 object-contain rounded" />;
      case "audio":
        return <audio controls className="w-full mt-2"><source src={source} /></audio>;
      case "video":
        return <video controls className="w-full max-h-64 mt-2 rounded"><source src={source} /></video>;
      case "pdf":
        return (
          <>
            <iframe src={source} className="w-full h-64 rounded border mt-2" />
            <a href={source} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 underline block mt-1">📄 Ouvrir le PDF</a>
          </>
        );
      case "web":
        return (
          <>
            <iframe src={source} className="w-full h-64 rounded border mt-2" />
            <a href={source} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 underline block mt-1">🌐 Accéder au site</a>
          </>
        );
      default:
        return <p className="text-xs italic text-gray-400">Type non pris en charge.</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-5 rounded-xl shadow-lg w-full max-w-lg space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-indigo-700">✏️ Modifier l’AR</h3>
          <button onClick={() => onClose()} className="text-gray-500 hover:text-black">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-gray-600">Titre</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-600">Type</label>
            <input
              type="text"
              value={type}
              disabled
              className="w-full border px-2 py-1 rounded bg-gray-100 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-600">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        </div>

        {/* Aperçu */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">🔍 Aperçu</h4>
          <div className="border p-2 rounded bg-gray-50">{renderPreview()}</div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleDelete}
            className="text-sm px-3 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded flex items-center gap-1"
          >
            <Trash2 size={14} /> Supprimer
          </button>
          <button
            onClick={handleSave}
            className="ml-auto text-sm px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            ✅ Valider
          </button>
        </div>
      </div>
    </div>
  );
}