export default function PadCell({ ar, onAssign, onClear, onPlay }) {
  if (!ar) {
    // pad vide : cliquer pour assigner
    return (
      <button
        onClick={onAssign}
        style={{
          background: "#eef2ff",
          border: "2px dashed #6366f1",
          borderRadius: 18,
          height: 80,
          width: "100%",
          minWidth: 0,
          fontSize: 36,
          color: "#6366f1",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px #ddd4",
          transition: "background 0.15s"
        }}
        title="Assigner un AR"
      >
        ＋
      </button>
    );
  }
  // pad assigné : jouer ou vider
  return (
    <div style={{
      background: "#6366f1",
      color: "white",
      borderRadius: 18,
      height: 80,
      minWidth: 0,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 10px #6366f155",
      position: "relative",
      padding: "6px 0",
      transition: "box-shadow 0.15s",
      cursor: "pointer"
    }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: 15,
          marginBottom: 1,
          textAlign: "center",
          maxWidth: 120,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
        title={ar.label || ar.nom || ar.id}
      >
        {ar.label || ar.nom || ar.id}
      </div>
      {/* Sous-texte éventuel, par ex. type ou auteur */}
      {ar.type && (
        <div
          style={{
            fontSize: 12,
            color: "#c7d2fe",
            marginBottom: 3,
            textAlign: "center",
            maxWidth: 120,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
          title={ar.type}
        >
          {ar.type}
        </div>
      )}
      <div style={{ display: "flex", gap: 10, marginTop: 2 }}>
        <button
          onClick={onPlay}
          style={{
            background: "#fff",
            color: "#6366f1",
            border: "none",
            borderRadius: "50%",
            width: 36,
            height: 36,
            fontSize: 20,
            fontWeight: 700,
            boxShadow: "0 1px 4px #e0e7ffcc",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.12s"
          }}
          title="Jouer AR"
        >
          ▶️
        </button>
        <button
          onClick={onClear}
          style={{
            background: "#e0e7ff",
            color: "#6366f1",
            border: "none",
            borderRadius: "50%",
            width: 36,
            height: 36,
            fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.12s"
          }}
          title="Supprimer"
        >
          ✖️
        </button>
      </div>
    </div>
  );
}