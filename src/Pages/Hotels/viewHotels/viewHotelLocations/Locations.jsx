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

    const [locationsData, setLocationsData] = useState([]);
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

    // Fetch the locations when the component mounts
    useEffect(() => {
        if (locations) {
            setLocationsData(locations);
        }
    }, [locations]);


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

            {!isPending && locations?.length && (
                <LocationsTable locations={locations} hotelId={hotelId} setLocations={setLocationsData}/>
            )}

            {!!addLocationBox && (
                <AddHotelLocation closeFn={closeAddLocationBox} hotelId={hotelId} />
            )}
        </div>
    )
}
