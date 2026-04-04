import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // In-memory data store (simulating MERN database)
  const db = {
    workouts: [],
    nutrition: [],
    progress: [],
    user: {
      name: "Guest User",
      email: "guest@example.com",
      profilePicture: "https://picsum.photos/seed/fitness/200",
    },
  };

  // API Routes
  app.get("/api/user", (req, res) => res.json(db.user));
  app.put("/api/user", (req, res) => {
    db.user = { ...db.user, ...req.body };
    res.json(db.user);
  });

  app.get("/api/workouts", (req, res) => res.json(db.workouts));
  app.post("/api/workouts", (req, res) => {
    const workout = { id: Date.now(), ...req.body, date: new Date().toISOString() };
    db.workouts.push(workout);
    res.status(201).json(workout);
  });
  app.delete("/api/workouts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    db.workouts = db.workouts.filter(w => w.id !== id);
    res.status(204).send();
  });

  app.get("/api/nutrition", (req, res) => res.json(db.nutrition));
  app.post("/api/nutrition", (req, res) => {
    const entry = { id: Date.now(), ...req.body, date: new Date().toISOString() };
    db.nutrition.push(entry);
    res.status(201).json(entry);
  });

  app.get("/api/progress", (req, res) => res.json(db.progress));
  app.post("/api/progress", (req, res) => {
    const entry = { id: Date.now(), ...req.body, date: new Date().toISOString() };
    db.progress.push(entry);
    res.status(201).json(entry);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
