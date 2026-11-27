// src/components/fields/star-rating.tsx

"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
	rating: number;
	maxRating?: number;
	size?: "sm" | "md" | "lg";
	interactive?: boolean;
	onChange?: (rating: number) => void;
	className?: string;
}

export function StarRating({
	rating,
	maxRating = 5,
	size = "md",
	interactive = false,
	onChange,
	className,
}: StarRatingProps) {
	const sizeClasses = {
		sm: "h-3 w-3",
		md: "h-4 w-4",
		lg: "h-5 w-5",
	};

	return (
		<div className={cn("flex items-center gap-0.5", className)}>
			{Array.from({ length: maxRating }, (_, i) => ({
				id: `star-${i}`,
				value: i + 1,
			})).map((star) => (
				<Star
					key={star.id}
					className={cn(
						sizeClasses[size],
						star.value <= rating
							? "fill-yellow-400 text-yellow-400"
							: "text-gray-300",
						interactive &&
							"cursor-pointer hover:scale-110 transition-transform",
					)}
					onClick={() => interactive && onChange?.(star.value)}
				/>
			))}
		</div>
	);
}
