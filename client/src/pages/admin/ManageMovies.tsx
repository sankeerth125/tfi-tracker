import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCreateMovie, useMovies, useUpdateMovie } from "@/hooks/use-movies";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus } from "lucide-react";
import { useState } from "react";

export default function ManageMovies() {
  const { data: movies, isLoading } = useMovies();
  const { mutate: createMovie, isPending } = useCreateMovie();
  const { mutate: updateMovie, isPending: isUpdating } = useUpdateMovie();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const movieData = {
      title: formData.get("title") as string,
      posterUrl: formData.get("posterUrl") as string,
      releaseDate: formData.get("releaseDate") as string,
      budget: Number(formData.get("budget")),
      verdict: "Pending",
      status: "Running",
      notes: "",
    };

    if (editingMovie) {
      updateMovie(
        { id: editingMovie.id, data: movieData },
        {
          onSuccess: () => {
            setOpen(false);
            setEditingMovie(null);
            toast({
              title: "Success",
              description: "Movie updated successfully",
            });
          },
          onError: (err) => {
            toast({
              title: "Error",
              description: err.message,
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createMovie(movieData, {
        onSuccess: () => {
          setOpen(false);
          toast({ title: "Success", description: "Movie added successfully" });
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleEdit = (movie: any) => {
    setEditingMovie(movie);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setEditingMovie(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setEditingMovie(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold">Manage Movies</h1>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMovie ? "Edit Movie" : "Add New Movie"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Movie Title</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="e.g. Pushpa 2"
                  defaultValue={editingMovie?.title || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="posterUrl">Poster URL</Label>
                <Input
                  id="posterUrl"
                  name="posterUrl"
                  required
                  placeholder="https://..."
                  defaultValue={editingMovie?.posterUrl || ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="releaseDate">Release Date</Label>
                  <Input
                    id="releaseDate"
                    name="releaseDate"
                    type="date"
                    required
                    defaultValue={
                      editingMovie?.releaseDate
                        ? new Date(editingMovie.releaseDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (Cr)</Label>
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    required
                    defaultValue={editingMovie?.budget || ""}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isPending || isUpdating}
              >
                {isPending || isUpdating
                  ? editingMovie
                    ? "Updating..."
                    : "Creating..."
                  : editingMovie
                  ? "Update Movie"
                  : "Create Movie"}
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
                <TableCell colSpan={5} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              movies?.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell className="font-medium">{movie.title}</TableCell>
                  <TableCell>
                    {new Date(movie.releaseDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>₹{movie.budget}Cr</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 rounded text-xs border ${
                        movie.status === "Running"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {movie.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(movie)}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
