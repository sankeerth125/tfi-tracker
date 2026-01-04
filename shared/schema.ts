import { pgTable, text, serial, integer, boolean, timestamp, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // 'user' | 'admin'
  isPro: boolean("is_pro").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  posterUrl: text("poster_url").notNull(),
  releaseDate: date("release_date").notNull(),
  budget: integer("budget"), // in Crores
  verdict: text("verdict").default("Pending"), // Blockbuster, Super Hit, Hit, Average, Flop, Disaster
  status: text("status").default("Running"), // Running, Dropping, Dead
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const actors = pgTable("actors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  photoUrl: text("photo_url").notNull(),
  careerStart: integer("career_start"), // year
  totalFilms: integer("total_films").default(0),
  hitStreak: integer("hit_streak").default(0),
});

export const movieCast = pgTable("movie_cast", {
  id: serial("id").primaryKey(),
  movieId: integer("movie_id").references(() => movies.id).notNull(),
  actorId: integer("actor_id").references(() => actors.id).notNull(),
});

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  movieId: integer("movie_id").references(() => movies.id).notNull(),
  dayNumber: integer("day_number").notNull(),
  collectionDate: date("collection_date").notNull(),
  indiaGross: integer("india_gross").default(0),
  overseasGross: integer("overseas_gross").default(0),
  totalGross: integer("total_gross").default(0), // Calculated/Stored for ease
  trendDirection: text("trend_direction"), // 'up', 'down', 'flat'
});

// === RELATIONS (Implicit in Drizzle, explicit types helper) ===

// === BASE SCHEMAS ===
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertMovieSchema = createInsertSchema(movies).omit({ id: true, createdAt: true });
export const insertActorSchema = createInsertSchema(actors).omit({ id: true });
export const insertCollectionSchema = createInsertSchema(collections).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Movie = typeof movies.$inferSelect;
export type InsertMovie = z.infer<typeof insertMovieSchema>;

export type Actor = typeof actors.$inferSelect;
export type InsertActor = z.infer<typeof insertActorSchema>;

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;

// API Types
export type MovieWithCollections = Movie & {
  collections: Collection[];
};

export type LoginRequest = {
  email: text;
  password: text;
};

export type AuthResponse = {
  user: User;
  token?: string; // For simple mock auth if needed
};
