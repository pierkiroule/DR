import { useState } from "react";
import useCurrentLocation from "./ia/useCurrentLocation";
import useReverseGeocode from "./ia/useReverseGeocode";
import ZoneExplorer from "./ia/ZoneExplorer";
import Mythe from "./ia/Mythe";
import { generateIAme } from "./ia/IAEngine";
import { saveToLibrary } from "./ia/IAStorage";
import IAsante from "./ia/IAsante";

export default function IA() {
  const { coords } = useCurrentLocation();
  const locInfo = useReverseGeocode(coords);
  const [mytheKeywords, setMytheKeywords] = useState([]);
  const [inputs, setInputs] = useState({texteLibre: ""});
  const [style, setStyle] = useState("Résonance");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState("");
  const [saveOK, setSaveOK] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const context = `${inputs.texteLibre}\n${mytheKeywords.join(", ")}`;
    const result = await generateIAme({ context, keywords: [], style });
    setOutput(result);
    setLoading(false);
    setSaveOK(false);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <h1 className="text-center text-2xl font-bold mb-4">✨ IÂme du lieu</h1>

      {/* 1. Localisation GPS */}
      <ZoneExplorer />

      {/* 2. Géolocalisation texte */}
      {locInfo && (
        <p className="text-sm text-gray-600 mb-4">
          Vous êtes à : {locInfo.city}, {locInfo.admin1}, {locInfo.country}
        </p>
      )}

      {/* 3. Mythes & contes */}
      {locInfo?.city && (
        <Mythe
          city={locInfo.city}
          admin1={locInfo.admin1}
          onKeywords={setMytheKeywords}
        />
      )}

      {/* 4. Inspirations perso */}
      <textarea
        value={inputs.texteLibre}
        onChange={e => setInputs({texteLibre: e.target.value})}
        placeholder="Votre inspiration…"
        className="w-full p-2 border rounded mb-4"
        rows={4}
      />

      {/* 5. Style */}
      <select
        value={style}
        onChange={e => setStyle(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option>Résonance</option>
        <option>Mythe</option>
        <option>Conte</option>
      </select>

      {/* 6. Génération */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-indigo-600 text-white py-2 rounded mb-4"
      >
        {loading ? "Génération…" : "🎭 Générer l’IÂme du lieu"}
      </button>

      {/* 7. Résultat */}
      {output && (
        <div className="flex-grow overflow-auto">
          <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded mb-4 text-sm">
            {output}
          </pre>
          <IAsante texte={output} inputs={inputs} />

          <div className="mt-4 flex">
            <input
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="Titre de cette Âme…"
              className="flex-1 p-2 border rounded mr-2"
            />
            <button
              onClick={() => {
                saveToLibrary({label,content:output,type:"IAme",createdAt:Date.now()});
                setSaveOK(true);
              }}
              disabled={saveOK || !label.trim()}
              className="bg-green-600 text-white py-2 px-4 rounded"
            >
              {saveOK ? "✔️ Sauvé" : "💾 Sauvegarder"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}