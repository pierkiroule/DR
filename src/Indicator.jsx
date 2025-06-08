// Indicator.jsx
import { useGlobalContext } from "./context/GlobalContext";

export default function Indicator({ meta, participants }) {
  const { bubbles, links, selectedIds, sessionCode } = useGlobalContext();

  // Fonctions simples de vérification
  const isOk = (condition) => condition ? "✅" : "⚠️";

  return (
    <div className="bg-white p-4 rounded-lg shadow text-sm text-black space-y-1">
      <p><strong>Session :</strong> {isOk(!!sessionCode)} {sessionCode || "–"}</p>
      <p><strong>Nom session :</strong> {isOk(!!meta?.name)} {meta?.name || "…"}</p>
      <p><strong>Créé par :</strong> {isOk(!!meta?.createdBy)} {meta?.createdBy || "…"}</p>

      <hr className="my-2 border-gray-300" />

      <p><strong>Nb bulles :</strong> {isOk(bubbles.length > 0)} {bubbles.length}</p>
      <p><strong>Nb liens :</strong> {isOk(true)} {links.length}</p>
      <p><strong>Nb sélectionnés :</strong> {selectedIds.length}</p>

      <hr className="my-2 border-gray-300" />

      <p><strong>Participants :</strong> {isOk(participants?.length > 0)} {participants?.join(", ") || "aucun"}</p>

      <hr className="my-2 border-gray-300" />

      {/* Prévisions évolutives */}
      <p><strong>Pad sync :</strong> {isOk(window?.padReady)} {/* booléen global fictif pour l'exemple */}</p>
      <p><strong>Carte publique :</strong> {isOk(window?.publicMapReady)} {/* fictif aussi */}</p>
    </div>
  );
}