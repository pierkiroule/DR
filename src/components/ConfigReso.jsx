import { useGlobalContext } from "../context/GlobalContext";
import MeteoReso from "./reso/MeteoReso";
import GroupEditor from "./reso/GroupEditor";

export default function ConfigReso() {
  const {
    sessionCode,
    bubbles = [],
    links = [],
    participants = [],
    syncStatus,
    sessionMeta = {},
    energy,
    iaStyle = "Poétique",
    iaActive = true,
  } = useGlobalContext();

  // Calcul dynamique
  const nbBubbles = bubbles.length;
  const nbLinks = links.length;
  const nbUsers = participants.length;
  const isOnline = syncStatus !== "error";
  const sessionLabel = sessionCode || "aucune";
  const styleIA = iaStyle || "Poétique";
  const energie = typeof energy === "number" ? energy : sessionMeta.energy || 0;

  return (
    <main className="w-full max-w-4xl mx-auto p-4">
      <section>
        <MeteoReso
          session={sessionLabel}
          connexion={isOnline ? "🟢 Active" : "🔴 Hors ligne"}
          nbBubbles={nbBubbles}
          nbLinks={nbLinks}
          nbUsers={nbUsers}
          energy={energie}
          styleIA={styleIA}
          iaActive={iaActive ? "Oui" : "Non"}
        />
      </section>
      <section>
        <GroupEditor />
      </section>
    </main>
  );
}