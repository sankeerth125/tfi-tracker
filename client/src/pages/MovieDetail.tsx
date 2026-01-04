import { useRoute } from "wouter";
import { useMovie, useMovieCollections } from "@/hooks/use-movies";
import { Navbar } from "@/components/Navbar";
import { VerdictBadge } from "@/components/VerdictBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle } from "lucide-react";

export default function MovieDetail() {
  const [match, params] = useRoute("/movie/:id");
  const id = params ? parseInt(params.id) : 0;
  
  const { data: movie, isLoading: loadingMovie } = useMovie(id);
  const { data: collections, isLoading: loadingCollections } = useMovieCollections(id);

  if (loadingMovie || loadingCollections) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-[300px] w-full rounded-xl mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Skeleton className="h-[400px] rounded-xl" />
             <Skeleton className="h-[400px] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Movie not found</h1>
        </div>
      </div>
    );
  }

  // Transform data for chart
  const chartData = collections?.map(c => ({
    day: `Day ${c.dayNumber}`,
    India: c.indiaGross,
    Overseas: c.overseasGross,
    Total: c.totalGross
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 bg-card p-6 rounded-2xl border shadow-sm">
           <div className="w-full md:w-64 flex-shrink-0">
             <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md">
               <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
             </div>
           </div>
           
           <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <VerdictBadge verdict={movie.verdict} className="text-sm px-3 py-1" />
                  <Badge variant="outline" className="text-xs uppercase tracking-widest">{movie.status}</Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">{movie.title}</h1>
                <p className="text-muted-foreground text-lg">Released: {new Date(movie.releaseDate).toDateString()}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="bg-muted/30 p-4 rounded-lg border">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Budget</p>
                    <p className="text-2xl font-mono font-bold">₹{movie.budget}Cr</p>
                 </div>
                 <div className="bg-muted/30 p-4 rounded-lg border">
                    <p className="text-xs text-muted-foreground uppercase font-bold">India Gross</p>
                    <p className="text-2xl font-mono font-bold">
                       ₹{collections?.reduce((sum, c) => sum + (c.indiaGross || 0), 0) || 0}Cr
                    </p>
                 </div>
                 <div className="bg-muted/30 p-4 rounded-lg border">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Overseas</p>
                    <p className="text-2xl font-mono font-bold">
                      ₹{collections?.reduce((sum, c) => sum + (c.overseasGross || 0), 0) || 0}Cr
                    </p>
                 </div>
                 <div className="bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
                    <p className="text-xs text-primary-foreground/70 uppercase font-bold">Total WW</p>
                    <p className="text-2xl font-mono font-bold">
                      ₹{collections?.reduce((sum, c) => sum + (c.totalGross || 0), 0) || 0}Cr
                    </p>
                 </div>
              </div>
              
              {movie.notes && (
                <div className="bg-blue-50 text-blue-900 px-4 py-3 rounded-lg border border-blue-100 flex gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{movie.notes}</p>
                </div>
              )}
           </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display tracking-wide">COLLECTION TREND</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="h-[350px] w-full">
                 {chartData.length > 0 ? (
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                       <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                       <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                       />
                       <Legend />
                       <Line type="monotone" dataKey="Total" stroke="#111827" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                       <Line type="monotone" dataKey="India" stroke="#16a34a" strokeWidth={2} dot={false} />
                       <Line type="monotone" dataKey="Overseas" stroke="#3b82f6" strokeWidth={2} dot={false} />
                     </LineChart>
                   </ResponsiveContainer>
                 ) : (
                   <div className="h-full flex items-center justify-center text-muted-foreground">
                     No collection data available yet.
                   </div>
                 )}
               </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
               <CardTitle className="font-display tracking-wide">DAY-WISE BREAKDOWN</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[350px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">India</TableHead>
                      <TableHead className="text-right">WW Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collections?.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">Day {c.dayNumber}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {new Date(c.collectionDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs">₹{c.indiaGross}Cr</TableCell>
                        <TableCell className="text-right font-mono font-bold">₹{c.totalGross}Cr</TableCell>
                      </TableRow>
                    ))}
                    {(!collections || collections.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No data reported yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
