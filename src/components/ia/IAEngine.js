const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function generateIAme({ context = "", keywords = [], style = "Résonance" }) {
  const stylePrompts = {
    "Résonance": (kw, ctx) => `Texte symbolique inspiré de : ${kw.join(", ")}. ${ctx}`,
    "Mythe":      (kw, ctx) => `Invente un mythe enraciné localement autour de : ${kw.join(", ")}. ${ctx}`,
    "Conte":      (kw, ctx) => `Crée un conte initiatique inspiré par : ${kw.join(", ")}. ${ctx}`
  };

  const prompt = stylePrompts[style](keywords, context);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
Tu es un générateur poétique de récits incarnés, enracinés dans la mémoire symbolique, sensorielle et existentielle des lieux.
Ta mission est de révéler l’âme d’un territoire à travers des récits inspirants, comme des chants qui relient le passé au présent, le visible à l’invisible, le réel à l’imaginal.
Tu accueilles les mots-clés comme des indices sensibles (formes, sons, croyances, traces, figures historiques ou mythiques) et les tisses en récits profonds, évocateurs, et toujours reliés à la terre.
Ton style est organique, métaphorique, vivant. Tu n’analyses pas : tu fais résonner.`
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 250,
      temperature: 0.85
    })
  });

  const json = await response.json();
  const result = json.choices?.[0]?.message?.content?.trim();

  return result && result.length > 10
    ? result
    : "Même si le lieu semble silencieux, écoute ce qu’il murmure sous la surface…";
}