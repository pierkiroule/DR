import {
  Info,
  Map,
  Network,
  Circle,
  Link,
  Users,
  BrainCircuit,
  Activity,
} from "lucide-react";

export default function MeteoReso({ session, connexion, nbBubbles, nbLinks, nbUsers, energy, styleIA, iaActive }) {
  const data = [
    {
      label: "Session",
      value: session,
      icon: <Map size={18} />,
      info: "Code unique de votre carte de résonance.",
    },
    {
      label: "Connexion",
      value: connexion,
      icon: <Network size={18} />,
      info: "Êtes-vous relié au paysage ?",
    },
    {
      label: "Bulles",
      value: nbBubbles,
      icon: <Circle size={18} />,
      info: "Nœuds vibrants de votre carte.",
    },
    {
      label: "Liens",
      value: nbLinks,
      icon: <Link size={18} />,
      info: "Sentiers tissés entre les bulles.",
    },
    {
      label: "Présences",
      value: nbUsers,
      icon: <Users size={18} />,
      info: "Participants connectés à votre bulle.",
    },
    {
      label: "Énergie",
      value: energy,
      icon: <Activity size={18} />,
      info: "Indicateur global de vitalité du réseau.",
    },
    {
      label: "Style IA",
      value: styleIA,
      icon: <BrainCircuit size={18} />,
      info: "Langage choisi pour la co-création.",
    },
    {
      label: "IA active",
      value: iaActive,
      icon: <BrainCircuit size={18} />,
      info: "L’IA est-elle présente dans le paysage ?",
    },
  ];

  return (
    <div className="w-full bg-white text-black p-4 rounded-xl shadow mb-4">
      <h2 className="text-xl font-bold mb-3 text-center">🌐 Météo Réso•°</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, i) => (
          <div
            key={i}
            className="border border-black rounded-lg p-3 bg-white shadow group hover:shadow-xl transition"
          >
            <div className="flex items-center space-x-2 mb-1">
              {item.icon}
              <span className="font-semibold">{item.label}</span>
              <div className="relative group">
                <Info size={14} className="cursor-pointer" />
                <div className="absolute z-10 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded w-44 bottom-full left-1/2 -translate-x-1/2 mb-2 text-center">
                  {item.info}
                </div>
              </div>
            </div>
            <div className="text-lg font-bold mt-1">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}