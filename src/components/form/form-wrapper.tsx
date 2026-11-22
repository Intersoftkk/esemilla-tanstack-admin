export function FormWrapper({
                                children,
                                onSubmit,
                            }: {
    children: React.ReactNode
    onSubmit: () => void
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {children}
        </form>
    )
}
