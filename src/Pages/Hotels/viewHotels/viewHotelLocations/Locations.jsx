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
import { useState, useMemo, useEffect } from "react";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import { useConfirm } from "@/hooks/use-confirm";
import { apiDelete, get } from "@/functions";
import { useToast } from "@/hooks/use-toast";
import EditHotelLocation from "./EditHotelLocation";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner";
import UserAreaHeader from "@/components/UserAreaHeader";

export default function Locations({ hotelId }) {

    const { data: locations, isLoading, refetch: fetchHotelsLocations } = useQuery({
        queryKey: ["hotelLocations"],
        queryFn: async () => {
            const res = await get(`/hotels/${hotelId}/locations`);
            if (!res.ok) {
                throw new Error("Failed to fetch hotel data");
            }
            const response = await res.json();
            return response.data;
        }
    });

    if (isLoading) {
        return (
            <>
                <div className="text-center flex items-center justify-center mx-auto my-5">
                    <Spinner className="me-3 text-gray-300 h-16 w-16" />
                </div>
            </>
        )
    }


    const [addLocationBox, setAddLocationBox] = useState(false);
    const { confirmAction } = useConfirm()
    const { toast } = useToast()
    
    const handleEditClose = () => {
        setEditLocation({});
        fetchHotelsLocations();
    };
    
    const [editLocation, setEditLocation] = useState({});


    // // Pagination state
    const [pageIndex, setPageIndex] = useState(0); // Current page
    const pageSize = 5 // Number of items per page

    const closeAddLocationBox = () => {
        setAddLocationBox(false)
        fetchHotelsLocations()
    };


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
            setPageIndex(pageIndex);
        },
        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
    });

    const handleDeleteResponse = (res) => {
        console.log(res)
        if (res.ok) {
            setPageIndex(0)

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

    return (
        <div>
            <div className="text-right mr-4 my-8 ">
                <Button variant="primary" onClick={() => setAddLocationBox(true)}>
                    + Add
                </Button>
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

            <Pagination table={table} pageIndex={pageIndex} setPageIndex={setPageIndex} />

            {/* Add Location Modal */}
            {!!addLocationBox && (
                <AddHotelLocation closeFn={closeAddLocationBox} hotelId={hotelId} />
            )}

            {!!editLocation?.id && (
                <EditHotelLocation closeFn={handleEditClose} locationId={editLocation} hotelId={hotelId} />
            )}
        </div>
    );
}
