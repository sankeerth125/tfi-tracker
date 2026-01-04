import { useState } from "react";
import { useMovies } from "@/hooks/use-movies";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useUser } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function Compare() {
  const { data: movies } = useMovies();
  const { data: user } = useUser();
  
  const [movie1Id, setMovie1Id] = useState<string>("");
  const [movie2Id, setMovie2Id] = useState<string>("");

  const movie1 = movies?.find(m => m.id.toString() === movie1Id);
  const movie2 = movies?.find(m => m.id.toString() === movie2Id);

  // Mock comparison data (In real app, we'd fetch actual collections for both)
  const data = [
    { name: 'Opening Day', [movie1?.title || 'A']: 45, [movie2?.title || 'B']: 32 },
    { name: 'Weekend 1', [movie1?.title || 'A']: 120, [movie2?.title || 'B']: 95 },
    { name: 'Week 1', [movie1?.title || 'A']: 180, [movie2?.title || 'B']: 140 },
    { name: 'Lifetime', [movie1?.title || 'A']: 320, [movie2?.title || 'B']: 280 },
  ];

  const isProFeature = false; // Example of feature gating logic

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-bold">BOX OFFICE CLASH</h1>
          <p className="text-muted-foreground">Compare collections, budgets, and verdicts side-by-side.</p>
        </div>

        {/* Selection Area */}
        <Card className="bg-muted/10 border-dashed">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="w-full md:w-64">
                <Select value={movie1Id} onValueChange={setMovie1Id}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select Movie A" />
                  </SelectTrigger>
                  <SelectContent>
                    {movies?.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="font-bold text-muted-foreground">VS</div>
              
              <div className="w-full md:w-64">
                <Select value={movie2Id} onValueChange={setMovie2Id}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select Movie B" />
                  </SelectTrigger>
                  <SelectContent>
                    {movies?.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Content */}
        {movie1 && movie2 ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 text-center">
               <div className="space-y-2">
                  <div className="aspect-[2/3] w-24 mx-auto rounded overflow-hidden shadow mb-2">
                     <img src={movie1.posterUrl} alt={movie1.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold">{movie1.title}</h3>
                  <p className="text-sm font-mono">{movie1.verdict}</p>
               </div>
               
               <div className="flex flex-col justify-center space-y-4 text-xs font-bold text-muted-foreground uppercase">
                  <div className="border-b pb-2">Budget</div>
                  <div className="border-b pb-2">Status</div>
                  <div>Release</div>
               </div>
               
               <div className="space-y-2">
                  <div className="aspect-[2/3] w-24 mx-auto rounded overflow-hidden shadow mb-2">
                     <img src={movie2.posterUrl} alt={movie2.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold">{movie2.title}</h3>
                  <p className="text-sm font-mono">{movie2.verdict}</p>
               </div>
            </div>

            {/* Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Gross Comparison (In Crores)</CardTitle>
                <CardDescription>Estimated comparisons based on reported data</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey={movie1.title} fill="#111827" radius={[4, 4, 0, 0]} />
                    <Bar dataKey={movie2.title} fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pro Teaser */}
            {!user?.isPro && (
              <div className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-center text-white">
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="bg-white/10 p-3 rounded-full">
                     <Lock className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold font-display">UNLOCK ADVANCED METRICS</h3>
                  <p className="text-gray-300 max-w-md">
                    See precise distributor shares, territory-wise breakdowns, and ROI percentages with a Pro account.
                  </p>
                  <Link href="/pro">
                    <Button variant="secondary" className="font-bold">Upgrade to Pro</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Select two movies above to start comparing.
          </div>
        )}
      </main>
    </div>
  );
}
