const express = require("express");
const ImageKit = require("imagekit");
const cors = require("cors");

const app = express();
app.use(cors());

const imagekit = new ImageKit({
  publicKey: "public_oHwD85fNv/rOVOCep4B0RI4T7bs=",
  privateKey: "private_+txfJuGUQ0y7d9onuTYfmh+QYwY=",
  urlEndpoint: "https://ik.imagekit.io/BMap",
});

app.get("/ping", (req, res) => {
  res.send("✅ Serveur OK");
});

app.get("/auth", (req, res) => {
  const authParams = imagekit.getAuthenticationParameters();
  res.json(authParams);
});

app.get("/files", async (req, res) => {
  try {
    const result = await imagekit.listFiles({ limit: 10 });
    res.json(result);
  } catch (err) {
    console.error("❌ Erreur listFiles:", err);
    res.status(500).json({ error: "Erreur récupération fichiers" });
  }
});

// Écoute sur 0.0.0.0 pour accès réseau
app.listen(3001, "0.0.0.0", () => {
  console.log("✅ Serveur actif sur http://10.8.177.32:3001");
});