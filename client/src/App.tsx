import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";

import Compare from "@/pages/Compare";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import MovieDetail from "@/pages/MovieDetail";
import Pro from "@/pages/Pro";
import VerdictRules from "@/pages/VerdictRules";
import AdminDashboard from "@/pages/admin/Dashboard";
import ManageMovies from "@/pages/admin/ManageMovies";
import UpdateCollections from "@/pages/admin/UpdateCollections";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/movie/:id" component={MovieDetail} />
      <Route path="/compare" component={Compare} />
      <Route path="/login" component={Login} />
      <Route path="/pro" component={Pro} />
      <Route path="/verdict-rules" component={VerdictRules} />

      {/* Admin Routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/movies" component={ManageMovies} />
      <Route path="/admin/collections" component={UpdateCollections} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
