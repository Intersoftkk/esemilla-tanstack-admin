import type {ReactNode} from "react";

export function FormHeader({ children }: { children: ReactNode }) {
    return (
        <div className="-mx-4 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="container flex h-16 items-center justify-between gap-4 p-4">
                {children}
            </div>
        </div>
    )
}
