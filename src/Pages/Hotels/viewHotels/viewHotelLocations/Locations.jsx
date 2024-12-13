import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import AddHotelLocation from "./AddHotelLocation";
import { useState, useMemo } from "react";
import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import { useConfirm } from "@/hooks/use-confirm";
import { apiDelete } from "@/functions";
import { useToast } from "@/hooks/use-toast";

export default function Locations({ locations, hotelId }) {
    const [addLocationBox, setAddLocationBox] = useState(false);
    const closeAddLocationBox = () => setAddLocationBox(false);
    const { confirmAction } = useConfirm()
    const { toast } = useToast()

    // Pagination state
    const [pageIndex, setPageIndex] = useState(0); // Current page
    const pageSize = 2 // Number of items per page



    const handleDeleteResponse = (res) => {
        if (res.ok) {
            console.log(res)
            toast({
                success: true,
                duration: 5000,
                title: 'Hotel deleted successfully!'
            });
        } else {
            toast({
                error: true,
                duration: 5000,
                title: 'Failed to delete the hotel. Please try again.'
            });
        }
    }

    const confirmModalSetup = {
        delete: {
            title: 'Are you sure?',
            message: "you're about to delete this hotel, This action cannot be undone.",
            confirmButtonText: 'Delete',
            buttonVariant: 'error',
            cancelButtonText: 'Cancel'
        }
    }

    const handleConfirmation = async (locationId, hotelAction) => {

        if (hotelAction === 'delete' ) {
            return await apiDelete(`/hotels/${hotelId}/locations/destroy/${locationId}`)
        }
    }

    // Handle button click for delete/activation/deactivation
    const handleActionClick = (locationId, actionType) => {
        confirmAction({
            ...confirmModalSetup[actionType.toLowerCase()],
            isDestructive: actionType.toLowerCase() === 'delete',
            confirmFn: () => handleConfirmation(locationId, actionType),
            completeFn: (res) => {
                if (actionType.toLowerCase() === 'delete') {
                    handleDeleteResponse(res, locationId)
                }
                else {
                    handleStatusUpdateResponse(res, actionType == 'Activate')
                }
            }

        })
    };


    // Define columns (no change needed to the columns)
    const columns = useMemo(() => [
        {
            header: "Address",
            accessorKey: "address",
        },
        {
            header: "State",
            accessorKey: "state",
        },
        {
            header: "City",
            accessorKey: "location_counts",
        },
        {
            header: "Number of Users",
            accessorKey: "location_counts",
        },
        {
            header: "Rooms",
            accessorKey: "rooms",
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const location  = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <MoreVertical className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 cursor-pointer">
                            <DropdownMenuItem>
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleActionClick(location.id, 'delete')}>
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], []);

    // Set up the table with pagination
    const table = useReactTable({
        data: locations,
        columns,
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        onPaginationChange: ({ pageIndex }) => {
            setPageIndex(pageIndex);
        },
        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>
            <div className="flex items-center justify-between px-6 py-4">
                <div className="text-right mr-4 mt-4">
                    <Button variant="primary" onClick={() => setAddLocationBox(true)}>
                        + Add
                    </Button>
                </div>
            </div>

            <div className="content w-[95%] my-6 ml-6 rounded-[8px] border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-lightPrimary">
                        <TableRow>
                            <TableHead>Address</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Number of Users</TableHead>
                            <TableHead>Rooms</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

           <Pagination table={table} pageIndex={pageIndex} setPageIndex={setPageIndex}/>

            {/* Add Location Modal */}
            {!!addLocationBox && (
                <AddHotelLocation closeFn={closeAddLocationBox} hotelId={hotelId} />
            )}
        </div>
    );
}
