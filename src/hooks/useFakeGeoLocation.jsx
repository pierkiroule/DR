import { useEffect } from "react";

// Utilisation : useFakeGeoLocation(nbParticipants, callback)
export default function useFakeGeoLocation(count = 10, onUpdate) {
  useEffect(() => {
    const bounds = {
      lat: [47.2, 47.3],   // exemple autour de Nantes
      lng: [-1.6, -1.5],
    };

    const getRandomCoord = () => ({
      lat: Math.random() * (bounds.lat[1] - bounds.lat[0]) + bounds.lat[0],
      lng: Math.random() * (bounds.lng[1] - bounds.lng[0]) + bounds.lng[0],
    });

    const interval = setInterval(() => {
      for (let i = 0; i < count; i++) {
        const id = `fake-${i}`;
        const coords = getRandomCoord();

        onUpdate?.(id, {
          ...coords,
          updatedAt: Date.now(),
          role: i === 0 ? "dj" : "participant",
        });
      }
    }, 1500); // envoie une mise à jour toutes les 1.5 secondes

    return () => clearInterval(interval);
  }, [count, onUpdate]);
}