import { useState } from "react";
import { IKContext, IKUpload } from "imagekitio-react";
import { ref, push } from "firebase/database";
import { db } from "../../firebase";
import { toast } from "sonner";

// Détection du type
const detectType = (url) => {
  const ext = url.split(".").pop().toLowerCase();
  if (url.includes("soundcloud") || ext === "mp3") return "audio";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "web";
};

// Extraction du nom
const extractName = (url) => {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    return hostname.replace(/\W/g, "").slice(0, 8).toLowerCase() || "ress";
  } catch {
    return "ress";
  }
};

export default function Uploader({ sessionCode = "" }) {
  const [uploadedURL, setUploadedURL] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSend = async () => {
    if (!uploadedURL) return;

    const type = detectType(uploadedURL);
    const label = extractName(uploadedURL);

    const ar = {
      session: sessionCode,
      url: uploadedURL,
      type,
      label,
      tag: "",
      content: "",
      createdAt: Date.now(),
    };

    await push(ref(db, "arlibrary"), ar);
    toast.success("🎉 Ressource ajoutée à la bibliothèque !");
    setUploadedURL(null);
  };

  return (
    <IKContext
      publicKey="public_oHwD85fNv/rOVOCep4B0RI4T7bs="
      urlEndpoint="https://ik.imagekit.io/BMap"
      authenticationEndpoint="http://localhost:3001/auth" // ou IP locale
    >
      <div className="mt-4 border p-4 rounded bg-gray-50">
        <div className="mb-3 p-2 bg-blue-100 rounded text-blue-700 text-sm">
          🔹 Cliquez pour importer un fichier image, vidéo, audio ou PDF.
        </div>

        {uploadedURL ? (
          <div className="mb-2 text-sm text-green-700 bg-green-50 border border-green-300 p-2 rounded">
            ✅ Fichier prêt à être ajouté : <br />
            <a href={uploadedURL} className="underline" target="_blank" rel="noreferrer">
              {uploadedURL}
            </a>
          </div>
        ) : (
          <div className="mb-2 text-sm text-gray-500">
            Aucun fichier uploadé pour l’instant.
          </div>
        )}

        <IKUpload
          fileName={`upload_${Date.now()}`}
          onSuccess={(res) => {
            setUploadedURL(res.url);
            toast.info("📥 Upload réussi, prêt à être envoyé !");
          }}
          onError={(err) => {
            console.error(err);
            toast.error("❌ Erreur lors de l’importation");
          }}
          onUploadStart={() => {
            setUploading(true);
          }}
          onUploadEnd={() => {
            setUploading(false);
          }}
        />

        {uploadedURL && (
          <button
            onClick={handleSend}
            className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded shadow"
          >
            ✅ Envoyer dans la bibliothèque
          </button>
        )}

        {uploading && (
          <p className="mt-2 text-sm text-blue-600 italic">⏳ En cours d’upload...</p>
        )}
      </div>
    </IKContext>
  );
}