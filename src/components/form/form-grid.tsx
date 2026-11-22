export function FormGrid({
                             children,
                             cols = 2,
                         }: {
    children: React.ReactNode
    cols?: number
}) {
    return (
        <div
            className={`grid gap-4 ${
                cols === 2
                    ? 'md:grid-cols-2'
                    : cols === 3
                        ? 'md:grid-cols-3'
                        : 'md:grid-cols-4'
            }`}
        >
            {children}
        </div>
    )
}
