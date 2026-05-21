"use client"

import { useEffect, useState } from "react"
import axiosPrivate from "@/src/apis/axiosPrivate"
import { Table, Column, TableAction } from "../../components/Table"
import Icon from "@/src/app/shared/Icon"
import { ModuleHeader } from "../../components/ModuleHeader"
import FormModalService from "../../components/services/FormModalService"
import Modal from "@/src/app/shared/Modal"
import ViewModalService from "../../components/services/ViewModalService"

const { Trash2Icon, SquarePenIcon, EyeIcon } = Icon


export type Servicio = {
    servicio_id: number
    nombre: string
    descripcion: string
    estado: boolean
    created_at: string
    updated_at: string
}

type Pagination = {
    totalCount: number
}

export default function ServicesPage() {
    const [servicios, setServicios] = useState<Servicio[]>([])
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

    const fetchServices = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axiosPrivate.get<{ data: Servicio[]; pagination: Pagination }>(
                process.env.NEXT_PUBLIC_GET_SERVICES!,
                { params: { limit, offset } }
            )
            setServicios(response.data.data)
            setTotal(response.data.pagination.totalCount)
        } catch {
            setError("No se pudieron cargar los servicios. Intenta de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchServices()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, offset])

    const columns: Column<Servicio>[] = [
        {
            key: "servicio_id",
            label: "ID",
            render: (row) => <span className="text-muted-foreground">#{row.servicio_id}</span>,
        },
        {
            key: "nombre",
            label: "Nombre",
            render: (row) => (
                <span className="font-medium block max-w-35 truncate" title={row.nombre}>
                    {row.nombre}
                </span>
            ),
        },
        {
            key: "descripcion",
            label: "Descripción",
            render: (row) => (
                <span className="block max-w-50 truncate text-muted-foreground" title={row.descripcion}>
                    {row.descripcion || "—"}
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
            await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_SERVICE}/${deleteId}`)
            setDeleteId(null)
            fetchServices()
        } catch {
            setDeleteId(null)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <ModuleHeader
                title="Gestión de Servicios"
                description="Administra, filtra y monitorea todos los servicios creados de la organización."
                buttonLabel="Nuevo servicio"
                onButtonClick={() => setCreateOpen(true)}
            />
            <div className="mt-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
                        <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Cargando servicios...
                    </div>
                ) : error ? (
                    <p role="alert" className="text-center text-red-500 text-sm py-10">{error}</p>
                ) : (
                    <Table<Servicio>
                        columns={columns}
                        data={servicios}
                        getRowId={(row) => row.servicio_id}
                        actions={actions}
                        searchPlaceholder="Buscar servicio..."
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

            <FormModalService
                isOpen={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={fetchServices}
            />

            {/* Editar */}
            <FormModalService
                isOpen={editId !== null}
                servicioId={editId ?? undefined}
                onClose={() => setEditId(null)}
                onSuccess={fetchServices}
            />

            <ViewModalService
                isOpen={viewId !== null}
                servicioId={viewId ?? undefined}
                onClose={() => setViewId(null)}
                onEdit={(id: number) => { setViewId(null); setEditId(id) }}
            />

            <Modal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                type="warning"
                title="Eliminar servicio"
                message={`¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.`}
                confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
                cancelText="Cancelar"
                showCancel
                onConfirm={handleDelete}
            />
        </>
    )
}
