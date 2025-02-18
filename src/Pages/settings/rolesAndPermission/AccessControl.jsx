import Pagination from "@/components/Pagination";
import UserAreaHeader from "@/components/UserAreaHeader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiDelete, get } from "@/functions";
import { useQuery } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { MoreVertical, Search, Shield } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddRole from "./AddRole";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import EditRole from "./EditRole";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "@/hooks/use-toast";

export default function AccessControl() {

    const navigate = useNavigate()
    const [roles, setRoles] = useState([])
    const [searchFilter, setSearchFilter] = useState("");
    const [addRoleBox, setAddRoleBox] = useState(false);
    const [editRoleBox, setEditRoleBox] = useState(false);
    const [roleId, setRoleId] = useState(null)
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10
    const { confirmAction } = useConfirm()

    const confirmModalSetup = {
        delete: {
            title: 'Are you sure?',
            message: "you're about to delete this role, This action cannot be undone.",
            confirmButtonText: 'Delete',
            buttonVariant: 'error',
            cancelButtonText: 'Cancel'
        },
        activate: {
            title: 'Activate Role?',
            message: 'This action will activate the role and allow it to be visible to users.',
            confirmButtonText: 'Activate',
            buttonVariant: 'primary',
            cancelButtonText: 'Cancel'
        },
        deactivate: {
            title: 'Deactivate Role?',
            message: 'This action will deactivate the role and allow it to be invisible to users.',
            confirmButtonText: 'Deactivate',
            buttonVariant: 'primary',
            cancelButtonText: 'Cancel'
        }
    }

    const handleConfirmation = async (roleId) => await apiDelete(`/roles/${roleId}/destroy`)


    const columns = useMemo(() => [
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Description",
            accessorKey: "description",
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <MoreVertical className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 cursor-pointer">
                            <DropdownMenuItem onClick={() => { setRoleId(row.original); setEditRoleBox(true) }}>
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleActionClick(row.original.id, 'delete')}>
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], []);

    const filteredRole = useMemo(() => {
        if (!searchFilter) return roles || [];

        const lowerCaseFilter = searchFilter.toLowerCase();

        return (roles || []).filter(role =>
            role.name.toLowerCase().includes(lowerCaseFilter)
        );
    }, [roles, searchFilter]);

    const table = useReactTable({
        data: filteredRole,
        columns,
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        onPaginationChange: ({ pageIndex }) => {
            setPageIndex(pageIndex ?? 0);
        },
        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
    });

    const { isLoading, refetch: fetchRoles } = useQuery({
        queryKey: ["roles"],
        queryFn: async () => {
            const res = await get(`/roles`);
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            const response = await res.json();
            setRoles(response.data)
            return response.data;
        },
        enabled: false
    });

    useEffect(() => {
        fetchRoles()
    }, [])

    const handleDeleteResponse = (res) => {
        if (res.ok) {
            toast({
                success: true,
                duration: 5000,
                title: 'Role deleted successfully!'
            });
            fetchRoles()
        } else {
            toast({
                error: true,
                duration: 5000,
                title: 'Failed to delete the Role. Please try again.'
            });
        }
    }

    const handleActionClick = (roleId, actionType) => {
        confirmAction({
            ...confirmModalSetup[actionType.toLowerCase()],
            isDestructive: actionType.toLowerCase() === 'delete',
            confirmFn: () => handleConfirmation(roleId, actionType),
            completeFn: (res) => {
                if (actionType.toLowerCase() === 'delete') {
                    handleDeleteResponse(res)
                }
                else {
                    handleStatusUpdateResponse(res, actionType == 'Activate')
                }
            }

        })
    };

    const closeAddRoleBox = () => {
        setAddRoleBox(false)
        fetchRoles()
    }
    const handleEditClose = () => {
        setEditRoleBox(false)
        fetchRoles()
    }


    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    Setting
                </BreadcrumbItem>
                <BreadcrumbSeparator className='mt-1' />
                <BreadcrumbItem>
                    <BreadcrumbPage>Access Control</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );


    return (
        <div>
            <UserAreaHeader pages={breadcrumb} />

            {isLoading && (
                <div className="text-center flex items-center justify-center mx-auto my-5">
                    <Spinner className="me-3 text-gray-300 h-16 w-16" />
                </div>
            )}

            {!isLoading && !roles?.length && (
                <div className='mx-auto items-center mt-16 grid place-items-center text-center'>
                    <div className="bg-grey w-[170px] grid place-items-center  h-[170px] rounded-[50%]">
                        <Shield className='w-[100px] h-[100px] text-primary' />
                    </div>
                    <h1 className="text-[1.5rem] my-6  font-bold">No Data Found!</h1>
                    <Button variant='primary' onClick={() => (setAddRoleBox(true))}>Add</Button>
                </div>
            )}
            {!!roles?.length && (
                <div>
                    <div className="flex justify-between mx-6 my-8 ">
                        <div className="mb-4">
                            <Search className="text-gray-300 w-4 absolute mt-[10px] ml-4" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                                className="border border-b-gray-300 pl-9 rounded px-4 py-2 w-[300px] outline-none"
                            />
                        </div>
                        <Button variant='primary' onClick={() => (setAddRoleBox(true))}>Add</Button>
                    </div>
                    <div className="content w-[95%] my-6 mx-auto rounded-[8px] border border-gray-200 overflow-hidden">
                        {table.getPageCount() > 0 && (
                            <Table>
                                <TableHeader className="bg-lightPrimary">
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} className="hover:bg-grey">
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={row.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        <Pagination table={table} pageIndex={pageIndex} setPageIndex={setPageIndex} />

                    </div>
                </div>
            )}

            {!!addRoleBox && (
                <AddRole closeFn={closeAddRoleBox} />
            )}

            {!!editRoleBox && <EditRole closeFn={handleEditClose} editId={roleId} />}
        </div>
    )
}