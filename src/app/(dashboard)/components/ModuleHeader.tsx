interface ModuleHeaderProps {
    label?: string
    title: string
    description: string
    buttonLabel?: string
    onButtonClick?: () => void
}

export function ModuleHeader({
    label = "MÓDULO",
    title,
    description,
    buttonLabel,
    onButtonClick,
}: ModuleHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase mb-1">
                    {label}
                </p>
                <h1 className="text-foreground text-2xl font-bold leading-tight">{title}</h1>
                <p className="text-muted-foreground text-sm mt-1">{description}</p>
            </div>

            {buttonLabel && (
                <button
                    onClick={onButtonClick}
                    className="shrink-0 flex items-center gap-2 h-11 px-5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    {buttonLabel}
                </button>
            )}
        </div>
    )
}
