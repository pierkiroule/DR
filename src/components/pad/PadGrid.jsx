export default function PadGrid({ pads, groups, onClickPad, onClearPad, onPlayPad }) {
  // Toujours 8 pads affichés
  const safePads = Array(8).fill(null).map((_, i) => pads && pads[i] ? pads[i] : null);

  return (
    <div
      className="
        grid gap-3 mx-auto
        grid-cols-2
        sm:grid-cols-4
        max-w-md
        "
      style={{ margin: "30px 0 12px" }}
    >
      {safePads.map((pad, idx) => {
        const groupName = pad?.groupId
          ? (groups.find(g => g.id === pad.groupId)?.name || pad.groupId)
          : "Aucun";
        return (
          <div
            key={idx}
            className={`
              rounded-xl shadow border
              flex flex-col items-center justify-center
              relative p-3 min-h-[80px] min-w-[70px]
              ${pad?.ar ? "bg-blue-100 border-blue-200" : "bg-gray-100 border-gray-300"}
            `}
          >
            <div className="font-semibold text-base mb-1">
              Pad {idx + 1}
            </div>
            <div className="min-h-[28px] text-sm text-gray-900 truncate max-w-[90%] text-center">
              {pad?.ar?.label || pad?.ar?.nom || "Aucun AR"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Groupe : <b className="text-gray-700">{groupName}</b>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                className="bg-indigo-600 text-white rounded px-3 py-1 text-sm font-bold"
                onClick={() => onClickPad(idx)}
                title={pad?.ar ? "Modifier" : "Assigner"}
              >
                {pad?.ar ? "✏️" : "➕"}
              </button>
              {pad?.ar && (
                <>
                  <button
                    className="bg-yellow-400 text-gray-900 rounded px-3 py-1 text-sm font-bold"
                    onClick={() => onPlayPad(pad)}
                    title="Jouer"
                  >▶️</button>
                  <button
                    className="bg-red-500 text-white rounded px-3 py-1 text-sm font-bold"
                    onClick={() => onClearPad(idx)}
                    title="Supprimer"
                  >🗑️</button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}