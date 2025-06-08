import { useState, useEffect } from "react";

function extractThemeSuggestions(resources, max = 5, minLength = 4) {
  const keywords = {};

  resources.forEach((r) => {
    const rawLabel = r.label || r.url?.split("/").pop()?.split(".")[0];
    if (!rawLabel) return;

    rawLabel
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length >= minLength)
      .forEach((word) => {
        keywords[word] = (keywords[word] || 0) + 1;
      });
  });

  return Object.entries(keywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([word]) => word);
}

export default function Bot({ onClose, resources = [], onSuggestDesignSet = () => {} }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [suggestedTheme, setSuggestedTheme] = useState(null);

  useEffect(() => {
    const themes = extractThemeSuggestions(resources);
    const suggestion = themes[0] || null;
    setSuggestedTheme(suggestion);

    const introMsgs = [
      { from: "bot", text: "🤖 Bienvenue. Je peux t'aider à composer un DesignSet à partir des ressources importées." },
      suggestion
        ? { from: "bot", text: `✨ Souhaites-tu explorer le thème « ${suggestion} » ?` }
        : { from: "bot", text: "📂 Aucune suggestion pour l’instant. Importe plus de fichiers avec des noms parlants." },
    ];

    setMessages(introMsgs);
  }, [resources]);

  const handleSend = () => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { from: "user", text: input },
      { from: "bot", text: `💡 Je cherche des ressources liées à « ${trimmed} »...` },
    ]);

    const selected = resources.filter((r) =>
      (r.label || r.url)?.toLowerCase().includes(trimmed)
    );

    if (selected.length) {
      onSuggestDesignSet(selected, trimmed);
    } else {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "❌ Aucun fichier trouvé avec ce mot-clé." },
      ]);
    }

    setInput("");
  };

  const handleShowKeywords = () => {
    const themes = extractThemeSuggestions(resources, 5);
    const txt = themes.length
      ? `📌 Mots-clés fréquents : ${themes.map((w) => `« ${w} »`).join(", ")}`
      : "🤷‍♂️ Aucun mot-clé fréquent trouvé.";
    setMessages((prev) => [...prev, { from: "bot", text: txt }]);
  };

  const handleSuggestClick = () => {
    if (!suggestedTheme) return;
    const selected = resources.filter((r) =>
      (r.label || r.url)?.toLowerCase().includes(suggestedTheme)
    );
    onSuggestDesignSet(selected, suggestedTheme);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-gray-100 p-2 rounded h-64 overflow-y-auto text-sm space-y-1">
        {messages.map((m, i) => (
          <div key={i} className={m.from === "bot" ? "text-purple-700" : "text-gray-800 font-medium"}>
            {m.from === "bot" ? "🤖" : "👤"} {m.text}
          </div>
        ))}

        {suggestedTheme && (
          <button
            onClick={handleSuggestClick}
            className="mt-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded"
          >
            ➕ Créer DesignSet « {suggestedTheme} »
          </button>
        )}

        {resources.length > 0 && (
          <button
            onClick={handleShowKeywords}
            className="text-xs text-blue-600 underline mt-1"
          >
            ❓ Voir les mots-clés fréquents
          </button>
        )}
      </div>

      <div className="flex gap-1">
        <input
          className="flex-1 border rounded px-2 py-1 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Donne un mot-clé…"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="bg-purple-600 text-white text-sm px-3 py-1 rounded">
          Envoyer
        </button>
      </div>
    </div>
  );
}