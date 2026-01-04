import { useState } from "react";
import { useLogin } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Film } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending } = useLogin();
  const [_, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password }, {
      onSuccess: () => setLocation("/")
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 px-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-primary p-3 rounded-xl mb-4">
          <Film className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-display font-bold">TOLLYWOOD TRACKER</h1>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@tollywood.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded border border-yellow-200">
               <strong>Demo Credentials:</strong><br/>
               Admin: admin@example.com / admin123<br/>
               User: user@example.com / user123
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <p className="mt-4 text-xs text-muted-foreground text-center">
        By signing in, you agree to our Terms of Service.<br/>
        This is a demo application.
      </p>
    </div>
  );
}
