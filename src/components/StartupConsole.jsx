import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { X } from "lucide-react";

export default function StartupConsole() {
  const {
    sessionCode,
    bubbles,
    links,
    syncStatus,
  } = useGlobalContext();

  const [visible, setVisible] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const logs = [];

    logs.push(sessionCode ? `✅ sessionCode : ${sessionCode}` : `⛔ Pas de sessionCode`);
    logs.push(bubbles.length > 0 ? `✅ ${bubbles.length} bulle(s)` : `⛔ Aucune bulle`);
    logs.push(`📡 synchro : ${syncStatus}`);
    logs.push(`🔗 liens : ${links.length}`);

    setMessages(logs);
  }, [sessionCode, bubbles, links, syncStatus]);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "#ffffffee",
      borderTop: "1px solid #ccc",
      padding: "6px 12px",
      fontSize: 12,
      fontFamily: "monospace",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      overflowX: "auto",
      whiteSpace: "nowrap"
    }}>
      <span>🧪 Startup : {messages.join(" | ")}</span>
      <button
        onClick={() => setVisible(false)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          marginLeft: 12
        }}
        title="Fermer"
      >
        <X size={14} />
      </button>
    </div>
  );
}