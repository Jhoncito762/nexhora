"use client"

import { useState, useRef, useEffect } from "react"
import Icon from "../../shared/Icon"
import { Paginator, PaginatorProps } from "./Paginator"

const { Search } = Icon;

export interface Column<T> {
    key: string
    label: string
    render: (row: T) => React.ReactNode
    sortable?: boolean
    headerClassName?: string
    cellClassName?: string
}

export interface TableAction {
    label: string
    onClick: (selectedIds: Set<string | number>) => void
    variant?: "default" | "danger"
    icon?: React.ReactNode
}

export interface TableTab {
    label: string
    value: string
}

interface TableProps<T> {
    columns: Column<T>[]
    data: T[]
    getRowId: (row: T) => string | number
    singleSelect?: boolean
    tabs?: TableTab[]
    activeTab?: string
    onTabChange?: (value: string) => void
    actions?: TableAction[]
    searchPlaceholder?: string
    onSearch?: (query: string) => void
    pagination?: PaginatorProps
}

function SelectAllCheckbox({
    checked,
    indeterminate,
    onChange,
}: {
    checked: boolean
    indeterminate: boolean
    onChange: () => void
}) {
    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (ref.current) {
            ref.current.indeterminate = indeterminate
        }
    }, [indeterminate])

    return (
        <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            aria-label="Seleccionar todos"
            className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
        />
    )
}

export function Table<T,>({
    columns,
    data,
    getRowId,
    singleSelect = false,
    tabs,
    activeTab,
    onTabChange,
    actions,
    searchPlaceholder = "Buscar...",
    onSearch,
    pagination,
}: TableProps<T>) {
    const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set())
    const [search, setSearch] = useState("")

    const allIds = data.map(getRowId)
    const allSelected = !singleSelect && allIds.length > 0 && allIds.every(id => selectedIds.has(id))
    const someSelected = !singleSelect && allIds.some(id => selectedIds.has(id)) && !allSelected

    const toggleAll = () => {
        if (singleSelect) return
        setSelectedIds(allSelected ? new Set() : new Set(allIds))
    }

    const toggleRow = (id: string | number) => {
        if (singleSelect) {
            setSelectedIds(prev => prev.has(id) ? new Set() : new Set([id]))
            return
        }
        setSelectedIds(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        onSearch?.(e.target.value)
    }

    const clearSelection = () => setSelectedIds(new Set())

    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">

            <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="search"
                        value={search}
                        onChange={handleSearch}
                        placeholder={searchPlaceholder}
                        aria-label={searchPlaceholder}
                        className="h-9 pl-9 pr-4 w-52 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                </div>

                {tabs && (
                    <div className="flex items-center gap-1 flex-wrap">
                        {tabs.map(tab => (
                            <button
                                key={tab.value}
                                onClick={() => onTabChange?.(tab.value)}
                                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${activeTab === tab.value
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Selection action bar */}
            {selectedIds.size > 0 && (
                <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-secondary border-b border-border">
                    <span className="text-foreground font-medium text-sm">
                        {selectedIds.size} {selectedIds.size === 1 ? "elemento seleccionado" : "elementos seleccionados"}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={clearSelection}
                            className="h-8 px-3 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground text-xs font-medium transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        {actions?.map(action => (
                            <button
                                key={action.label}
                                onClick={() => action.onClick(selectedIds)}
                                className={`flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${action.variant === "danger"
                                    ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                                    : "bg-card border-border text-foreground hover:bg-muted"
                                    }`}
                            >
                                {action.icon}
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-primary border-b border-primary/20">
                            <th className="w-10 px-4 py-3 text-center">
                                {!singleSelect && (
                                    <SelectAllCheckbox
                                        checked={allSelected}
                                        indeterminate={someSelected}
                                        onChange={toggleAll}
                                    />
                                )}
                            </th>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 text-center text-xs font-semibold text-primary-foreground/80 tracking-wider whitespace-nowrap ${col.headerClassName ?? ""}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + 1}
                                    className="px-4 py-12 text-center text-muted-foreground text-sm"
                                >
                                    No hay datos para mostrar.
                                </td>
                            </tr>
                        ) : (
                            data.map(row => {
                                const id = getRowId(row)
                                const isSelected = selectedIds.has(id)
                                return (
                                    <tr
                                        key={id}
                                        className={`border-b border-border last:border-0 transition-colors ${isSelected ? "bg-accent/5" : "hover:bg-secondary/50"} text-center`}
                                    >
                                        <td className="w-10 px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleRow(id)}
                                                aria-label={`Seleccionar fila ${id}`}
                                                className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                                            />
                                        </td>
                                        {columns.map(col => (
                                            <td
                                                key={col.key}
                                                className={`px-4 py-3 text-foreground ${col.cellClassName ?? ""}`}
                                            >
                                                {col.render(row)}
                                            </td>
                                        ))}
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && <Paginator {...pagination} />}
        </div>
    )
}
