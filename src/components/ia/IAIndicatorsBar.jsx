export default function IAIndicatorsBar({ diagnostic }) {
  return (
    <div className="bg-gray-50 rounded p-3 mb-4 shadow text-sm">
      <h3 className="font-semibold mb-2">🔍 Indicateurs d'inspiration</h3>
      <ul className="space-y-1">
        <li>📍 Position GPS : {diagnostic.gps?.join(", ")}</li>
        <li>🏛️ Patrimoines culturels : {diagnostic.resume?.join(", ") || "Aucun repéré"}</li>
        <li>📚 Mythes et légendes : {diagnostic.mythes ? "Oui" : "Non"}</li>
        <li>💬 Commentaires intégrés : {diagnostic.commentairesRecyclés ? "Oui" : "Non"}</li>
      </ul>
    </div>
  );
}