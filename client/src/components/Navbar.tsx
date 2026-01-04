import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Film, User, LogOut, ShieldCheck, Crown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [location] = useLocation();
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();

  const isActive = (path: string) => location === path;

  return (
    <nav className="border-b bg-card sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <Film className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-display font-bold text-xl tracking-tight text-primary">TOLLYWOOD<span className="text-muted-foreground font-light">TRACKER</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Dashboard</Link>
            <Link href="/compare" className={`nav-link ${isActive("/compare") ? "active" : ""}`}>Compare</Link>
            <Link href="/verdict-rules" className={`nav-link ${isActive("/verdict-rules") ? "active" : ""}`}>Verdict Rules</Link>
            <Link href="/pro" className={`nav-link ${isActive("/pro") ? "active" : ""}`}>
              <span className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-yellow-500" />
                Pro
              </span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="hidden sm:block text-left text-xs">
                    <p className="font-semibold">{user.email.split('@')[0]}</p>
                    <p className="text-muted-foreground uppercase text-[10px]">{user.role}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <DropdownMenuItem className="cursor-pointer">
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
