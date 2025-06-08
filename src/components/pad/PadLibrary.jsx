// /components/pad/PadLibrary.jsx
export default function PadLibrary({ resources, onSelect }) {
  if (!resources?.length) return <div>Aucune ressource disponible.</div>;
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: 10,
      maxHeight: 260,
      overflowY: "auto",
      margin: "8px 0"
    }}>
      {resources.map((ar) => (
        <button
          key={ar.id}
          onClick={() => onSelect(ar)}
          style={{
            background: "#e0e7ff",
            color: "#222",
            border: "2px solid #6366f1",
            borderRadius: 8,
            padding: "11px 5px",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer"
          }}
        >
          {ar.label || ar.nom || ar.id}
        </button>
      ))}
    </div>
  );
}