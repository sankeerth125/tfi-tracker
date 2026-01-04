import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useMovies, useAddCollection } from "@/hooks/use-movies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";

export default function UpdateCollections() {
  const { data: movies } = useMovies();
  const { mutate: addCollection, isPending } = useAddCollection();
  const { toast } = useToast();
  
  const [selectedMovieId, setSelectedMovieId] = useState<string>("");
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const indiaGross = Number(formData.get("indiaGross"));
    const overseasGross = Number(formData.get("overseasGross"));
    
    addCollection({
      movieId: Number(selectedMovieId),
      dayNumber: Number(formData.get("dayNumber")),
      collectionDate: formData.get("collectionDate") as string,
      indiaGross,
      overseasGross,
      totalGross: indiaGross + overseasGross,
      trendDirection: "flat" // simplified for demo
    }, {
      onSuccess: () => {
        toast({ title: "Updated", description: "Collections added successfully" });
        (e.target as HTMLFormElement).reset();
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold">Update Collections</h1>
        <p className="text-muted-foreground">Add daily box office reports.</p>
      </div>

      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
             <CardTitle>Daily Report Form</CardTitle>
             <CardDescription>Enter verified gross figures in Crores.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Select Movie</Label>
                <Select value={selectedMovieId} onValueChange={setSelectedMovieId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a running movie" />
                  </SelectTrigger>
                  <SelectContent>
                    {movies?.filter(m => m.status === 'Running').map(m => (
                      <SelectItem key={m.id} value={m.id.toString()}>{m.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label htmlFor="dayNumber">Day Number</Label>
                   <Input id="dayNumber" name="dayNumber" type="number" min="1" required placeholder="e.g. 1" />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="collectionDate">Date</Label>
                   <div className="relative">
                     <Input id="collectionDate" name="collectionDate" type="date" required />
                     <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label htmlFor="indiaGross">India Gross (Cr)</Label>
                   <Input id="indiaGross" name="indiaGross" type="number" step="0.01" required placeholder="0.00" />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="overseasGross">Overseas Gross (Cr)</Label>
                   <Input id="overseasGross" name="overseasGross" type="number" step="0.01" required placeholder="0.00" />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isPending || !selectedMovieId}>
                {isPending ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
