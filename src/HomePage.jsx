import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, set } from "firebase/database";
import { db } from "./firebase";
import { useGlobalContext } from "./context/GlobalContext";

export default function HomePage() {
  const [pseudo, setPseudo] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [created, setCreated] = useState(null);
  const navigate = useNavigate();

  const canvasRef = useRef(null);

  const {
    sessionCode,
    setSessionCode,
    bubbles,
    links,
    selectedIds,
  } = useGlobalContext();

  const publicUrl = created
    ? `${window.location.origin}/cabine/${created.code}/public`
    : "";

  const generateSessionCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  const handleCreateSession = async () => {
    setError("");
    if (!sessionName.trim()) return setError("Nom requis");

    const code = generateSessionCode();
    const sessionData = {
      bubbles: [],
      links: [],
      meta: {
        name: sessionName,
        createdBy: pseudo || "Anonyme",
        createdAt: Date.now(),
      },
    };

    try {
      await set(ref(db, `sessions/${code}`), sessionData);
      setCreated({ code, name: sessionName });
      setSessionCode(code);
    } catch (err) {
      setError("Erreur lors de la création de session");
    }
  };

  const handleEnter = () => {
    if (created?.code) {
      navigate(`/cabine/${created.code}/configreso`);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const points = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 2 + Math.random() * 16,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(100, 120, 255, ${1 - dist / 100})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (let p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 10 * Math.PI);
        ctx.fillStyle = "rgba(50, 100, 255, 0.5)";
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;
      }

      requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 relative font-sans overflow-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />

      <div className="absolute top-10 w-full text-center z-10">
        <h1 className="text-6xl font-bold text-gray-900 mb-1 font-[cursive] tracking-wider">
          BubbleMap
        </h1>
        <p className="text-blue-500 italic text-xl">Designer les résonances</p>
      </div>

      <div className="relative z-10 max-w-md mx-auto mt-40 bg-white/80 backdrop-blur-lg border border-blue-300 rounded-2xl p-6 shadow-xl">
        <input
          className="w-full p-3 mb-3 rounded-lg bg-white border border-blue-300 text-gray-700 placeholder-gray-400"
          placeholder="Votre pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />
        <input
          className="w-full p-3 mb-3 rounded-lg bg-white border border-blue-300 text-gray-700 placeholder-gray-400"
          placeholder="Nom de la session"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
        />
        <button
          onClick={handleCreateSession}
          className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-lg"
        >
          Créer la session
        </button>

        {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}

        {created && (
          <div className="mt-4 text-center text-sm text-blue-800">
            <p>✅ Session : <b>{created.code}</b></p>
            <p className="text-xs mt-2 break-all text-blue-600">{publicUrl}</p>

            <button
              onClick={() => {
                navigator.clipboard.writeText(publicUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 1000);
              }}
              className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm rounded-lg"
            >
              {copied ? "Lien copié !" : "Copier le lien"}
            </button>

            <button
              onClick={handleEnter}
              className="w-full mt-4 py-2 bg-gray-800 hover:bg-gray-600 text-white rounded-lg"
            >
              Entrer dans la cabine
            </button>
          </div>
        )}
      </div>

      <footer className="absolute bottom-6 w-full text-center text-gray-500 italic z-10">
        Pier•°
      </footer>
    </div>
  );
}