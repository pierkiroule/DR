import { useState, useEffect, useRef } from "react";
import { ref, push, onValue, remove } from "firebase/database";
import { db } from "../../firebase";
import { useGlobalContext } from "../../context/GlobalContext";
import DesignSetComposer from "./DesignSetComposer";

const CLOUD_NAME = "dmi4nm3ro";
const UPLOAD_PRESET = "BubMap";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

const detectType = (url) => {
  const ext = url.split(".").pop().toLowerCase();
  if (url.includes("soundcloud") || ext === "mp3") return "audio";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "web";
};

export default function ARLibraryModal({ isOpen, onClose, onSelect, sessionCode }) {
  const { resources = [], setResources } = useGlobalContext();
  const [tab, setTab] = useState("import");
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [previewUrls, setPreviewUrls] = useState([]);
  const [showComposer, setShowComposer] = useState(false);
  const fileInputRef = useRef();
  const [designSetTemp, setDesignSetTemp] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const arRef = ref(db, "arlibrary");
    const unsubscribe = onValue(arRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, value]) => ({ id, ...value }));
      setResources(list.reverse());
    });
    return () => unsubscribe();
  }, [isOpen]);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadMsg("⏳ Envoi en cours...");

    if (file.type === "text/plain") {
      try {
        const text = await file.text();
        const urls = text.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("http"));
        setPreviewUrls(urls);
        setUploadMsg(`🔍 ${urls.length} lien(s) détecté(s)`);
      } catch {
        setUploadMsg("❌ Erreur fichier texte");
      } finally {
        setUploading(false);
      }
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await res.json();
      const url = data.secure_url;
      const type = detectType(url);
      const label = file.name.slice(0, 20);
      const ar = { url, type, label, content: "", tag: "", createdAt: Date.now() };
      push(ref(db, "arlibrary"), ar);
      setUploadMsg("✅ Importation réussie !");
    } catch {
      setUploadMsg("❌ Échec d’import");
    } finally {
      setUploading(false);
    }
  };

  const validerImportTxt = async () => {
    for (const url of previewUrls) {
      const type = detectType(url);
      const ar = {
        url,
        type,
        label: url.slice(0, 30),
        content: "",
        tag: "",
        createdAt: Date.now(),
      };
      await push(ref(db, "arlibrary"), ar);
    }
    setUploadMsg("✅ URLs ajoutées");
    setPreviewUrls([]);
  };

  const viderBibliotheque = async () => {
    const ok = confirm("🧹 Supprimer tous les fichiers ?");
    if (!ok) return;
    await remove(ref(db, "arlibrary"));
  };

  if (!isOpen) return null;
  
  const isInSet = (id) => designSetTemp.some((r) => r.id === id);

const toggleInSet = (res) => {
  setDesignSetTemp((prev) =>
    isInSet(res.id)
      ? prev.filter((r) => r.id !== res.id)
      : [...prev, res]
  );
};

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-indigo-600">🎒 Bibliothèque AR</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-xl">✖</button>
        </div>

        <div className="flex mb-4 border-b">
          <button onClick={() => setTab("import")} className={`px-4 py-2 text-sm ${tab === "import" ? "border-b-2 border-indigo-500 font-bold" : "text-gray-500"}`}>
            ➕ Importer
          </button>
          <button onClick={() => setTab("bibliotheque")} className={`px-4 py-2 text-sm ${tab === "bibliotheque" ? "border-b-2 border-indigo-500 font-bold" : "text-gray-500"}`}>
            📁 Fichiers
          </button>
        </div>

        {tab === "import" && (
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*,video/*,audio/*,application/pdf,text/plain"
              ref={fileInputRef}
              onChange={(e) => handleUpload(e.target.files[0])}
            />
            {uploadMsg && <p className="text-sm text-blue-600">{uploadMsg}</p>}

            {previewUrls.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-bold text-indigo-600">🧾 Liens détectés :</p>
                <ul className="max-h-32 overflow-y-auto text-xs list-disc list-inside">
                  {previewUrls.map((url, i) => (
                    <li key={i}>
                      <a href={url} className="text-blue-600 underline" target="_blank" rel="noreferrer">{url}</a>
                    </li>
                  ))}
                </ul>
                <button onClick={validerImportTxt} className="px-4 py-2 text-sm bg-green-600 text-white rounded">
                  ✅ Valider l'import
                </button>
              </div>
            )}
          </div>
        )}

        {tab === "bibliotheque" && (
          <>
         <div className="max-h-[40vh] overflow-y-auto space-y-2">
<div className="max-h-[40vh] overflow-y-auto space-y-2">
  {resources.map((res) => (
    <div key={res.id} className="border p-2 rounded shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-sm">{res.name}</span>
        <div className="flex items-center gap-2">
          <a
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline text-xs"
          >
            🌐 Ouvrir
          </a>
          {onSelect && (
            <button
              onClick={() => toggleInSet(res)}
              className={`ml-4 text-xs underline ${
                isInSet(res.id) ? "text-red-600" : "text-green-600"
              }`}
            >
              {isInSet(res.id) ? "− Retirer" : "+ Ajouter"}
            </button>
          )}
        </div>
      </div>
    </div>
  ))}
</div>
            </div>

            <div className="mt-4 flex flex-col items-end gap-2">
              <button
                onClick={() => setShowComposer(true)}
                className="text-sm px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                🎨 Composer un DesignSet
              </button>

              <button
                onClick={viderBibliotheque}
                className="text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                🧹 Vider la bibliothèque
              </button>
            </div>
          </>
        )}

        {showComposer && (
          <DesignSetComposer
  resources={designSetTemp}
  sessionCode={sessionCode}
  onClose={() => setShowComposer(false)}
/>
        )}
      </div>
    </div>
  );
}