import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalContext";
import { IAProvider } from "./context/ia/IAContext";

import HomePage from "./HomePage";
import LayoutCabine from "./LayoutCabine";
import IA from "./components/IA";
import Pad from "./components/Pad";
import Orchestrator from "./components/Orchestrator";
import MapView from "./components/MapView";
import Info from "./components/Info";
import ConfigReso from "./components/ConfigReso";

import './mapstyle.css';

export default function App() {
  return (
    <GlobalProvider>
      <IAProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cabine/:code" element={<LayoutCabine />}>
              <Route index element={<Navigate to="configreso" replace />} />
              <Route path="map" element={<MapView />} />
              <Route path="pad" element={<Pad />} />
              <Route path="ia" element={<IA />} />
              <Route path="orchestrator" element={<Orchestrator />} />
              <Route path="infos" element={<Info />} />
              <Route path="configreso" element={<ConfigReso />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </IAProvider>
    </GlobalProvider>
  );
}