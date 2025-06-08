// ImageGenerator.jsx
import { useEffect, useState } from "react";

const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const HF_API_URL = "https://api-inference.huggingface.co/models/Xenova/stable-diffusion";

export default function ImageGenerator({ prompt }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!prompt) return;
    generateImage(prompt);
  }, [prompt]);

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const res = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      });

      if (!res.ok) throw new Error("Erreur API : " + await res.text());
      const blob = await res.blob();
      setImageUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
    setProgress(100);
  };

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setProgress(p => (p < 90 ? p + 10 : p));
    }, 300);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div style={{ marginTop: 20 }}>
      {loading && <div style={{ height: 8, background: "#ccc" }}>
        <div style={{ width: `${progress}%`, height: "100%", background: "#007bff" }} />
      </div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {imageUrl && <img src={imageUrl} alt="généré" style={{ maxWidth: "100%" }} />}
    </div>
  );
}