import { MovieCard } from "@/components/MovieCard";
import { Navbar } from "@/components/Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VerdictBadge } from "@/components/VerdictBadge";
import { useMovies } from "@/hooks/use-movies";
import { AlertCircle, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: movies, isLoading, error } = useMovies();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load movies. Please check your connection and try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const runningMovies = movies?.filter((m) => m.status === "Running") || [];
  const upcomingMovies =
    movies?.filter((m) => new Date(m.releaseDate) > new Date()) || [];
  const recentMovies =
    movies?.sort(
      (a, b) =>
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    ) || [];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section - Top Running Movies */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-display font-bold text-primary flex items-center gap-2">
              <span className="w-1.5 h-8 bg-primary block rounded-full"></span>
              IN THEATERS
            </h2>
            <div className="text-sm text-muted-foreground font-medium">
              Data Updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {runningMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {runningMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  // Mock latest collection data logic since we don't fetch collections here
                  latestCollection={Math.floor(Math.random() * 10) + 1}
                  trend={Math.random() > 0.5 ? "up" : "down"}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border rounded-xl bg-muted/20">
              <p className="text-muted-foreground">
                No movies currently marked as 'Running'.
              </p>
            </div>
          )}
        </section>

        {/* Daily Tracker Table */}
        <section className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b bg-muted/5 flex items-center justify-between">
            <h3 className="font-display font-bold text-xl">
              DAILY BOX OFFICE TRACKER
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white px-3 py-1 rounded border">
              <Calendar className="w-4 h-4" />
              <span>Today's Estimates</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Movie</TableHead>
                  <TableHead>Release Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead className="text-right">Today (Est.)</TableHead>
                  <TableHead className="text-right">Total (India)</TableHead>
                  <TableHead className="text-center">Verdict</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMovies.slice(0, 5).map((movie) => (
                  <TableRow key={movie.id} className="hover:bg-muted/5">
                    <TableCell className="font-medium text-base">
                      <Link
                        href={`/movie/${movie.id}`}
                        className="text-primary hover:underline"
                      >
                        {movie.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(movie.releaseDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono">
                      Day{" "}
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(movie.releaseDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) + 1}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      ₹{Math.floor(Math.random() * 5)}.5 Cr
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ₹{Math.floor(Math.random() * 100) + 20} Cr
                    </TableCell>
                    <TableCell className="text-center">
                      <VerdictBadge verdict={movie.verdict} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Upcoming Section */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-muted-foreground block rounded-full"></span>
            UPCOMING RELEASES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMovies.length > 0 ? (
              upcomingMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex items-center gap-4 bg-card p-4 rounded-xl border hover:border-primary/50 transition-colors"
                >
                  <div className="w-16 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold font-display text-lg">
                      {movie.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Release:{" "}
                      {new Date(movie.releaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 text-center text-muted-foreground">
                No upcoming movies scheduled.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
