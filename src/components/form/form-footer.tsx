import type { ReactNode } from "react";

export function FormFooter({ children }: { children?: ReactNode }) {
	return (
		<div className="sticky bottom-0 z-10 flex justify-end bg-background/90 py-4 backdrop-blur">
			{children}
		</div>
	);
}
