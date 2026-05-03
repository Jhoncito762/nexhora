"use client"

import { useEffect, useState } from "react"
import axiosPrivate from "@/src/apis/axiosPrivate"
import { ModuleHeader } from "../../components/ModuleHeader"
import { Table, Column, TableAction } from "../../components/Table"
import Icon from "@/src/app/shared/Icon"
import Modal from "@/src/app/shared/Modal"
import FormModalRol from "../../components/roles/FormModalRol"
import { capitalize } from "../users/page"

const { Trash2Icon, SquarePenIcon } = Icon

type Rol = {
    rol_id: number
    nombre: string
}

export default function RolesPage() {
    const [roles, setRoles] = useState<Rol[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [createOpen, setCreateOpen] = useState(false)
    const [editId, setEditId] = useState<number | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchRoles = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axiosPrivate.get<{ total: number; roles: Rol[] }>(
                process.env.NEXT_PUBLIC_GET_ROLES!
            )
            setRoles(response.data.roles)
        } catch {
            setError("No se pudieron cargar los roles. Intenta de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRoles()
    }, [])

    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_GET_ROLES}/${deleteId}`)
            setDeleteId(null)
            fetchRoles()
        } catch {
            setDeleteId(null)
        } finally {
            setIsDeleting(false)
        }
    }

    const columns: Column<Rol>[] = [
        {
            key: "rol_id",
            label: "ID",
            render: (row) => <span className="text-muted-foreground">#{row.rol_id}</span>,
        },
        {
            key: "nombre",
            label: "Nombre",
            sortable: true,
            render: (row) => <span className="font-medium">{capitalize(row.nombre)}</span>,
        },
    ]

    const actions: TableAction[] = [
        {
            label: "Editar",
            variant: "default",
            icon: <SquarePenIcon size={16} />,
            onClick: (ids) => setEditId(Number([...ids][0])),
        },
        {
            label: "Eliminar",
            variant: "danger",
            icon: <Trash2Icon size={16} />,
            onClick: (ids) => setDeleteId(Number([...ids][0])),
        },
    ]

    return (
        <>
            <ModuleHeader
                title="Gestión de Roles"
                description="Administra, filtra y monitorea todos los roles de la organización."
                buttonLabel="Nuevo rol"
                onButtonClick={() => setCreateOpen(true)}
            />

            <div className="mt-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
                        <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Cargando roles...
                    </div>
                ) : error ? (
                    <p role="alert" className="text-center text-red-500 text-sm py-10">{error}</p>
                ) : (
                    <Table<Rol>
                        columns={columns}
                        data={roles}
                        getRowId={(row) => row.rol_id}
                        singleSelect
                        actions={actions}
                        searchPlaceholder="Buscar rol..."
                    />
                )}
            </div>

            {/* Crear */}
            <FormModalRol
                isOpen={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={fetchRoles}
            />

            {/* Editar */}
            <FormModalRol
                isOpen={editId !== null}
                rolId={editId ?? undefined}
                onClose={() => setEditId(null)}
                onSuccess={fetchRoles}
            />

            {/* Confirmar eliminación */}
            <Modal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                type="warning"
                title="Eliminar rol"
                message="¿Estás seguro de que deseas eliminar este rol? Esta acción no se puede deshacer."
                confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
                cancelText="Cancelar"
                showCancel
                onConfirm={handleDelete}
            />
        </>
    )
}



