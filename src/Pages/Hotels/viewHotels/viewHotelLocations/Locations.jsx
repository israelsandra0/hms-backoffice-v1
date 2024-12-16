import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiDelete, get } from "@/functions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { useMemo, useState } from "react";
import Spinner from "@/components/ui/spinner";
import { useConfirm } from "@/hooks/use-confirm";
import { useToast } from "@/hooks/use-toast";
import AddHotelLocation from "./AddHotelLocation";
import EditHotelLocation from "./EditHotelLocation";
import LocationsTable from "./LocationsTable";


export default function Locations({ hotelId }) {

    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 4
     // Number of items per page
    const { confirmAction } = useConfirm()
    const { toast } = useToast()
    const [addLocationBox, setAddLocationBox] = useState(false);
    const [editLocation, setEditLocation] = useState({});
    //const [locations, setLocations] = useState([]);

    const { data: locations, isLoading, isFetching, refetch: fetchHotelsLocations } = useQuery({
        queryKey: ["hotelLocations"],
        queryFn: async () => {
            // setLocations([])
            const res = await get(`/hotels/${hotelId}/locations`);
            console.log('welcome')
            if (!res.ok) {
                throw new Error("Failed to fetch hotel data");
            }
            const response = await res.json();
            //setLocations(response.data)
            return response.data;
        }
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

    const handleDeleteResponse = (res) => {
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

    const queryClient = useQueryClient()

    const closeAddLocationBox = () => {
        setAddLocationBox(false);
        queryClient.invalidateQueries(
            {
                queryKey: ['hotelLocations'],
                refetchType: 'all'
            },
            {
                cancelRefetch: true
            }
        )
        fetchHotelsLocations()
    };

    const handleEditClose = () => {
        setEditLocation({});
        fetchHotelsLocations();
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

    if (isLoading) {
        return <div className="text-center flex items-center justify-center mx-auto my-5">
            <Spinner className="me-3 text-gray-300 h-16 w-16" />
        </div>
    }

    return (
        <div>
            <div className="text-right mr-4 my-8 ">
                <Button variant="primary" onClick={() => setAddLocationBox(true)}>
                    + Add
                </Button>
            </div>

            {/* <div className="content w-[95%] my-6 ml-6 rounded-[8px] border border-gray-200 overflow-hidden">
                {locations?.length && (
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
                )}
            </div> */}

            {!isFetching && (
                <LocationsTable table={table} />
            )}

            <Pagination table={table} pageIndex={pageIndex} setPageIndex={setPageIndex} />

            {!!addLocationBox && (
                <AddHotelLocation closeFn={closeAddLocationBox} hotelId={hotelId} />
            )}

            {!!editLocation?.id && (
                <EditHotelLocation closeFn={handleEditClose} locationId={editLocation} hotelId={hotelId} />
            )}

        </div>
    )
}
