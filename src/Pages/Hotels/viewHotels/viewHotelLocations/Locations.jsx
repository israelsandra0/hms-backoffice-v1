import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiDelete, get } from "@/functions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
import { useMemo, useState } from "react";
import Spinner from "@/components/ui/spinner";
import { useConfirm } from "@/hooks/use-confirm";
import { useToast } from "@/hooks/use-toast";
import AddHotelLocation from "./AddHotelLocation";
import EditHotelLocation from "./EditHotelLocation";
import LocationsTable from "./LocationsTable";
import { useEffect } from "react";


export default function Locations({ hotelId }) {

     // Number of items per page
    const [addLocationBox, setAddLocationBox] = useState(false);

    const { data: locations, isLoading, isPending, refetch: fetchHotelsLocations } = useQuery({
        queryKey: ["hotelLocations"],
        queryFn: async () => {
            // setLocations([])
            const res = await get(`/hotels/${hotelId}/locations`);
            if (!res.ok) {
                throw new Error("Failed to fetch hotel data");
            }
            const response = await res.json();
            //setLocations(response.data)
            return response.data;
        },
        enabled: false
    });

    useEffect(() => {
        fetchHotelsLocations()
    }, [])


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

            {!isPending && locations?.length && (
                <LocationsTable locations={locations} hotelId={hotelId}/>
            )}

            {!!addLocationBox && (
                <AddHotelLocation closeFn={closeAddLocationBox} hotelId={hotelId} />
            )}
        </div>
    )
}
