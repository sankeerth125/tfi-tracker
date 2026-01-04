import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useUser } from "@/hooks/use-auth";
import { LayoutDashboard, PlusCircle, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: user, isLoading } = useUser();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-muted/20">
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-muted/10 flex">
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="font-display font-bold text-xl tracking-wider">ADMIN PANEL</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin">
            <Button variant={isActive("/admin") ? "secondary" : "ghost"} className="w-full justify-start gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </Button>
          </Link>
          <Link href="/admin/movies">
            <Button variant={isActive("/admin/movies") ? "secondary" : "ghost"} className="w-full justify-start gap-2">
              <PlusCircle className="w-4 h-4" />
              Manage Movies
            </Button>
          </Link>
          <Link href="/admin/collections">
            <Button variant={isActive("/admin/collections") ? "secondary" : "ghost"} className="w-full justify-start gap-2">
              <FileText className="w-4 h-4" />
              Update Collections
            </Button>
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Link href="/">
            <Button variant="outline" className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Site
            </Button>
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
