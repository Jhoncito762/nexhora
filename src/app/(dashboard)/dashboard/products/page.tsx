"use client"

import { useEffect, useState } from "react"
import { ModuleHeader } from "../../components/ModuleHeader"
import { Table, Column, TableAction } from "../../components/Table"
import Icon from "@/src/app/shared/Icon"
import axiosPrivate from "@/src/apis/axiosPrivate"
import FormModalProduct from "../../components/products/FormModalProduct"
import ViewModalProduct from "../../components/products/ViewModalProduct"
import Modal from "@/src/app/shared/Modal"

const { Trash2Icon, SquarePenIcon, EyeIcon } = Icon

export type Producto = {
    producto_id: number
    nombre: string
    eslogan: string
    descripcion: string
    link_web: string
    created_at: string
    updated_at: string
}

type Pagination = {
    totalCount: number
}

export default function ProductsPage() {
    const [productos, setProductos] = useState<Producto[]>([])
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

    const fetchProductos = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axiosPrivate.get<{ data: Producto[]; pagination: Pagination }>(
                process.env.NEXT_PUBLIC_GET_PRODUCTS!,
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
        fetchProductos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, offset])

    const columns: Column<Producto>[] = [
        {
            key: "producto_id",
            label: "ID",
            render: (row) => <span className="text-muted-foreground">#{row.producto_id}</span>,
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
            key: "eslogan",
            label: "Eslogan",
            render: (row) => (
                <span className="block max-w-40 truncate text-muted-foreground" title={row.eslogan}>
                    {row.eslogan || "—"}
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
            key: "link_web",
            label: "Link Web",
            render: (row) =>
                row.link_web ? (
                    <a
                        href={row.link_web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block max-w-40 truncate text-accent hover:underline text-sm"
                        title={row.link_web}
                    >
                        {row.link_web}
                    </a>
                ) : (
                    <span className="text-muted-foreground">—</span>
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
            await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_GET_PRODUCTS}/${deleteId}`)
            setDeleteId(null)
            fetchProductos()
        } catch {
            setDeleteId(null)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <ModuleHeader
                title="Gestión de Productos"
                description="Administra, filtra y monitorea todos los productos creados de la organización."
                buttonLabel="Nuevo producto"
                onButtonClick={() => setCreateOpen(true)}
            />

            <div className="mt-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
                        <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Cargando productos...
                    </div>
                ) : error ? (
                    <p role="alert" className="text-center text-red-500 text-sm py-10">{error}</p>
                ) : (
                    <Table<Producto>
                        columns={columns}
                        data={productos}
                        getRowId={(row) => row.producto_id}
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

            {/* Crear */}
            <FormModalProduct
                isOpen={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={fetchProductos}
            />

            {/* Editar */}
            <FormModalProduct
                isOpen={editId !== null}
                productoId={editId ?? undefined}
                onClose={() => setEditId(null)}
                onSuccess={fetchProductos}
            />

            {/* Ver detalle */}
            <ViewModalProduct
                isOpen={viewId !== null}
                productoId={viewId ?? undefined}
                onClose={() => setViewId(null)}
                onEdit={(id: number) => { setViewId(null); setEditId(id) }}
            />

            {/* Confirmar eliminación */}
            <Modal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                type="warning"
                title="Eliminar producto"
                message={`¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.`}
                confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
                cancelText="Cancelar"
                showCancel
                onConfirm={handleDelete}
            />
        </>
    )
}