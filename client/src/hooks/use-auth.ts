import { useToast } from "@/hooks/use-toast";
import { api } from "@shared/routes";
import { type LoginRequest } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path, { credentials: "include" });
      if (!res.ok) {
        // If 401/403, just return null (not logged in)
        return null;
      }
      return api.auth.me.responses[200].parse(await res.json());
    },
    retry: false,
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch(api.auth.signup.path, {
        method: api.auth.signup.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.auth.signup.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Signup failed");
      }
      return api.auth.signup.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.auth.me.path], data.user);
      toast({
        title: "Welcome!",
        description: "Account created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid credentials");
        throw new Error("Login failed");
      }
      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.auth.me.path], data.user);
      toast({ title: "Welcome back!", description: "Successfully logged in." });
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpgradeToPro() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.subscription.upgrade.path, {
        method: api.subscription.upgrade.method,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Upgrade failed");
      }
      return api.subscription.upgrade.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
      toast({
        title: "Success!",
        description: "Upgraded to Pro successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upgrade failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.auth.logout.path, {
        method: api.auth.logout.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null);
      toast({ title: "Logged out", description: "Come back soon!" });
    },
  });
}
