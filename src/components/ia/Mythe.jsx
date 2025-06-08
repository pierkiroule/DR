import { useEffect, useState } from "react";

export default function Mythe({ city, admin1, onKeywords }) {
  const [phrases, setPhrases] = useState([]);

  useEffect(() => {
    if (!city) return;
    const query = `mythes légendes contes ${city} ${admin1}`;
    fetch(`https://fr.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((data) => {
        const hits = data.query?.search || [];
        const list = hits.slice(0,5).map(r => r.title);
        const lines = hits.slice(0,5).map(r =>
          `• ${r.title} : ${r.snippet.replace(/<\/?[^>]+>/g,"")}…`
        );
        setPhrases(lines);
        onKeywords(list);
      })
      .catch(() => {
        setPhrases(["• Aucune légende trouvée."]);
        onKeywords([]);
      });
  }, [city, admin1]);

  if (!phrases.length) return null;
  return (
    <div className="bg-gray-50 p-3 rounded shadow text-sm">
      <h4 className="font-semibold mb-2">🧚 Mythes & contes locaux</h4>
      {phrases.map((p,i) => <p key={i} className="mb-1">{p}</p>)}
    </div>
  );
}