"use client";

import React, { useEffect, useState } from 'react'
import { Table, Column, TableAction } from "../../components/Table"
import Icon from '@/src/app/shared/Icon';
import axiosPrivate from '@/src/apis/axiosPrivate';
import { ModuleHeader } from '../../components/ModuleHeader';
import FormModalUser from '../../components/users/FormModalUser';
import Modal from '@/src/app/shared/Modal';

const { Trash2Icon, SquarePenIcon } = Icon;

type User = {
    usuario_id: number
    nombre_completo: string
    correo: string
    telefono: string
    foto_link: string
    estado: boolean
    rol_id: number
    rol_nombre: string
    created_at: string
    updated_at: string
}

type Pagination = {
    totalCount: number
    limit: number
    offset: number
    totalPages: number
    currentPage: number
}

export const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1)


const columns: Column<User>[] = [
    {
        key: "usuario_id",
        label: "ID",
        render: (row) => <span className="text-muted-foreground">#{row.usuario_id}</span>,
    },
    {
        key: "nombre_completo",
        label: "Nombre",
        sortable: true,
        render: (row) => <span className="font-medium">{row.nombre_completo}</span>,
    },
    {
        key: "correo",
        label: "Correo",
        sortable: true,
        render: (row) => <span className="font-medium">{row.correo}</span>,
    },
    {
        key: "telefono",
        label: "Teléfono",
        sortable: true,
        render: (row) => <span className="font-medium">{row.telefono}</span>,
    },
    {
        key: "rol",
        label: "Rol",
        sortable: true,
        render: (row) => <span className="font-medium">{capitalize(row.rol_nombre)}</span>,
    },
    {
        key: "created_at",
        label: "Creado",
        sortable: true,
        render: (row) => {
            const fecha = new Date(row.created_at)
            const fechaFormateada = fecha.toLocaleString('es-CO', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
            return <span className="font-medium">{fechaFormateada}</span>
        },
    },
    {
        key: "updated_at",
        label: "Editado",
        sortable: true,
        render: (row) => {
            const fecha = new Date(row.updated_at)
            const fechaFormateada = fecha.toLocaleString('es-CO', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
            return <span className="font-medium">{fechaFormateada}</span>
        },
    }
]



export default function UsersModule() {

    const [users, setUsers] = useState<User[]>([])
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

    const fetchUsers = async () => {
        try {
            const response = await axiosPrivate.get<{ data: User[]; pagination: Pagination }>(
                process.env.NEXT_PUBLIC_GET_USERS!, {
                params: { limit, offset }
            }
            )

            const { data, pagination } = response.data
            setUsers(data)
            setTotal(pagination.totalCount)
        } catch {
            setError("No se pudieron cargar los usuarios. Intenta de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [limit, offset])

    const actions: TableAction[] = [
        // {
        //     label: "Ver",
        //     variant: "default",
        //     icon: <EyeIcon size={15} />,
        //     onClick: (ids) => setViewId(Number([...ids][0])),
        // },
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
            await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_GET_USERS}/${deleteId}`)
            setDeleteId(null)
            fetchUsers()
        } catch {
            setDeleteId(null)
        } finally {
            setIsDeleting(false)
        }
    }
    return (
        <>
            <ModuleHeader
                title="Gestión de Usuarios"
                description="Administra, filtra y monitorea todos los usuarios de la organización."
                buttonLabel="Nuevo usuario"
                onButtonClick={() => setCreateOpen(true)}
            />

            <div className="mt-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
                        <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Cargando usuarios...
                    </div>
                ) : error ? (
                    <p role="alert" className="text-center text-red-500 text-sm py-10">{error}</p>
                ) : (
                    <Table<User>
                        columns={columns}
                        data={users}
                        getRowId={(row) => row.usuario_id}
                        actions={actions}
                        searchPlaceholder="Buscar usuario..."
                        pagination={{
                            total,
                            limit,
                            offset,
                            onLimitChange: setLimit,
                            onOffsetChange: setOffset
                        }}
                    />
                )}
            </div>

            <FormModalUser
                isOpen={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={fetchUsers}
            />

            {/* Editar */}
            <FormModalUser
                isOpen={editId !== null}
                userId={editId ?? undefined}
                onClose={() => setEditId(null)}
                onSuccess={fetchUsers}
            />

            <Modal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                type="warning"
                title="Eliminar usuario"
                message={`¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.`}
                confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
                cancelText="Cancelar"
                showCancel
                onConfirm={handleDelete}
            />
        </>
    )
}
