import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useMovies, useCreateMovie } from "@/hooks/use-movies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

export default function ManageMovies() {
  const { data: movies, isLoading } = useMovies();
  const { mutate: createMovie, isPending } = useCreateMovie();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createMovie({
      title: formData.get("title") as string,
      posterUrl: formData.get("posterUrl") as string,
      releaseDate: formData.get("releaseDate") as string,
      budget: Number(formData.get("budget")),
      verdict: "Pending",
      status: "Running",
      notes: ""
    }, {
      onSuccess: () => {
        setOpen(false);
        toast({ title: "Success", description: "Movie added successfully" });
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold">Manage Movies</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Movie</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Movie Title</Label>
                <Input id="title" name="title" required placeholder="e.g. Pushpa 2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="posterUrl">Poster URL</Label>
                <Input id="posterUrl" name="posterUrl" required placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="releaseDate">Release Date</Label>
                   <Input id="releaseDate" name="releaseDate" type="date" required />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="budget">Budget (Cr)</Label>
                   <Input id="budget" name="budget" type="number" required />
                 </div>
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating..." : "Create Movie"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : movies?.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell className="font-medium">{movie.title}</TableCell>
                <TableCell>{new Date(movie.releaseDate).toLocaleDateString()}</TableCell>
                <TableCell>₹{movie.budget}Cr</TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded text-xs border ${
                    movie.status === 'Running' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {movie.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
