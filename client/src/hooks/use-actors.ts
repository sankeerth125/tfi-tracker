import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useActors() {
  return useQuery({
    queryKey: [api.actors.list.path],
    queryFn: async () => {
      const res = await fetch(api.actors.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch actors");
      return api.actors.list.responses[200].parse(await res.json());
    },
  });
}

export function useActor(id: number) {
  return useQuery({
    queryKey: [api.actors.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.actors.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch actor");
      return api.actors.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
