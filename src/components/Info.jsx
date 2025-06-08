// src/components/Infos.jsx
export default function Infos() {
  return (
    <div className="p-6 max-w-3xl mx-auto text-sm leading-relaxed">
      <h1 className="text-2xl font-bold mb-4">À propos de BubbleMap•°</h1>

      <p className="mb-4">
        BubbleMap•° est une <strong>Art-pplication expérimentale</strong>, conçue pour explorer la
        résonance sonore et visuelle dans les pratiques thérapeutiques, éducatives ou collectives.
      </p>

      <p className="mb-4">
        Elle permet de cartographier en temps réel des bulles interactives, des connexions, des
        flux… et d’<strong>orchestrer des expériences sensibles et collaboratives</strong>.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Sources d'inspiration</h2>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Jean-Pierre Courtial</strong> : pour la cartographie des réseaux sémantiques et la dynamique des concepts.</li>
        <li><strong>Bruno Latour</strong> : pour la théorie de l'acteur-réseau et la pensée des agencements hybrides.</li>
        <li><strong>Hartmut Rosa</strong> : pour sa philosophie de la résonance et du rapport vivant au monde.</li>
        <li><strong>Mauricio Neubern</strong> : pour son approche ethnoclinique de l'hypnose, centrée sur la co-construction et la culture.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">Créateur</h2>
      <p className="mb-4">
        Ce projet a été imaginé et développé par Pierre-Henri Garnier (psychologue, hypnothérapeute, docteur en SIC),
        dans le cadre d'une recherche-action mêlant <strong>art, science et soin</strong>.
      </p>

      <p className="text-gray-500 text-xs mt-8 italic">
        BubbleMap•° est un prototype libre et ouvert. Toute résonance est bienvenue.
      </p>
    </div>
  );
}