import { get } from "@/functions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import Spinner from "@/components/ui/spinner";
import LocationsTable from "./LocationsTable";
import { useEffect } from "react";


export default function Locations({ hotelId }) {

    const [searchFilter, setSearchFilter] = useState("");

    const { data: locations, isLoading, isPending, refetch: fetchHotelLocations } = useQuery({
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
        fetchHotelLocations()
    }, [])


    if (isLoading) {
        return <div className="text-center flex items-center justify-center mx-auto my-5">
            <Spinner className="me-3 text-gray-300 h-16 w-16" />
        </div>
    }

    return (
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
            </div>

            {!isPending && locations?.length && (
                <LocationsTable locations={locations}  searchFilter={searchFilter}  />
            )}
        </div>
    )
}
