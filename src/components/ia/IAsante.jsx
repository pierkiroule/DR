import { useEffect, useState } from "react";

export function analyserIAme(texte, inputs) {
  if (!texte) return {};

  const texteMin = texte.toLowerCase();

  const gps = [47.2173, -1.5534]; // Nantes (exemple)
  const textes = texteMin.split(/[.!?]\s+/).filter(t => t.length > 20);
  const resume = [];

  const motsCulture = ["chapelle", "forêt", "dolmen", "lavoir", "ruine", "colline"];
  motsCulture.forEach(mot => {
    if (texteMin.includes(mot)) resume.push(mot);
  });

  const scores = {
    ancrageLocal: /(?:\b(?:bourg|forêt|chapelle|colline|source|ruine|église|lavoir|menhir|dolmen|falaise)\b)/.test(texteMin) ? 1 : 0,
    symbolisation: (texteMin.match(/\b(âme|lien|souffle|souvenir|racine|murmure|voix|mémoire)\b/g) || []).length,
    narration: /(il était une fois|lorsqu|un jour|jusqu’à|depuis ce jour)/.test(texteMin) ? 1 : 0,
    commentairesRecyclés: inputs.commentairesAR || inputs.commentairesParticipants ? 1 : 0,
    gps,
    textes,
    resume,
  };

  scores.total = scores.ancrageLocal + scores.narration + scores.commentairesRecyclés + Math.min(2, scores.symbolisation);

  return scores;
}

export default function IAsante({ texte, inputs }) {
  const [diagnostic, setDiagnostic] = useState({});

  useEffect(() => {
    setDiagnostic(analyserIAme(texte, inputs));
  }, [texte, inputs]);

  const toScore = (v) => (v > 0 ? "🟢" : "⚪");

  return (
    <div className="bg-white rounded p-4 shadow mt-4">
      <h3 className="font-semibold mb-2">🧭 Vitalité de l'IÂme</h3>
      <ul className="text-sm space-y-1">
        <li>{toScore(diagnostic.ancrageLocal)} Ancrage dans le territoire</li>
        <li>{toScore(diagnostic.symbolisation)} Richesse symbolique ({diagnostic.symbolisation || 0})</li>
        <li>{toScore(diagnostic.narration)} Structure narrative présente</li>
        <li>{toScore(diagnostic.commentairesRecyclés)} Résonance sociale</li>
      </ul>
      {typeof diagnostic.total === "number" && (
        <p className="mt-3 text-xs text-gray-500">
          Score global : {diagnostic.total} / 5
        </p>
      )}
    </div>
  );
}