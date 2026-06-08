import { useState } from "react";
import { useFetcher } from "react-router";
import { Star } from "lucide-react";
import { cn } from "~/lib/utils";

interface StarRatingDisplayProps {
  rating: number | null;
  reviewCount?: number;
  size?: "sm" | "md";
}

export function StarRatingDisplay({ rating, reviewCount, size = "sm" }: StarRatingDisplayProps) {
  if (rating === null) return null;

  const starSize = size === "sm" ? "size-3.5" : "size-5";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span className={cn("flex items-center gap-1", textSize)}>
      <span className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(starSize, star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30")}
          />
        ))}
      </span>
      <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && reviewCount > 0 && (
        <span className="text-muted-foreground">({reviewCount})</span>
      )}
    </span>
  );
}

interface StarRatingInputProps {
  courseId: number;
  initialRating?: number | null;
}

export function StarRatingInput({ courseId, initialRating }: StarRatingInputProps) {
  const fetcher = useFetcher();
  const [hovered, setHovered] = useState<number | null>(null);

  // Optimistic: reflect the in-flight rating immediately
  const pendingRating = fetcher.formData ? Number(fetcher.formData.get("rating")) : null;
  const selected = pendingRating ?? initialRating ?? null;
  const display = hovered ?? selected;
  const isSaving = fetcher.state !== "idle";

  function handleClick(star: number) {
    fetcher.submit(
      { courseId: String(courseId), rating: String(star) },
      { method: "post", action: "/api/course-review" }
    );
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={isSaving}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleClick(star)}
          className="focus-visible:outline-none disabled:cursor-not-allowed"
          aria-label={`Rate ${star} out of 5 stars`}
        >
          <Star
            className={cn(
              "size-6 transition-colors",
              (display ?? 0) >= star
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground/30 hover:text-amber-300"
            )}
          />
        </button>
      ))}
      {selected !== null && (
        <span className="ml-1 text-sm text-muted-foreground">
          {isSaving ? "Saving…" : "Saved!"}
        </span>
      )}
    </div>
  );
}
