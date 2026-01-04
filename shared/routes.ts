import { z } from 'zod';
import { insertUserSchema, insertMovieSchema, insertActorSchema, insertCollectionSchema, movies, actors, collections } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  // Public Routes
  movies: {
    list: {
      method: 'GET' as const,
      path: '/api/movies',
      responses: {
        200: z.array(z.custom<typeof movies.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/movies/:id',
      responses: {
        200: z.custom<typeof movies.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    getCollections: {
      method: 'GET' as const,
      path: '/api/movies/:id/collections',
      responses: {
        200: z.array(z.custom<typeof collections.$inferSelect>()),
      },
    },
    getRegionalCollections: {
      method: 'GET' as const,
      path: '/api/movies/:id/regional',
      responses: {
        200: z.array(z.custom<typeof regionalCollections.$inferSelect>()),
      },
    },
  },
  actors: {
    list: {
      method: 'GET' as const,
      path: '/api/actors',
      responses: {
        200: z.array(z.custom<typeof actors.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/actors/:id',
      responses: {
        200: z.custom<typeof actors.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  // Auth Routes (Mocked)
  auth: {
    signup: {
      method: 'POST' as const,
      path: '/api/auth/signup',
      input: z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
      responses: {
        201: z.object({
          user: z.object({
            id: z.number(),
            email: z.string(),
            role: z.string(),
            isPro: z.boolean(),
          }),
        }),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({
        email: z.string().email(),
        password: z.string(),
      }),
      responses: {
        200: z.object({
          user: z.object({
            id: z.number(),
            email: z.string(),
            role: z.string(),
            isPro: z.boolean(),
          }),
        }),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
        method: 'GET' as const,
        path: '/api/auth/me',
        responses: {
            200: z.object({
                id: z.number(),
                email: z.string(),
                role: z.string(),
                isPro: z.boolean(),
            }).nullable(),
        }
    }
  },
  // Pro/Subscription
  subscription: {
    upgrade: {
      method: 'POST' as const,
      path: '/api/subscription/upgrade',
      responses: {
        200: z.object({ success: z.boolean(), message: z.string() }),
      },
    },
  },
  // Admin Routes (Internal)
  admin: {
    createMovie: {
      method: 'POST' as const,
      path: '/api/admin/movies',
      input: insertMovieSchema,
      responses: {
        201: z.custom<typeof movies.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    addCollection: {
      method: 'POST' as const,
      path: '/api/admin/collections',
      input: insertCollectionSchema,
      responses: {
        201: z.custom<typeof collections.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
