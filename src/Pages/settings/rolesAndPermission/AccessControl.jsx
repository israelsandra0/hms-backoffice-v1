import Pagination from "@/components/Pagination";
import UserAreaHeader from "@/components/UserAreaHeader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Spinner from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiDelete, get } from "@/functions";
import { useQuery } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { MoreVertical, Search, Shield, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import EditRole from "./EditRole";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "@/hooks/use-toast";
import { ButtonLink } from "@/components/ui/button_link";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


export default function AccessControl() {

    const [roles, setRoles] = useState([])
    const [selectedRole, setSelectedRole] = useState(null)
    const [searchFilter, setSearchFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10
    const { confirmAction } = useConfirm()
    const navigate = useNavigate()

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

    const handleEditRole = (editId) => {
        navigate('/setting/access_control/edit', { state: { editId } });
    };

    const handleConfirmation = async (roleId) => await apiDelete(`/roles/${roleId}/destroy`)

    const columns = useMemo(() => [
        {
            header: "Name",
            cell: (info) => {
                return (
                    <span
                        className="cursor-pointer"
                        onClick={() => setSelectedRole(info.row.original)}
                    >
                        {`${info.row.original.name}`}
                    </span>
                );
            },
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
                            <DropdownMenuItem onClick={() => setSelectedRole(row.original)}>
                                <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditRole(row.original)}>
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

    const { isFetching, refetch: fetchRoles } = useQuery({
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

            {isFetching ?
                (
                    <div className="text-center flex items-center justify-center mx-auto mt-28">
                        <Spinner className="me-3 text-gray-300 h-16 w-16" />
                    </div>
                )
                :
                roles && roles?.length > 0 ? (
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
                            <ButtonLink to="/setting/access_control/create" variant="primary">
                                Add
                            </ButtonLink>
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
                ) : (
                    <div className='mx-auto items-center mt-16 grid place-items-center text-center'>
                        <div className="bg-grey w-[170px] grid place-items-center  h-[170px] rounded-[50%]">
                            <Shield className='w-[100px] h-[100px] text-primary' />
                        </div>
                        <h1 className="text-[1.5rem] my-6  font-bold">No Data Found!</h1>
                        <ButtonLink to="/setting/access_control/create" variant="primary">
                            Add
                        </ButtonLink>
                    </div>
                )

            }

            {!!selectedRole && (
                <Card className="fixed inset-x-0 inset-y-0 bg-black/50 h-screen flex justify-center items-center">
                    <CardContent className="fixed rounded sm:rounded-xl md:rounded-xl lg:rounded-xl left-[50%] top-[50%] z-50 grid w-[400px] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-white p-6 shadow-lg duration-200">
                        <div className="flex">
                            <X
                                className="ring-2 p-1 ring-[#F2F2F5] rounded-full text-gray-400"
                                onClick={() => setSelectedRole(null)}
                            />
                            <h1 className="mx-auto text-[1.3rem] font-bold mb-2">Role Details</h1>
                        </div>
                        <p>
                            <h1 className="text-[1.2rem]">Role</h1>
                            <strong>
                                <i>{`${selectedRole.name}`}</i>
                            </strong>
                        </p>

                        <p>
                            <h1 className="text-[1.2rem]">Description</h1>
                            <strong>
                                <i>{`${selectedRole.description}`}</i>
                            </strong>
                        </p>

                        <div>
                            <h1 className="text-[1.2rem]">
                                Permissions ({selectedRole.permissions.length}) 
                            </h1>

                            <Accordion type="multiple" className="w-full">
                                {Object.entries(
                                    selectedRole.permissions.reduce((acc, perm) => {
                                        if (!acc[perm.category]) acc[perm.category] = [];
                                        acc[perm.category].push(perm.name);
                                        return acc;
                                    }, {})
                                ).map(([category, names], index) => (
                                    <AccordionItem key={category} value={`item-${index}`}>
                                        <AccordionTrigger className="text-[1rem]">{category}</AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="list-disc list-inside space-y-1">
                                                {names.map((name, idx) => (
                                                    <li key={idx}>{name}</li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>

                    </CardContent>
                </Card>
            )}

            {/* {isFetching && (
                <div className="text-center flex items-center justify-center mx-auto mt-28">
                    <Spinner className="me-3 text-gray-300 h-16 w-16" />
                </div>
            )}

            {!isFetching && !roles?.length && (
                <div className='mx-auto items-center mt-16 grid place-items-center text-center'>
                    <div className="bg-grey w-[170px] grid place-items-center  h-[170px] rounded-[50%]">
                        <Shield className='w-[100px] h-[100px] text-primary' />
                    </div>
                    <h1 className="text-[1.5rem] my-6  font-bold">No Data Found!</h1>
                    <ButtonLink to="/setting/access_control/create" variant="primary">
                        Add
                    </ButtonLink>
                </div>
            )}

            {!isFetching && !!roles?.length && (
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
                        <ButtonLink to="/setting/access_control/create" variant="primary">
                            Add
                        </ButtonLink>
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
            )} */}
        </div>
    )
}