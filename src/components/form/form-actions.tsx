export function FormActions({ children }: { children: React.ReactNode }) {
	return (
		<div className="sticky bottom-0 z-40 border-t bg-background/95 backdrop-blur p-4 flex justify-end gap-2">
			{children}
		</div>
	);
}
