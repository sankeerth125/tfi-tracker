import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  releaseDate: string;
  budget: number | null;
  hero: string | null;
  director: string | null;
  verdict: string | null;
  status: string | null;
  notes: string | null;
  createdAt: Date | null;
}

interface MovieSelectorProps {
  movies: Movie[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder: string;
}

export function MovieSelector({
  movies,
  value,
  onValueChange,
  placeholder,
}: MovieSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedMovie = movies.find((movie) => movie.id.toString() === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background"
        >
          {selectedMovie ? selectedMovie.title : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
          />
          <CommandEmpty>No movie found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {movies.map((movie) => (
              <CommandItem
                key={movie.id}
                value={movie.title}
                onSelect={() => {
                  onValueChange(
                    movie.id.toString() === value ? "" : movie.id.toString()
                  );
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === movie.id.toString() ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex items-center gap-2">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-8 h-8 object-cover rounded"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{movie.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {movie.releaseDate} • ₹{movie.budget}Cr
                    </span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
