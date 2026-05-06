"use client"

import { useEffect, useState } from "react"
import { ModuleHeader } from "../../components/ModuleHeader"
import { Table, Column, TableAction } from "../../components/Table"
import Icon from "@/src/app/shared/Icon"
import axiosPrivate from "@/src/apis/axiosPrivate"
import FormModalProduct from "../../components/products/FormModalProduct"
import ViewModalProduct from "../../components/products/ViewModalProduct"
import Modal from "@/src/app/shared/Modal"
import FormModalParameter from "../../components/parameters/FormModalParameter"

const { Trash2Icon, SquarePenIcon, EyeIcon } = Icon

export type Parametro = {
    parametro_id: number
    clave: string
    valor: string
    descripcion: string
    created_at: string
    updated_at: string
}

type Pagination = {
    totalCount: number
}

export default function page() {

    const [productos, setProductos] = useState<Parametro[]>([])
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

    const fetchParameters = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axiosPrivate.get<{ data: Parametro[]; pagination: Pagination }>(
                process.env.NEXT_PUBLIC_PARAMETERS!,
                { params: { limit, offset } }
            )
            setProductos(response.data.data)
            setTotal(response.data.pagination.totalCount)
        } catch {
            setError("No se pudieron cargar los productos. Intenta de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchParameters()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, offset])

    const columns: Column<Parametro>[] = [
        {
            key: "parametro_id",
            label: "ID",
            render: (row) => <span className="text-muted-foreground">#{row.parametro_id}</span>,
        },
        {
            key: "clave",
            label: "Clave",
            render: (row) => (
                <span className="font-medium block max-w-35 truncate" title={row.clave}>
                    {row.clave}
                </span>
            ),
        },
        {
            key: "valor",
            label: "Valor",
            render: (row) => (
                <span className="block max-w-40 truncate font-medium" title={row.valor}>
                    {row.valor || "—"}
                </span>
            ),
        },
        {
            key: "descripcion",
            label: "Descripción",
            render: (row) => (
                <span className="block max-w-50 truncate font-medium" title={row.descripcion}>
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
            await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_PARAMETERS}/${deleteId}`)
            setDeleteId(null)
            fetchParameters()
        } catch {
            setDeleteId(null)
        } finally {
            setIsDeleting(false)
        }
    }
    return (
        <>
            <ModuleHeader
                title="Gestión de Parámetros"
                description="Administra, filtra y monitorea todos los parámetros creados de la organización."
                buttonLabel="Nuevo parámetro"
                onButtonClick={() => setCreateOpen(true)}
            />

            <div className="mt-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
                        <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Cargando parámetros...
                    </div>
                ) : error ? (
                    <p role="alert" className="text-center text-red-500 text-sm py-10">{error}</p>
                ) : (
                    <Table<Parametro>
                        columns={columns}
                        data={productos}
                        getRowId={(row) => row.parametro_id}
                        singleSelect
                        actions={actions}
                        searchPlaceholder="Buscar producto..."
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

            <FormModalParameter
                isOpen={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={fetchParameters}
            />

            {/* Editar */}
            <FormModalParameter
                isOpen={editId !== null}
                parametroId={editId ?? undefined}
                onClose={() => setEditId(null)}
                onSuccess={fetchParameters}
            />

            <Modal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                type="warning"
                title="Eliminar parámetro"
                message={`¿Estás seguro de que deseas eliminar este parámetro? Esta acción no se puede deshacer.`}
                confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
                cancelText="Cancelar"
                showCancel
                onConfirm={handleDelete}
            />


        </>
    )
}
