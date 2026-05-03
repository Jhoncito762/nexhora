"use client"

import Icon from "../../shared/Icon"

const { ChevronLeftIcon, ChevronRightIcon } = Icon;

const DEFAULT_LIMIT_OPTIONS = [5, 10, 20, 50]

export interface PaginatorProps {
    total: number
    limit: number
    offset: number
    onLimitChange: (limit: number) => void
    onOffsetChange: (offset: number) => void
    limitOptions?: number[]
}

export function Paginator({
    total,
    limit,
    offset,
    onLimitChange,
    onOffsetChange,
    limitOptions = DEFAULT_LIMIT_OPTIONS,
}: PaginatorProps) {
    const currentPage = Math.floor(offset / limit) + 1
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const from = total === 0 ? 0 : offset + 1
    const to = Math.min(offset + limit, total)

    const goTo = (page: number) => {
        onOffsetChange((page - 1) * limit)
    }

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = Number(e.target.value)
        // Reset to first page when limit changes
        onOffsetChange(0)
        onLimitChange(newLimit)
    }

    // Generate visible page numbers with ellipsis
    const getPages = (): (number | "...")[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }
        const pages: (number | "...")[] = [1]
        if (currentPage > 3) pages.push("...")
        for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
            pages.push(p)
        }
        if (currentPage < totalPages - 2) pages.push("...")
        pages.push(totalPages)
        return pages
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-border">
            {/* Info + limit selector */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>
                    {total === 0
                        ? "Sin resultados"
                        : `Mostrando ${from}–${to} de ${total}`}
                </span>
                <div className="flex items-center gap-1.5">
                    <label htmlFor="paginator-limit" className="text-xs">
                        Filas:
                    </label>
                    <select
                        id="paginator-limit"
                        value={limit}
                        onChange={handleLimitChange}
                        className="h-7 px-2 rounded-lg bg-secondary border border-border text-foreground text-xs outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer"
                    >
                        {limitOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Page controls */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => goTo(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <ChevronLeftIcon size={14} />
                </button>

                {getPages().map((page, i) =>
                    page === "..." ? (
                        <span
                            key={`ellipsis-${i}`}
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground text-sm select-none"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => goTo(page)}
                            aria-label={`Ir a página ${page}`}
                            aria-current={page === currentPage ? "page" : undefined}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${page === currentPage
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() => goTo(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Página siguiente"
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <ChevronRightIcon size={14} />
                </button>
            </div>
        </div>
    )
}
