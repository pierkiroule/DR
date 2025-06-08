// SideMenu.jsx
import { useState, useEffect, useRef } from "react";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, MapPinned, Sparkles, Settings2, Cpu, FileText, Info
} from "lucide-react";
import { useGlobalContext } from "./context/GlobalContext";

export default function SideMenu() {
  const { code: sessionCode } = useParams();
  const { setSessionCode, pseudo, participantCount } = useGlobalContext();

  const navigate = useNavigate();
  const location = useLocation();
  const current = location.pathname.split("/").pop();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (sessionCode) setSessionCode(sessionCode);
  }, [sessionCode, setSessionCode]);

  const navItems = [
    { id: "infos", label: "Infos", icon: <Info size={18} /> },
    { id: "map", label: "Carte", icon: <MapPinned size={18} /> },
    { id: "orchestrator", label: "ART", icon: <Sparkles size={18} /> },
    { id: "pad", label: "Pad", icon: <FileText size={18} /> },
    { id: "ia", label: "IA", icon: <Cpu size={18} /> },
    { id: "configreso", label: "ConfigRéso", icon: <Settings2 size={18} /> },
  ];

  const goTo = (id) => {
    setOpen(false);
    navigator.vibrate?.(20);
    navigate(`/cabine/${sessionCode}/${id}`);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Burger menu */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="fixed top-3 right-3 z-50 bg-black text-white rounded px-3 py-2 burger-btn hidden md:block"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="flex flex-1 relative">
        {/* Side menu */}
        <aside
          ref={menuRef}
          className={`side-menu ${open ? "open" : ""}`}
          style={{
            width: 280,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            borderRight: "1px solid #ddd",
            boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
            transform: open ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
            zIndex: 40,
            padding: 16,
          }}
        >
          <div className="font-bold mb-4 text-lg">Console</div>
          <div className="mb-4 text-sm">
            <p><strong>Session :</strong> {sessionCode}</p>
            <p><strong>Pseudo :</strong> {pseudo || "Anonyme"}</p>
            <p><strong>Connectés :</strong> {participantCount}</p>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => goTo(id)}
                className={`flex items-center gap-2 px-3 py-2 rounded ${
                  current === id ? "bg-gray-200 font-semibold" : ""
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto z-10">
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .burger-btn {
            display: block !important;
          }
          .side-menu {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            box-shadow: 2px 0 8px rgba(0,0,0,0.2);
            z-index: 60;
          }
        }
      `}</style>
    </div>
  );
}