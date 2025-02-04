import Pagination from "@/components/Pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { flexRender, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Star, StarHalf, StarIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RiStarFill } from "@remixicon/react";
import { useConfirm } from "@/hooks/use-confirm";
import { Card, CardContent } from "@/components/ui/card";



export default function UsersTable({ users, hotelId, searchFilter }) {

    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10;
    const { confirmAction } = useConfirm()
    const [selectedUser, setSelectedUser] = useState(null);

    const columns = useMemo(
        () => [
            {
                header: "Name",
                cell: (info) => {
                    const isAdmin = info.row.original.isAdmin;
                    return (
                        <span className="cursor-pointer">
                            {`${info.row.original.firstName} ${info.row.original.lastName}`}
                            {isAdmin === 1 && (
                                <RiStarFill className="inline rounded w-7 ml-2 p-1 bg-lightPrimary text-primary" />
                            )}
                        </span>
                    );
                },
            },
            {
                header: "Location",
                cell: (info) => {
                    const hotelLocation = info.row.original.hotelLocation;

                    return hotelLocation?.state ? (
                        <span>{`${hotelLocation.city}, ${hotelLocation.state}, ${hotelLocation.country}`}</span>
                    ) : (
                        <span></span>
                    );
                }
            },
            {
                header: "Status",
                cell: (info) => {
                    const status = info.row.original.isActive;

                    return status ? (
                        <span> <Badge variant="success">Active</Badge></span>
                    ) : (
                        <span><Badge variant="gray">Inactive</Badge></span>
                    );
                }
            },
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                    const location = row.original;
                    const isAdmin = row.original.isAdmin;

                    return (
                        <span>
                            {isAdmin === 1 && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <MoreVertical className="cursor-pointer" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 cursor-pointer">
                                        <DropdownMenuItem onClick={() => handleActionClick(hotelId.id, hotelId.isActive ? 'Activate' : 'Deactivate')}>
                                            <span>{hotelId.isActive ? 'Activate' : 'Deactivate'}</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => handleActionClick(location.id, "delete")}
                                        >
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </span>
                    );
                },
            },
        ],
        []
    );

    const handleStatusUpdateResponse = (res, isActivate) => {
        if (res.ok) {
            toast({
                success: true,
                duration: 5000,
                title: isActivate ? 'User activated successfully!' : 'User deactivated successfully!'
            });
            fetchAllHotels();
        } else {
            toast({
                error: true,
                duration: 5000,
                title: 'Failed to update user staus. Please try again.'
            });
        }
    }


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

    // Handle button click for delete/activation/deactivation
    const handleActionClick = (hotelId, actionType) => {
        confirmAction({
            ...confirmModalSetup[actionType.toLowerCase()],
            isDestructive: actionType.toLowerCase() === 'delete',
            confirmFn: () => handleConfirmation(hotelId, actionType),
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

    //handle delete, activation / deactivation fetching
    const handleConfirmation = async (hotelId, hotelAction) => {

        if (hotelAction === 'Activate' || hotelAction === 'Deactivate') {
            return await post(`/hotels/update-active-status/${hotelId}`, { isActive: hotelAction === 'Activate' })
        } else {
            return await apiDelete(`/hotels/destroy/${hotelId}`)

        }
    }

    const filteredUsers = useMemo(() => {
        if (!searchFilter) return users;

        const lowerCaseFilter = searchFilter.toLowerCase();

        return users.filter(user =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(lowerCaseFilter)
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

    return (
        <div className="content w-[95%] my-6 mx-auto rounded-[8px] border border-gray-200 overflow-hidden">
            {table.getPageCount() > 0 && (
                <Table>
                    <TableHeader className="bg-lightPrimary">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="hover:bg-grey" onClick={() => setSelectedUser(row.original)}>
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

            {!!selectedUser && (
                <Card className="fixed inset-x-0 inset-y-0 bg-black/50 h-screen flex justify-center items-center">
                    <CardContent className='fixed rounded sm:rounded-xl md:rounded-xl  lg:rounded-xl left-[50%] top-[50%] z-50 grid w-[400px] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]  dark:border-neutral-800 dark:bg-neutral-950'>
                        <X className="ring-2 p-1 ring-[#F2F2F5] rounded-full text-gray-400" onClick={() => setSelectedUser(null)} />
                        <div className="grid justify-center">
                            <div  className="text-primary bg-lightPrimary rounded-full w-[80px] h-[80px] text-[2rem] font-bold items-center flex justify-center">
                                <p>{`${selectedUser.firstName.charAt(0)}`}</p>
                            </div>
                            <b>{`${selectedUser.firstName} ${selectedUser.lastName}`}</b>
                        </div>
                        <p><strong>First-Name:</strong> {`${selectedUser.firstName}`}</p>
                        <p><strong>Last-Name:</strong> {` ${selectedUser.lastName}`}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Phone:</strong> {selectedUser.phone ? `*** **** ${selectedUser.phone.slice(-4)}` : 'N/A'}</p>
                    </CardContent>
                </Card>
            )}

            <Pagination
                table={table}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
            />
        </div>
    );
}
