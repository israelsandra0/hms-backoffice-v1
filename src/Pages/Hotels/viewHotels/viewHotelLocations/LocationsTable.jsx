import Pagination from "@/components/Pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, useReactTable } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useToast } from "@/hooks/use-toast";
import EditHotelLocation from "./EditHotelLocation";
import { apiDelete } from "@/functions";

export default function LocationsTable({locations, hotelId, setLocations}) {

    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10
    const { confirmAction } = useConfirm()
    const { toast } = useToast()
    const [editLocation, setEditLocation] = useState({});

    // // Define columns (no change needed to the columns)
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
                const location = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <MoreVertical className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 cursor-pointer">
                            <DropdownMenuItem onClick={() => setEditLocation(location)}>
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
            setPageIndex(pageIndex ?? 0);
        },
        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
    });

    const confirmModalSetup = {
        delete: {
            title: 'Are you sure?',
            message: "you're about to delete this location, This action cannot be undone.",
            confirmButtonText: 'Delete',
            buttonVariant: 'error',
            cancelButtonText: 'Cancel'
        }
    }

    const handleConfirmation = async (locationId, hotelAction) => {
        if (hotelAction === 'delete') {
            return await apiDelete(`/hotels/${hotelId}/locations/destroy/${locationId}`)
        }
    }

    const handleDeleteResponse = (res, locationId) => {
        if (res.ok) {
            // Filter out the deleted location from the locations array
            setLocations(prevLocations => prevLocations.filter(location => location.id !== locationId));
            toast({
                success: true,
                duration: 5000,
                title: 'Hotel Location deleted successfully!'
            });
        } else {
            toast({
                error: true,
                duration: 5000,
                title: 'Failed to delete the hotel location. Please try again.'
            });
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
            }

        })
    };


    const handleEditClose = () => {
        setEditLocation({});
    };


    return (
        <div className="content w-[95%] my-6 ml-6 rounded-[8px] border border-gray-200 overflow-hidden">
            {table.getPageCount() > 1 && (
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
                    {/* <TableBody>
                            {locations.map((location) => (
                                <TableRow key={location.id}>
                                    <TableCell>{location.address}</TableCell>
                                    <TableCell>{location.state}</TableCell>
                                    <TableCell>{location.city}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>
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
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody> */}
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
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

            {!!editLocation?.id && (
                <EditHotelLocation closeFn={handleEditClose} locationId={editLocation} hotelId={hotelId} />
            )}

        </div>
    )
}