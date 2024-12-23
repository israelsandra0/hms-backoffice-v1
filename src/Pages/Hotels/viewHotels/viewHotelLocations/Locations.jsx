import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiDelete, get } from "@/functions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Search } from "lucide-react";
import { useMemo, useState } from "react";
import Spinner from "@/components/ui/spinner";
import { useConfirm } from "@/hooks/use-confirm";
import { useToast } from "@/hooks/use-toast";
import AddHotelLocation from "./AddHotelLocation";
import EditHotelLocation from "./EditHotelLocation";
import LocationsTable from "./LocationsTable";
import { useEffect } from "react";


export default function Locations({ hotelId }) {


    const [addLocationBox, setAddLocationBox] = useState(false);
    const [searchFilter, setSearchFilter] = useState("");

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

    const refreshHotelLocations = () => {

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
    }

    const closeAddLocationBox = () => {
        setAddLocationBox(false);
        refreshHotelLocations()
    };



    if (isLoading) {
        return <div className="text-center flex items-center justify-center mx-auto my-5">
            <Spinner className="me-3 text-gray-300 h-16 w-16" />
        </div>
    }

    return (
        <div>
            <div className="flex justify-between mx-4 my-8 ">
                {/* Search input */}
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
                <Button variant="primary" onClick={() => setAddLocationBox(true)}>
                    + Add
                </Button>
            </div>

            {!isPending && locations?.length && (
                <LocationsTable locations={locations} hotelId={hotelId} refreshHotelLocations={refreshHotelLocations}searchFilter={searchFilter}  />
            )}

            {!!addLocationBox && (
                <AddHotelLocation closeFn={closeAddLocationBox} hotelId={hotelId} />
            )}
        </div>
    )
}
