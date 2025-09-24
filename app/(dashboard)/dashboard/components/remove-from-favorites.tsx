"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import {
  formToFavorites,
  removeFromFavorites,
  resetFavoriteName,
} from "../../favorites/lib/favorites";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FavStationType } from "@/types";

interface LiveStationsProps {
  station: FavStationType;
  children: React.ReactNode;
}

export function RemoveFromFavorites({ station, children }: LiveStationsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;

      const result = await formToFavorites(name, station.id);
      console.log("Submitted:", name, result);

      // ✅ Close the dialog after success
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);

      // ✅ Refetch the query
      await queryClient.refetchQueries({
        queryKey: ["favorites"],
      });
    }
  }
  const removeFavMutation = useMutation({
    mutationFn: async () => {
      return removeFromFavorites(station.id);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["favorites"],
      });
      setOpen(false);
    },
  });

  const resetFavMutation = useMutation({
    mutationFn: async () => {
      return resetFavoriteName(station.id);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["favorites"],
      });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          onClick={() => setOpen(true)}
          className="p-0 flex cursor-pointer align-middles items-center gap-1 text-xs font-medium hover:underline text-muted-foreground"
        >
          <Star fill="currentColor" />
          {station.name !== station.orig_name ? children : "edit favorite"}
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Favorite</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Give a name to your favorite station
        </DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            defaultValue={station.name}
            className="w-full rounded-md border px-3 py-2"
            required
          />

          <DialogFooter>
            <Button
              variant={"destructive"}
              disabled={removeFavMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                removeFavMutation.mutate();
              }}
            >
              {removeFavMutation.isPending ? "removing..." : "remove favorite"}
            </Button>
            <Button
              disabled={resetFavMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                resetFavMutation.mutate();
              }}
            >
              {resetFavMutation.isPending ? "reseting..." : "reset name"}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
