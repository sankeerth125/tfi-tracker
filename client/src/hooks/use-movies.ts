import {
  api,
  buildUrl,
  type InsertCollection,
  type InsertMovie,
} from "@shared/routes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMovies() {
  return useQuery({
    queryKey: [api.movies.list.path],
    queryFn: async () => {
      const res = await fetch(api.movies.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch movies");
      return api.movies.list.responses[200].parse(await res.json());
    },
  });
}

export function useMovie(id: number) {
  return useQuery({
    queryKey: [api.movies.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.movies.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch movie");
      return api.movies.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useMovieCollections(id: number) {
  return useQuery({
    queryKey: [api.movies.getCollections.path, id],
    queryFn: async () => {
      const url = buildUrl(api.movies.getCollections.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch collections");
      return api.movies.getCollections.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertMovie) => {
      const res = await fetch(api.admin.createMovie.path, {
        method: api.admin.createMovie.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.admin.createMovie.responses[400].parse(
            await res.json()
          );
          throw new Error(error.message);
        }
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to create movie");
      }
      return api.admin.createMovie.responses[201].parse(await res.json());
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [api.movies.list.path] }),
  });
}

export function useUpdateMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<InsertMovie>;
    }) => {
      const url = buildUrl(api.admin.updateMovie.path, { id });
      const res = await fetch(url, {
        method: api.admin.updateMovie.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.admin.updateMovie.responses[400].parse(
            await res.json()
          );
          throw new Error(error.message);
        }
        if (res.status === 401) throw new Error("Unauthorized");
        if (res.status === 404) throw new Error("Movie not found");
        throw new Error("Failed to update movie");
      }
      return api.admin.updateMovie.responses[200].parse(await res.json());
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [api.movies.list.path] }),
  });
}

export function useAddCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertCollection) => {
      const res = await fetch(api.admin.addCollection.path, {
        method: api.admin.addCollection.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.admin.addCollection.responses[400].parse(
            await res.json()
          );
          throw new Error(error.message);
        }
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to add collection");
      }
      return api.admin.addCollection.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [api.movies.getCollections.path, variables.movieId],
      });
      queryClient.invalidateQueries({ queryKey: [api.movies.list.path] });
    },
  });
}
