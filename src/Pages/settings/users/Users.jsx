import Pagination from "@/components/Pagination";
import UserAreaHeader from "@/components/UserAreaHeader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiDelete, get, getDataObject, post, put } from "@/functions";
import { useQuery } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { MoreVertical, Search, Shield, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "@/hooks/use-toast";
import AddUsers from "./AddUser";
import { Badge } from "@/components/ui/badge";
import EditUserManagement from "./EditUsers";
import { USER_DATA_KEY } from "@/constants";

export default function Users() {

    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [searchFilter, setSearchFilter] = useState("");
    const [addUserBox, setAddUserBox] = useState(false);
    const [editUserBox, setEditUserBox] = useState(false);
    const [userId, setUserId] = useState(null)
    const [pageIndex, setPageIndex] = useState(0);
    const [roleData, setRoleData] = useState()
    const pageSize = 10
    const { confirmAction } = useConfirm()


    const loggedInUser = getDataObject(USER_DATA_KEY);

    const confirmModalSetup = {
        delete: {
            title: 'Are you sure?',
            message: "you're about to delete this user, This action cannot be undone.",
            confirmButtonText: 'Delete',
            buttonVariant: 'error',
            cancelButtonText: 'Cancel'
        },
        activate: {
            title: 'Activate User?',
            message: 'This action will activate the user and allow it to be visible to users.',
            confirmButtonText: 'Activate',
            buttonVariant: 'primary',
            cancelButtonText: 'Cancel'
        },
        deactivate: {
            title: 'Deactivate User?',
            message: 'This action will deactivate the user and allow it to be invisible to users.',
            confirmButtonText: 'Deactivate',
            buttonVariant: 'primary',
            cancelButtonText: 'Cancel'
        }
    }

    const handleConfirmation = async (userId, userAction) => await put(`/users/${userId}/status`, { isActive: userAction === 'Activate' })


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
            cell: (info) => {
                return (
                    info.row.original.isAdmin == 1 ? (

                        <span>
                            <Badge variant='primary' className=" bg-lightPrimary text-primary">Admin <Star className=" p-1"/> </Badge>
                        </span>
                    ) : (
                        <span>
                            <Badge variant='gray'>{`${info.row.original.role?.name}`}</Badge>
                        </span> 
                    )
                );
            },
        },
        {
            header: "Status",
            cell: (info) => {
                return (
                    <span>
                       <Badge variant={info.row.original.isActive ? `success` : 'error'}>{info.row.original.isActive ? `Active` : 'Inactive'}</Badge>
                    </span>
                );
            },
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

                const isLoggedInUser = row.original.id === loggedInUser.id;
               

                return (
                    <div>

                        {!isLoggedInUser && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <MoreVertical className="cursor-pointer" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 cursor-pointer">
                                    <DropdownMenuItem onClick={() => { setUserId(row.original); setEditUserBox(true) }}>
                                        <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleActionClick(row.original.id, row.original.isActive ? 'Deactivate' : 'Activate')}>
                                        <span>{row.original.isActive ? 'Deactivate' : 'Activate'}</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
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


    const { data: data2, refetch: fetchAllRoles } = useQuery({
        queryKey: ["users/create"],
        queryFn: async () => {
            const res = await get(`/users/create`);
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            const response = await res.json();
            setRoleData(response.data.roles)
            return response.data.roles;
        },
        enabled: false
    });

    const { isFetching, refetch: fetchUsers } = useQuery({
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
        fetchAllRoles()
        fetchUsers()
    }, [])


    const handleStatusUpdateResponse = (res, isActive) => {
        if (res.ok) {
            toast({
                success: true,
                duration: 5000,
                title: isActive ? 'User activated successfully!' : 'User deactivated successfully!'
            });
            fetchUsers();
        } else {
            toast({
                error: true,
                duration: 5000,
                title: 'Failed to update user staus. Please try again.'
            });
        }
    }

    const handleActionClick = (userId, actionType) => {
        confirmAction({
            ...confirmModalSetup[actionType.toLowerCase()],
            isDestructive: actionType.toLowerCase() === 'delete',
            confirmFn: () => handleConfirmation(userId, actionType),
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


    const closeAddUserBox = () => {
        setAddUserBox(false)
        fetchUsers()
    }
    const handleEditClose = () => {
        setEditUserBox(false)
        fetchUsers()
    }


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

            {isFetching && (
                <div className="text-center flex items-center justify-center mx-auto mt-28">
                    <Spinner className="me-3 text-gray-300 h-16 w-16" />
                </div>
            )}

            {!isFetching && !users?.length && (
                <div className='mx-auto items-center mt-16 grid place-items-center text-center'>
                    <div className="bg-grey w-[170px] grid place-items-center  h-[170px] rounded-[50%]">
                        <Shield className='w-[100px] h-[100px] text-primary' />
                    </div>
                    <h1 className="text-[1.5rem] my-6  font-bold">No Data Found!</h1>
                    <Button variant='primary' onClick={() => (setAddUserBox(true))}>Add</Button>
                </div>
            )}

            {!isFetching && !!users?.length && (
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
                        <Button variant='primary' onClick={() => (setAddUserBox(true))}>Add </Button>
                    </div>
                    <div className="content w-[95%] my-6 mx-auto rounded-[8px] border border-gray-200 overflow-hidden">
                        {table.getPageCount() > 0 && (
                            <Table>
                                <TableHeader className="bg-lightPrimary">
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} className="hover:bg-grey">
                                            {row.getVisibleCells().map((cell) => {

                                                return (
                                                    <TableCell key={row.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                );
                                            })}
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
                <AddUsers closeFn={closeAddUserBox} roleData={roleData} />
            )}

            {!!editUserBox && <EditUserManagement closeFn={handleEditClose} editId={userId} />}
        </div>
    )
}