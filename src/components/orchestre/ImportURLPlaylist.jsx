import { useState } from "react";
import { db } from "../../firebase";
import { ref, push } from "firebase/database";
import { toast } from "sonner";
import Uploader from "./Uploader"; // ✅ importer ton composant d'upload ImageKit

const detectType = (url) => {
  const ext = url.split(".").pop().toLowerCase();
  if (url.includes("soundcloud") || ext === "mp3") return "audio";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "web";
};

const extractName = (url) => {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    return hostname.replace(/\W/g, "").slice(0, 8).toLowerCase() || "ress";
  } catch {
    return "ress";
  }
};

export default function ImportURLPlaylist({ sessionCode = "", onCreate }) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setInput((prev) => `${prev.trim()}\n${content}`.trim());
      };
      reader.readAsText(file);
    } else {
      alert("Merci de fournir un fichier .txt");
    }
  };

  const handleImport = async () => {
    const urls = input
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.startsWith("http"));

    if (urls.length === 0) {
      setStatus("⚠️ Aucune URL valide détectée.");
      return;
    }

    setLoading(true);
    setStatus("⏳ Import en cours...");
    setResults([]);
    setProgress({ done: 0, total: urls.length });

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const type = detectType(url);
      const name = extractName(url);
      const ar = {
        session: sessionCode,
        url,
        type,
        content: name,
        createdAt: Date.now(),
      };
      try {
        const refNew = await push(ref(db, "arlibrary"), ar);
        onCreate?.({ id: refNew.key, ...ar });
        setResults((prev) => [...prev, { url, status: "✅ Ajouté" }]);
      } catch (e) {
        console.error(e);
        setResults((prev) => [...prev, { url, status: "❌ Erreur" }]);
      }
      setProgress({ done: i + 1, total: urls.length });
    }

    setLoading(false);
    setStatus("✅ Terminé. Liens ajoutés.");
    toast.success(`✅ ${urls.length} ressources ajoutées à la bibliothèque`);
  };

  return (
    <div className="h-screen w-full overflow-y-auto p-4 bg-white">
      <div className="max-w-lg mx-auto flex flex-col gap-4">

        <h2 className="text-xl font-bold text-blue-700">
          📁 Importer des Acteurs-Ressources
        </h2>

        <Uploader sessionCode={sessionCode} onCreate={onCreate} />

        <div className="text-sm text-gray-600">
          Ou collez des URLs ou un fichier `.txt` :
        </div>

        <textarea
          rows={5}
          placeholder="http://exemple1.com\nhttp://exemple2.com"
          className="w-full border p-2 rounded resize-none text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          className="text-sm"
        />

        <div className="flex gap-2">
          <button
            onClick={handleImport}
            disabled={loading}
            className={`flex-1 px-4 py-2 text-sm text-white rounded ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Import..." : "Ajouter les liens"}
          </button>
          <button
            onClick={() => {
              setInput("");
              setResults([]);
              setStatus("");
              setProgress({ done: 0, total: 0 });
            }}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Réinitialiser
          </button>
        </div>

        <div className="text-sm text-gray-500">{status}</div>

        {loading && progress.total > 0 && (
          <p className="text-sm text-indigo-600 animate-pulse">
            ⏱️ {progress.done} / {progress.total} (
            {Math.round((progress.done / progress.total) * 100)}%)
          </p>
        )}

        <div className="max-h-48 overflow-y-auto border-t pt-2 text-sm space-y-1">
          {results.map((r, i) => (
            <div key={i} className="flex items-start gap-1">
              <span className="font-mono text-blue-700 break-all">{r.url}</span>
              <span className="text-gray-600">— {r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}