import { Link } from "wouter";
import { type Movie } from "@shared/schema";
import { VerdictBadge } from "./VerdictBadge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MovieCardProps {
  movie: Movie;
  latestCollection?: number;
  trend?: string | null;
}

export function MovieCard({ movie, latestCollection, trend }: MovieCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="dashboard-card group cursor-pointer h-full overflow-hidden border-l-4 border-l-transparent hover:border-l-primary transition-all">
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          {/* Use Unsplash image with descriptive comment */}
          {/* movie poster generic placeholder */}
          <img 
            src={movie.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60"} 
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2">
            <VerdictBadge verdict={movie.verdict} />
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="text-lg font-bold font-display truncate mb-1 text-primary group-hover:text-blue-700 transition-colors">
            {movie.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
            Released: {new Date(movie.releaseDate).toLocaleDateString()}
          </p>

          <div className="flex items-center justify-between border-t pt-3 mt-2">
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase">Latest Gross</p>
              <p className="font-mono font-bold text-lg">
                {latestCollection ? `₹${latestCollection}Cr` : "N/A"}
              </p>
            </div>
            <div className="flex flex-col items-end">
               <p className="text-[10px] text-muted-foreground font-semibold uppercase">Trend</p>
               <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-full">
                 {getTrendIcon()}
               </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
