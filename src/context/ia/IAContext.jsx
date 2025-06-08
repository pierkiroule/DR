import { createContext, useContext, useState } from "react";

const IAContext = createContext();

export function IAProvider({ children }) {
  const [iaOutput, setIaOutput] = useState("");
  const [iaLoading, setIaLoading] = useState(false);
  const [iaPromptStyle, setIaPromptStyle] = useState("resonance");
  const [iaMeta, setIaMeta] = useState(null);
  const [history, setHistory] = useState([]);
  const [fullTranscript, setFullTranscript] = useState(""); // 🧾 Pour synthèse globale
  
  const [wikidataSummary, setWikidataSummary] = useState(""); // 🗺️ Résumé culturel

  const sendToIA = async (prompt) => {
    if (!prompt.trim()) return;
    setIaLoading(true);
    setIaOutput("");

    try {
      // 💭 Simulation IA
      await new Promise(r => setTimeout(r, 1000));
      const simulatedResponse = `↪️ Résonance : "${prompt}"`;

      setIaOutput(simulatedResponse);

      const newEntry = { user: prompt, bot: simulatedResponse };
      setHistory((prev) => [...prev, newEntry]);

      // 🧾 Mise à jour du transcript global
      setFullTranscript(prev =>
        prev + `\n🌱 ${prompt}\n🎶 ${simulatedResponse}\n`
      );

    } catch (e) {
      setIaOutput("❌ Erreur IA");
    } finally {
      setIaLoading(false);
    }
  };

  return (
    <IAContext.Provider value={{
      iaOutput, setIaOutput,
      iaLoading, setIaLoading,
      iaPromptStyle, setIaPromptStyle,
      iaMeta, setIaMeta,
      history, setHistory,
      fullTranscript, setFullTranscript,
      sendToIA, wikidataSummary, setWikidataSummary,
    }}>
      {children}
    </IAContext.Provider>
  );
}

export const useIA = () => useContext(IAContext);