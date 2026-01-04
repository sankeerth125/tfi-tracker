import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Setup session for mock auth
  app.use(
    session({
      store: new SessionStore({ checkPeriod: 86400000 }),
      secret: "tollywood_secret", // In production use proper secret
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Set to true if using https
    })
  );

  // Mock Middleware for Admin check
  const isAdmin = (req: any, res: any, next: any) => {
    if (req.session.user && req.session.user.role === 'admin') {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized: Admin only" });
    }
  };

  // === AUTH ROUTES ===
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { email, password } = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) { // Simple plaintext password check for mock
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.user = user;
      res.json({ user: { id: user.id, email: user.email, role: user.role, isPro: user.isPro || false } });
    } catch (err) {
       res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, (req, res) => {
      if (req.session.user) {
          const { id, email, role, isPro } = req.session.user;
          res.json({ id, email, role, isPro: isPro || false });
      } else {
          res.json(null);
      }
  });

  app.post(api.subscription.upgrade.path, async (req, res) => {
    if (req.session.user) {
      const updatedUser = await storage.updateUserProStatus(req.session.user.id, true);
      req.session.user = updatedUser;
      res.json({ success: true, message: "Upgraded to Pro" });
    } else {
      res.status(401).json({ message: "Not logged in" });
    }
  });

  // === PUBLIC ROUTES ===

  // Movies
  app.get(api.movies.list.path, async (req, res) => {
    const movies = await storage.getMovies();
    res.json(movies);
  });

  app.get(api.movies.get.path, async (req, res) => {
    const movie = await storage.getMovie(Number(req.params.id));
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  });

  app.get(api.movies.getCollections.path, async (req, res) => {
    const collections = await storage.getCollectionsByMovieId(Number(req.params.id));
    res.json(collections);
  });

  // Actors
  app.get(api.actors.list.path, async (req, res) => {
    const actors = await storage.getActors();
    res.json(actors);
  });

  app.get(api.actors.get.path, async (req, res) => {
    const actor = await storage.getActor(Number(req.params.id));
    if (!actor) return res.status(404).json({ message: "Actor not found" });
    res.json(actor);
  });

  // === ADMIN ROUTES ===
  app.post(api.admin.createMovie.path, isAdmin, async (req, res) => {
    try {
      const input = api.admin.createMovie.input.parse(req.body);
      const movie = await storage.createMovie(input);
      res.status(201).json(movie);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.admin.addCollection.path, isAdmin, async (req, res) => {
     try {
      const input = api.admin.addCollection.input.parse(req.body);
      const collection = await storage.createCollection(input);
      res.status(201).json(collection);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return httpServer;
}

// SEED FUNCTION
async function seedDatabase() {
    const existingMovies = await storage.getMovies();
    if (existingMovies.length > 0) return;

    // Create Admin
    await storage.createUser({
        email: "admin@tollywood.com",
        password: "admin",
        role: "admin",
        isPro: true
    });

    // Create User
     await storage.createUser({
        email: "user@example.com",
        password: "password",
        role: "user",
        isPro: false
    });

    // Create Movies
    const m1 = await storage.createMovie({
        title: "Kalki 2898 AD",
        posterUrl: "https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg",
        releaseDate: "2024-06-27",
        budget: 600,
        verdict: "Blockbuster",
        status: "Strong",
        notes: "Science fiction epic."
    });

    const m2 = await storage.createMovie({
        title: "Pushpa 2: The Rule",
        posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/11/Pushpa_The_Rule.jpg",
        releaseDate: "2024-12-06",
        budget: 500,
        verdict: "Pending",
        status: "Running",
        notes: "Action thriller sequel."
    });
    
    // Create Collections
    await storage.createCollection({
        movieId: m1.id,
        dayNumber: 1,
        collectionDate: "2024-06-27",
        indiaGross: 95,
        overseasGross: 65,
        totalGross: 160,
        trendDirection: "up"
    });
    await storage.createCollection({
        movieId: m1.id,
        dayNumber: 2,
        collectionDate: "2024-06-28",
        indiaGross: 80,
        overseasGross: 40,
        totalGross: 120,
        trendDirection: "down"
    });

    console.log("Database seeded!");
}

// Call seed (in a real app, do this more carefully)
setTimeout(seedDatabase, 2000);
