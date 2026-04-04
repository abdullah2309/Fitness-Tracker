import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "fitness-tracker-secret-key";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // In-memory data store (simulating MERN database)
  const db = {
    users: [], // { id, name, email, password, profilePicture }
    workouts: [], // { id, userId, name, type, exercises, date, notes }
    nutrition: [], // { id, userId, mealType, foodItems, calories, protein, carbs, fats, date }
    progress: [], // { id, userId, weight, bodyFat, date }
  };

  // Middleware to verify JWT
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid token." });
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post("/api/signup", async (req, res) => {
    const { name, email, password } = req.body;
    
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: db.users.length === 0 ? "admin" : "user", // First user is admin
      profilePicture: `https://picsum.photos/seed/${name}/200`,
    };

    db.users.push(newUser);
    
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET);
    res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, profilePicture: newUser.profilePicture, role: newUser.role } });
  });

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, profilePicture: user.profilePicture, role: user.role } });
  });

  // Protected API Routes
  app.get("/api/user", authenticateToken, (req, res) => {
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ id: user.id, name: user.name, email: user.email, profilePicture: user.profilePicture, role: user.role });
  });

  app.put("/api/user", authenticateToken, async (req, res) => {
    const { name, email, profilePicture } = req.body;
    const userIndex = db.users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) return res.status(404).json({ error: "User not found." });
    
    db.users[userIndex] = { ...db.users[userIndex], name, email, profilePicture };
    res.json({ id: db.users[userIndex].id, name: db.users[userIndex].name, email: db.users[userIndex].email, profilePicture: db.users[userIndex].profilePicture, role: db.users[userIndex].role });
  });

  // Admin Routes
  const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden. Admin access required." });
    }
    next();
  };

  app.get("/api/admin/users", authenticateToken, isAdmin, (req, res) => {
    const users = db.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, profilePicture: u.profilePicture }));
    res.json(users);
  });

  app.delete("/api/admin/users/:id", authenticateToken, isAdmin, (req, res) => {
    const userId = req.params.id;
    if (userId === req.user.id) return res.status(400).json({ error: "Cannot delete yourself." });
    
    db.users = db.users.filter(u => u.id !== userId);
    db.workouts = db.workouts.filter(w => w.userId !== userId);
    db.nutrition = db.nutrition.filter(n => n.userId !== userId);
    db.progress = db.progress.filter(p => p.userId !== userId);
    
    res.status(204).send();
  });

  app.get("/api/admin/stats", authenticateToken, isAdmin, (req, res) => {
    res.json({
      totalUsers: db.users.length,
      totalWorkouts: db.workouts.length,
      totalNutritionLogs: db.nutrition.length,
      totalProgressLogs: db.progress.length,
    });
  });

  app.get("/api/workouts", authenticateToken, (req, res) => {
    const userWorkouts = db.workouts.filter(w => w.userId === req.user.id);
    res.json(userWorkouts);
  });

  app.post("/api/workouts", authenticateToken, (req, res) => {
    const workout = { id: Date.now(), userId: req.user.id, ...req.body, date: new Date().toISOString() };
    db.workouts.push(workout);
    res.status(201).json(workout);
  });

  app.delete("/api/workouts/:id", authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    db.workouts = db.workouts.filter(w => w.id !== id || w.userId !== req.user.id);
    res.status(204).send();
  });

  app.delete("/api/nutrition/:id", authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    db.nutrition = db.nutrition.filter(n => n.id !== id || n.userId !== req.user.id);
    res.status(204).send();
  });

  app.delete("/api/progress/:id", authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    db.progress = db.progress.filter(p => p.id !== id || p.userId !== req.user.id);
    res.status(204).send();
  });

  app.get("/api/nutrition", authenticateToken, (req, res) => {
    const userNutrition = db.nutrition.filter(n => n.userId === req.user.id);
    res.json(userNutrition);
  });

  app.post("/api/nutrition", authenticateToken, (req, res) => {
    const entry = { id: Date.now(), userId: req.user.id, ...req.body, date: new Date().toISOString() };
    db.nutrition.push(entry);
    res.status(201).json(entry);
  });

  app.get("/api/progress", authenticateToken, (req, res) => {
    const userProgress = db.progress.filter(p => p.userId === req.user.id);
    res.json(userProgress);
  });

  app.post("/api/progress", authenticateToken, (req, res) => {
    const entry = { id: Date.now(), userId: req.user.id, ...req.body, date: new Date().toISOString() };
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
