"use client"

import { useEffect, useState } from "react"
import { ModuleHeader } from "../../components/ModuleHeader"
import { Table, Column, TableAction } from "../../components/Table"
import axiosPrivate from "@/src/apis/axiosPrivate"
import Icon from '@/src/app/shared/Icon'
import FormModalEvent from "../../components/events/FormModalEvent"
import Modal from "@/src/app/shared/Modal"
import ViewModalEvent from "../../components/events/ViewModalEvent"

const { Trash2Icon, SquarePenIcon, EyeIcon } = Icon

export type Evento = {
    evento_id: number
    titulo: string
    resumen: string
    descripcion: string
    fecha_evento: string
    created_at: string
    updated_at: string
}

type Pagination = {
    totalCount: number
}

export default function page() {
    const [eventos, setEventos] = useState<Evento[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(0)
    const [total, setTotal] = useState(0)
    const [createOpen, setCreateOpen] = useState(false)
    const [viewId, setViewId] = useState<number | null>(null)
    const [editId, setEditId] = useState<number | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchEventos = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axiosPrivate.get<{ data: Evento[]; pagination: Pagination }>(
                process.env.NEXT_PUBLIC_EVENTS!,
                { params: { limit, offset } }
            )
            setEventos(response.data.data)
            setTotal(response.data.pagination.totalCount)
        } catch {
            setError("No se pudieron cargar los productos. Intenta de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchEventos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, offset])

    const columns: Column<Evento>[] = [
        {
            key: "evento_id",
            label: "ID",
            render: (row) => <span className="text-muted-foreground">#{row.evento_id}</span>,
        },
        {
            key: "titulo",
            label: "Título",
            render: (row) => (
                <span className="font-medium block max-w-35 truncate" title={row.titulo}>
                    {row.titulo}
                </span>
            ),
        },
        {
            key: "resumen",
            label: "Resumen",
            render: (row) => (
                <span className="block max-w-40 truncate font-medium" title={row.resumen}>
                    {row.resumen || "—"}
                </span>
            ),
        },
        {
            key: "fecha_evento",
            label: "Fecha Evento",
            render: (row) => (
                <span className="block max-w-50 truncate font-medium" title={row.fecha_evento}>
                    {new Date(row.fecha_evento).toLocaleString("es-CO", {
                        year: "numeric", month: "2-digit", day: "2-digit",
                        hour: "2-digit", minute: "2-digit",
                    })}
                </span>
            ),
        },
        {
            key: "created_at",
            label: "Creado",
            render: (row) => (
                <span className="font-medium whitespace-nowrap">
                    {new Date(row.created_at).toLocaleString("es-CO", {
                        year: "numeric", month: "2-digit", day: "2-digit",
                        hour: "2-digit", minute: "2-digit",
                    })}
                </span>
            ),
        },
        {
            key: "updated_at",
            label: "Editado",
            render: (row) => (
                <span className="font-medium whitespace-nowrap">
                    {new Date(row.updated_at).toLocaleString("es-CO", {
                        year: "numeric", month: "2-digit", day: "2-digit",
                        hour: "2-digit", minute: "2-digit",
                    })}
                </span>
            ),
        },
    ]

    const actions: TableAction[] = [
        {
            label: "Ver",
            variant: "default",
            icon: <EyeIcon size={15} />,
            onClick: (ids) => setViewId(Number([...ids][0])),
        },
        {
            label: "Editar",
            variant: "default",
            icon: <SquarePenIcon size={15} />,
            onClick: (ids) => setEditId(Number([...ids][0])),
        },
        {
            label: "Eliminar",
            variant: "danger",
            icon: <Trash2Icon size={15} />,
            onClick: (ids) => setDeleteId(Number([...ids][0])),
        },
    ]

    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_EVENTS}/${deleteId}`)
            setDeleteId(null)
            fetchEventos()
        } catch {
            setDeleteId(null)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <ModuleHeader
                title="Gestión de Eventos"
                description="Administra, filtra y monitorea todos los eventos participados por la organización."
                buttonLabel="Nuevo evento"
                onButtonClick={() => setCreateOpen(true)}
            />

            <div className="mt-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
                        <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Cargando eventos...
                    </div>
                ) : error ? (
                    <p role="alert" className="text-center text-red-500 text-sm py-10">{error}</p>
                ) : (
                    <Table<Evento>
                        columns={columns}
                        data={eventos}
                        getRowId={(row) => row.evento_id}
                        singleSelect
                        actions={actions}
                        searchPlaceholder="Buscar evento..."
                        pagination={{
                            total,
                            limit,
                            offset,
                            onLimitChange: setLimit,
                            onOffsetChange: setOffset,
                        }}
                    />
                )}
            </div>


            <FormModalEvent
                isOpen={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={fetchEventos}
            />

            {/* Editar */}
            <FormModalEvent
                isOpen={editId !== null}
                eventoId={editId ?? undefined}
                onClose={() => setEditId(null)}
                onSuccess={fetchEventos}
            />

            <ViewModalEvent
                isOpen={viewId !== null}
                eventoId={viewId ?? undefined}
                onClose={() => setViewId(null)}
                onEdit={(id: number) => { setViewId(null); setEditId(id) }}
            />
            <Modal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                type="warning"
                title="Eliminar evento"
                message={`¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.`}
                confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
                cancelText="Cancelar"
                showCancel
                onConfirm={handleDelete}
            />
        </>
    )
}
