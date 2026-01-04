import {
  actors,
  collections,
  movies,
  regionalCollections,
  users,
  type Actor,
  type Collection,
  type InsertActor,
  type InsertCollection,
  type InsertMovie,
  type InsertRegionalCollection,
  type InsertUser,
  type Movie,
  type RegionalCollection,
  type User,
} from "@shared/schema";
import { desc, eq } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProStatus(id: number, isPro: boolean): Promise<User>;

  // Movies
  getMovies(): Promise<Movie[]>;
  getMovie(id: number): Promise<Movie | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  updateMovie(id: number, movie: Partial<InsertMovie>): Promise<Movie>;

  // Actors
  getActors(): Promise<Actor[]>;
  getActor(id: number): Promise<Actor | undefined>;
  createActor(actor: InsertActor): Promise<Actor>;

  // Collections
  getCollectionsByMovieId(movieId: number): Promise<Collection[]>;
  createCollection(collection: InsertCollection): Promise<Collection>;

  // Regional
  getRegionalCollectionsByMovieId(
    movieId: number
  ): Promise<RegionalCollection[]>;
  createRegionalCollection(
    collection: InsertRegionalCollection
  ): Promise<RegionalCollection>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserProStatus(id: number, isPro: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isPro })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Movies
  async getMovies(): Promise<Movie[]> {
    return await db.select().from(movies).orderBy(desc(movies.releaseDate));
  }

  async getMovie(id: number): Promise<Movie | undefined> {
    const [movie] = await db.select().from(movies).where(eq(movies.id, id));
    return movie;
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const [movie] = await db.insert(movies).values(insertMovie).returning();
    return movie;
  }

  async updateMovie(
    id: number,
    updateMovie: Partial<InsertMovie>
  ): Promise<Movie> {
    const [movie] = await db
      .update(movies)
      .set(updateMovie)
      .where(eq(movies.id, id))
      .returning();
    return movie;
  }

  // Actors
  async getActors(): Promise<Actor[]> {
    return await db.select().from(actors);
  }

  async getActor(id: number): Promise<Actor | undefined> {
    const [actor] = await db.select().from(actors).where(eq(actors.id, id));
    return actor;
  }

  async createActor(insertActor: InsertActor): Promise<Actor> {
    const [actor] = await db.insert(actors).values(insertActor).returning();
    return actor;
  }

  // Collections
  async getCollectionsByMovieId(movieId: number): Promise<Collection[]> {
    return await db
      .select()
      .from(collections)
      .where(eq(collections.movieId, movieId))
      .orderBy(collections.dayNumber);
  }

  async createCollection(
    insertCollection: InsertCollection
  ): Promise<Collection> {
    const [collection] = await db
      .insert(collections)
      .values(insertCollection)
      .returning();
    return collection;
  }

  async getRegionalCollectionsByMovieId(
    movieId: number
  ): Promise<RegionalCollection[]> {
    return await db
      .select()
      .from(regionalCollections)
      .where(eq(regionalCollections.movieId, movieId));
  }

  async createRegionalCollection(
    insertCollection: InsertRegionalCollection
  ): Promise<RegionalCollection> {
    const [collection] = await db
      .insert(regionalCollections)
      .values(insertCollection)
      .returning();
    return collection;
  }
}

export const storage = new DatabaseStorage();
