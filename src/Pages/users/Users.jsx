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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "@/hooks/use-toast";
import AddUsers from "./AddUser";

export default function Users() {

    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [searchFilter, setSearchFilter] = useState("");
    const [addUserBox,  setAddUserBox] = useState(false);
    const [editRoleBox, setEditRoleBox] = useState(false);
    const [roleId, setRoleId] = useState(null)
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10
    const { confirmAction } = useConfirm()


    // const handleDeleteResponse = (res) => {
    //     if (res.ok) {
    //         toast({
    //             success: true,
    //             duration: 5000,
    //             title: 'Hotel deleted successfully!'
    //         });
    //         fetchAllHotels()
    //     } else {
    //         toast({
    //             error: true,
    //             duration: 5000,
    //             title: 'Failed to delete the hotel. Please try again.'
    //         });
    //     }
    // }


    // const confirmModalSetup = {
    //     delete: {
    //         title: 'Are you sure?',
    //         message: "you're about to delete this hotel, This action cannot be undone.",
    //         confirmButtonText: 'Delete',
    //         buttonVariant: 'error',
    //         cancelButtonText: 'Cancel'
    //     },
    //     activate: {
    //         title: 'Activate Hotel?',
    //         message: 'This action will activate the hotel and allow it to be visible to users.',
    //         confirmButtonText: 'Activate',
    //         buttonVariant: 'primary',
    //         cancelButtonText: 'Cancel'
    //     },
    //     deactivate: {
    //         title: 'Deactivate Hotel?',
    //         message: 'This action will deactivate the hotel and allow it to be invisible to users.',
    //         confirmButtonText: 'Deactivate',
    //         buttonVariant: 'primary',
    //         cancelButtonText: 'Cancel'
    //     }
    // }
    
    // const handleConfirmation = async (hotelId) => await apiDelete(`/hotels/destroy/${hotelId}`)


    // Handle button click for delete/activation/deactivation
    // const handleActionClick = (hotelId, actionType) => {
    //     confirmAction({
    //         ...confirmModalSetup[actionType.toLowerCase()],
    //         isDestructive: actionType.toLowerCase() === 'delete',
    //         confirmFn: () => handleConfirmation(hotelId, actionType),
    //         completeFn: (res) => {
    //             if (actionType.toLowerCase() === 'delete') {
    //                 handleDeleteResponse(res)
    //             }
    //             else {
    //                 handleStatusUpdateResponse(res, actionType == 'Activate')
    //             }
    //         }

    //     })
    // };


    const columns = useMemo(() => [
        {
            header: "Name",
            cell: (info) => {
                return (
                    <span>
                        {`${info.row.original.firstName} ${info.row.original.lastName}`}
                    </span>
                );
            },
        },
        {
            header: "Role",
            accessorKey: "roleId",
        },
        // {
        //     header: "Email",
        //     cell: (info) => {
        //         return (
        //             <span>
        //                 {info.row.original.email ? `${info.row.original.email.slice(0, 2)}${"*".repeat(info.row.original.email.indexOf("@") - 1)}
        //                     ${info.row.original.email.slice(info.row.original.email.indexOf("@"))}` : "N/A"}
        //             </span>
        //         );
        //     },
        // },
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
                            <DropdownMenuItem onClick={() => handleActionClick(roleId, 'delete')}>
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], []);

    const filteredUsers = useMemo(() => {
        if (!searchFilter) return users || [];

        const lowerCaseFilter = searchFilter.toLowerCase();

        return (users || []).filter(user =>
            user.username.toLowerCase().includes(lowerCaseFilter)
        );
    }, [users, searchFilter]);

    const table = useReactTable({
        data: filteredUsers,
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

    const { isLoading, refetch: fetchUsers } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await get(`/users`);
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            const response = await res.json();
            setUsers(response.data)
            return response.data;
        },
        enabled: false
    });

    useEffect(() => {
        fetchUsers()
    }, [])

    const closeAddUserBox = () => {
        setAddUserBox(false)
        fetchUsers()
    }
    // const handleEditClose = () => {
    //     setEditRoleBox(false)
    //     fetchRoles()
    // }


    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbPage>User</BreadcrumbPage>
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

            {!isLoading && !users?.length && (
                <div className='mx-auto items-center mt-16 grid place-items-center text-center'>
                    <div className="bg-grey w-[170px] grid place-items-center  h-[170px] rounded-[50%]">
                        <Shield className='w-[100px] h-[100px] text-primary' />
                    </div>
                    <h1 className="text-[1.5rem] my-6  font-bold">No Data Found!</h1>
                    <Button variant='primary' onClick={() => (setAddUserBox(true))}>Add</Button>
                </div>
            )}
            {!!users?.length && (
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
                        <Button variant='primary' onClick={() => (setAddUserBox(true))}>Add</Button>
                    </div>
                    <div className="content w-[95%] my-6 mx-auto rounded-[8px] border border-gray-200 overflow-hidden">
                        {table.getPageCount() > 0 && (
                            <Table>
                                <TableHeader className="bg-lightPrimary">
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Role</TableHead>
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

            {!!addUserBox && (
                <AddUsers closeFn={closeAddUserBox} />
            )}

            {/* {!!editRoleBox && <EditRole closeFn={handleEditClose} editId={roleId} />} */}
        </div>
    )
}