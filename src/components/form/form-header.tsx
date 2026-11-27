import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormHeaderProps {
	children: ReactNode;
	className?: string;
}

export function FormHeader({ children, className }: FormHeaderProps) {
	return (
		<div
			className={cn(
				"sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 py-3 px-4 -mx-4",
				className,
			)}
		>
			{children}
		</div>
	);
}
